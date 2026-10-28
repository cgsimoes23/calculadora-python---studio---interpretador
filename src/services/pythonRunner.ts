/**
 * Service to execute Python code directly in the browser via Pyodide WebAssembly.
 * Also provides an instant fallback math evaluator for instant responsiveness.
 */

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<any>;
  }
}

export interface PythonExecutionResult {
  success: boolean;
  output: string;
  result?: string;
  error?: string;
  executionTimeMs: number;
}

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

class PythonRunnerService {
  private pyodide: any = null;
  private status: PyodideStatus = 'idle';
  private loadingPromise: Promise<any> | null = null;
  private statusListeners: Array<(status: PyodideStatus) => void> = [];

  constructor() {
    // Attempt auto-load on start
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public getStatus(): PyodideStatus {
    return this.status;
  }

  public onStatusChange(listener: (status: PyodideStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private notifyStatus(status: PyodideStatus) {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  public async init(): Promise<any> {
    if (this.pyodide) {
      return this.pyodide;
    }
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.notifyStatus('loading');

    this.loadingPromise = new Promise(async (resolve, reject) => {
      try {
        // Wait up to 5 seconds for script tag to be ready if needed
        let attempts = 0;
        while (!window.loadPyodide && attempts < 25) {
          await new Promise(r => setTimeout(r, 200));
          attempts++;
        }

        if (!window.loadPyodide) {
          throw new Error('Pyodide script not found in window');
        }

        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });

        // Initialize standard packages and environment
        await pyodideInstance.runPythonAsync(`
import sys
import io
import math
import statistics
import random
import datetime

# Pre-setup namespace
ans = 0
x = 0
y = 0
`);

        this.pyodide = pyodideInstance;
        this.notifyStatus('ready');
        resolve(pyodideInstance);
      } catch (err: any) {
        console.warn('Pyodide load failed, fallback math runner will be used:', err);
        this.notifyStatus('error');
        // Do not reject hard, allow app to function with fallback
        resolve(null);
      }
    });

    return this.loadingPromise;
  }

  /**
   * Run Python code in Pyodide with stdout capture and timing
   */
  public async execute(code: string): Promise<PythonExecutionResult> {
    const startTime = performance.now();

    // If Pyodide is not ready, try to load it or fallback
    if (!this.pyodide) {
      await this.init();
    }

    if (!this.pyodide) {
      // Fallback for simple mathematical expressions
      return this.fallbackEvaluate(code, startTime);
    }

    try {
      // Setup stdout/stderr redirection in Python
      const runScript = `
import sys
import io

__stdout_buffer = io.StringIO()
__stderr_buffer = io.StringIO()
__old_stdout = sys.stdout
__old_stderr = sys.stderr
sys.stdout = __stdout_buffer
sys.stderr = __stderr_buffer

__eval_result = None
try:
${code
  .split('\n')
  .map(line => '    ' + line)
  .join('\n')}
    # If the last line is an expression, evaluate it
except Exception as e:
    __eval_result = ("__ERROR__", type(e).__name__ + ": " + str(e))
finally:
    sys.stdout = __old_stdout
    sys.stderr = __old_stderr

__captured_stdout = __stdout_buffer.getvalue()
__captured_stderr = __stderr_buffer.getvalue()
(__captured_stdout, __captured_stderr, __eval_result)
`;

      // Alternatively, let's also allow single expressions or direct statements
      const isSimpleExpr = !code.includes('\n') && !code.includes('=') && !code.startsWith('def') && !code.startsWith('for') && !code.startsWith('if') && !code.startsWith('import');

      let finalOutput = '';
      let finalResultStr: string | undefined = undefined;

      if (isSimpleExpr) {
        // Direct evaluate expression
        const evalCode = `
import math, statistics, random
try:
    __res = eval("""${code.replace(/"/g, '\\"')}""")
    ans = __res
    str(__res)
except Exception as e:
    "__ERR__:" + type(e).__name__ + ": " + str(e)
`;
        const res = await this.pyodide.runPythonAsync(evalCode);
        const timeTaken = performance.now() - startTime;
        if (typeof res === 'string' && res.startsWith('__ERR__:')) {
          return {
            success: false,
            output: '',
            error: res.replace('__ERR__:', ''),
            executionTimeMs: Math.round(timeTaken * 10) / 10,
          };
        }
        return {
          success: true,
          output: String(res),
          result: String(res),
          executionTimeMs: Math.round(timeTaken * 10) / 10,
        };
      }

      // Multi-line code execution
      const wrapper = `
import sys, io
sys_stdout = sys.stdout
sys_stderr = sys.stderr
captured_out = io.StringIO()
sys.stdout = captured_out
sys.stderr = captured_out

_err = None
_result = None

try:
    # Execute code
    _namespace = globals()
    exec("""${code.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}""", _namespace)
except Exception as e:
    _err = f"{type(e).__name__}: {e}"
finally:
    sys.stdout = sys_stdout
    sys.stderr = sys_stderr

(captured_out.getvalue(), _err)
`;
      const [stdoutOutput, err] = await this.pyodide.runPythonAsync(wrapper);
      const timeTaken = performance.now() - startTime;

      if (err) {
        return {
          success: false,
          output: stdoutOutput || '',
          error: String(err),
          executionTimeMs: Math.round(timeTaken * 10) / 10,
        };
      }

      return {
        success: true,
        output: stdoutOutput || '(Código executado com sucesso sem saída de terminal)',
        result: stdoutOutput ? stdoutOutput.trim().split('\n').pop() : 'OK',
        executionTimeMs: Math.round(timeTaken * 10) / 10,
      };
    } catch (err: any) {
      const timeTaken = performance.now() - startTime;
      return {
        success: false,
        output: '',
        error: err?.message || String(err),
        executionTimeMs: Math.round(timeTaken * 10) / 10,
      };
    }
  }

  /**
   * Fast client-side fallback for mathematical expressions conforming to Python math syntax
   */
  public fallbackEvaluate(expr: string, startTime: number): PythonExecutionResult {
    try {
      // Clean and map Python operators to JS
      let clean = expr.trim();

      // Handle power **
      // Handle integer division //
      // Handle math functions
      // We safely compute using JS Math with Python aliases
      const mathScope = {
        math: Math,
        sqrt: Math.sqrt,
        sin: (x: number) => Math.sin(x),
        cos: (x: number) => Math.cos(x),
        tan: (x: number) => Math.tan(x),
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        log: Math.log,
        log10: Math.log10,
        log2: Math.log2,
        exp: Math.exp,
        pi: Math.PI,
        e: Math.E,
        abs: Math.abs,
        pow: Math.pow,
        round: Math.round,
        floor: Math.floor,
        ceil: Math.ceil,
        radians: (deg: number) => (deg * Math.PI) / 180,
        degrees: (rad: number) => (rad * 180) / Math.PI,
        factorial: (n: number): number => {
          if (n < 0 || !Number.isInteger(n)) throw new Error('ValueError: factorial() only accepts integral values');
          if (n === 0 || n === 1) return 1;
          let res = 1;
          for (let i = 2; i <= n; i++) res *= i;
          return res;
        },
      };

      // Transform Python operators
      // Replace // with Math.floor(a / b)
      let jsCode = clean
        .replace(/math\.pi/g, 'pi')
        .replace(/math\.e/g, 'e')
        .replace(/math\.sqrt/g, 'sqrt')
        .replace(/math\.sin/g, 'sin')
        .replace(/math\.cos/g, 'cos')
        .replace(/math\.tan/g, 'tan')
        .replace(/math\.log10/g, 'log10')
        .replace(/math\.log2/g, 'log2')
        .replace(/math\.log/g, 'log')
        .replace(/math\.exp/g, 'exp')
        .replace(/math\.radians/g, 'radians')
        .replace(/math\.degrees/g, 'degrees')
        .replace(/math\.factorial/g, 'factorial');

      // Replace // (integer division)
      // Replace a // b with Math.floor(a / b)
      while (jsCode.includes('//')) {
        jsCode = jsCode.replace(/(\d+(\.\d+)?)\s*\/\/\s*(\d+(\.\d+)?)/g, 'Math.floor($1 / $3)');
      }

      // Check for zero division
      if (/\/\s*0(?![.\d])/.test(jsCode)) {
        throw new Error('ZeroDivisionError: division by zero');
      }

      // Safe evaluation with allowed characters only
      const safePattern = /^[0-9+\-*/%^().,\s<>&|~!=_a-zA-Z]+$/;
      if (!safePattern.test(jsCode)) {
        throw new Error('SyntaxError: expressão contém caracteres inválidos');
      }

      // Replace ** with ** (supported in ES2016+)
      // Run evaluation
      const func = new Function(...Object.keys(mathScope), `return (${jsCode});`);
      const val = func(...Object.values(mathScope));

      const timeTaken = performance.now() - startTime;
      const formatted = typeof val === 'number' ? (Number.isInteger(val) ? val.toString() : val.toFixed(8).replace(/\.?0+$/, '')) : String(val);

      return {
        success: true,
        output: formatted,
        result: formatted,
        executionTimeMs: Math.round(timeTaken * 10) / 10,
      };
    } catch (err: any) {
      const timeTaken = performance.now() - startTime;
      return {
        success: false,
        output: '',
        error: err.message || 'Erro ao avaliar expressão',
        executionTimeMs: Math.round(timeTaken * 10) / 10,
      };
    }
  }
}

export const pythonRunner = new PythonRunnerService();
