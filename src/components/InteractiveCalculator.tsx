import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Terminal,
  RotateCcw,
  Sparkles,
  History,
  Trash2,
  ArrowRight,
  Code2,
  DollarSign,
  Binary,
  Calculator as CalcIcon,
  Play
} from 'lucide-react';
import { pythonRunner } from '../services/pythonRunner';
import { soundEffects } from '../utils/audio';

interface CalculationRecord {
  id: string;
  expression: string;
  pythonCode: string;
  result: string;
  timestamp: string;
}

interface InteractiveCalculatorProps {
  onSendToRepl: (code: string) => void;
}

export const InteractiveCalculator: React.FC<InteractiveCalculatorProps> = ({ onSendToRepl }) => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('py_calc_history');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          expression: '2 ** 8 + 15 // 4',
          pythonCode: 'resultado = (2 ** 8) + (15 // 4)\nprint(resultado)',
          result: '259',
          timestamp: 'Agora'
        }
      ];
    } catch {
      return [];
    }
  });

  const [calcMode, setCalcMode] = useState<'basico' | 'cientifico' | 'financeiro' | 'programador'>('basico');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [lastAns, setLastAns] = useState<string>('0');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Financial mode states
  const [finCapital, setFinCapital] = useState<number>(1000);
  const [finTaxa, setFinTaxa] = useState<number>(12); // % ao ano
  const [finMeses, setFinMeses] = useState<number>(24);
  const [finAporte, setFinAporte] = useState<number>(100);

  // Focus keeper for keyboard
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('py_calc_history', JSON.stringify(history.slice(0, 30)));
    } catch {
      // ignore
    }
  }, [history]);

  // Translate calculator expression into Python code
  const generatePythonSnippet = (expr: string, resVal: string) => {
    if (!expr) return '# Digite uma expressão na calculadora para gerar código Python';

    let needsMath = expr.includes('math.') || expr.includes('sqrt') || expr.includes('sin') || expr.includes('cos') || expr.includes('pi') || expr.includes('log');
    
    let lines: string[] = [];
    if (needsMath) {
      lines.push('import math');
    }
    
    lines.push(`expressao = """${expr}"""`);
    lines.push(`# Avalia a expressão no interpretador Python`);
    lines.push(`resultado = ${expr}`);
    lines.push(`print(f"Resultado: {resultado}")  # => ${resVal || '...'}`);
    
    return lines.join('\n');
  };

  const handleAppend = (token: string) => {
    soundEffects.playClick(700);
    setErrorMsg(null);

    if (isCalculated) {
      // If user presses an operator after result, keep result as start
      if (['+', '-', '*', '/', '//', '%', '**'].includes(token)) {
        setExpression(result + ' ' + token + ' ');
        setIsCalculated(false);
        return;
      } else {
        setExpression(token);
        setIsCalculated(false);
        return;
      }
    }

    // Add spacing around binary operators for pythonic readability
    if (['+', '-', '*', '/', '//', '%', '**'].includes(token)) {
      setExpression(prev => prev.trim() + ' ' + token + ' ');
    } else {
      setExpression(prev => prev + token);
    }
  };

  const handleClear = () => {
    soundEffects.playClick(400);
    setExpression('');
    setResult('0');
    setErrorMsg(null);
    setIsCalculated(false);
  };

  const handleBackspace = () => {
    soundEffects.playClick(500);
    setErrorMsg(null);
    if (isCalculated) {
      setExpression('');
      setResult('0');
      setIsCalculated(false);
      return;
    }
    setExpression(prev => {
      const trimmed = prev.trimEnd();
      if (trimmed.length <= 1) return '';
      // If ending in space operator space, remove it cleanly
      if (trimmed.endsWith(' ')) {
        return trimmed.slice(0, -1);
      }
      return trimmed.slice(0, -1);
    });
  };

  const executeCalculation = async () => {
    if (!expression.trim()) return;
    soundEffects.playClick(900);
    setIsExecuting(true);
    setErrorMsg(null);

    try {
      const execResult = await pythonRunner.execute(expression);
      if (execResult.success && execResult.result !== undefined) {
        setResult(execResult.result);
        setLastAns(execResult.result);
        setIsCalculated(true);
        soundEffects.playSuccess();

        // Add to history
        const newRecord: CalculationRecord = {
          id: Date.now().toString(),
          expression: expression.trim(),
          pythonCode: generatePythonSnippet(expression.trim(), execResult.result),
          result: execResult.result,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setHistory(prev => [newRecord, ...prev]);
      } else {
        setErrorMsg(execResult.error || 'Erro na avaliação');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro inesperado');
    } finally {
      setIsExecuting(false);
    }
  };

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focused in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleAppend(e.key);
      } else if (['+', '-', '*', '/', '(', ')', '.', '%'].includes(e.key)) {
        e.preventDefault();
        handleAppend(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        executeCalculation();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, isCalculated, result]);

  const copyPythonCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Quick helper to run financial calculation with Python
  const calculateFinancial = async () => {
    soundEffects.playClick(850);
    const code = `
# Cálculo de Investimento com Aporte Mensal
capital = ${finCapital}
taxa_mensal = ((1 + (${finTaxa} / 100)) ** (1 / 12)) - 1
meses = ${finMeses}
aporte = ${finAporte}

saldo = capital
total_investido = capital

for _ in range(meses):
    saldo = (saldo * (1 + taxa_mensal)) + aporte
    total_investido += aporte

lucro = saldo - total_investido
f"Saldo Final: R$ {saldo:,.2f} | Total Aportado: R$ {total_investido:,.2f} | Rendimento: R$ {lucro:,.2f}"
`;
    setExpression(`JurosCompostos(C=${finCapital}, i=${finTaxa}%, m=${finMeses}, aporte=${finAporte})`);
    setIsExecuting(true);
    const res = await pythonRunner.execute(code);
    setIsExecuting(false);
    if (res.success && res.result) {
      setResult(res.result);
      setIsCalculated(true);
      const newRec: CalculationRecord = {
        id: Date.now().toString(),
        expression: `Investimento: R$ ${finCapital} a ${finTaxa}% a.a. por ${finMeses}m`,
        pythonCode: code.trim(),
        result: res.result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newRec, ...prev]);
    }
  };

  // Programmer mode base conversions
  const numericVal = parseFloat(result);
  const isValidNumber = !isNaN(numericVal) && Number.isFinite(numericVal);
  const intVal = isValidNumber ? Math.trunc(numericVal) : 0;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Column: Calculator (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Calculator Chassis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 relative overflow-hidden">
            {/* Top decorative gradient bar with Python colors */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-400" />

            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setCalcMode('basico');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    calcMode === 'basico' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CalcIcon className="w-3.5 h-3.5" />
                  <span>Básico</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setCalcMode('cientifico');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    calcMode === 'cientifico' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Científico</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setCalcMode('financeiro');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    calcMode === 'financeiro' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Financeiro</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setCalcMode('programador');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    calcMode === 'programador' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Binary className="w-3.5 h-3.5" />
                  <span>Programador</span>
                </button>
              </div>

              {/* Status pill */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Python Syntax</span>
              </div>
            </div>

            {/* Calculator Display Screen */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-inner mb-4 flex flex-col justify-between min-h-[120px] transition-all">
              {/* Top Sub-Display: Expression or Python formula */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="text-amber-400/80">&gt;&gt;&gt;</span>
                  <span className="truncate max-w-xs">{expression || '0'}</span>
                </div>
                {lastAns !== '0' && (
                  <span className="text-slate-500 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    ans = {lastAns}
                  </span>
                )}
              </div>

              {/* Error Message if any */}
              {errorMsg ? (
                <div className="text-sm font-mono text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg p-2 animate-shake">
                  ❌ {errorMsg}
                </div>
              ) : (
                /* Main Result / Number Display */
                <div className="text-right overflow-x-auto scrollbar-none">
                  <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 select-all">
                    {result}
                  </span>
                </div>
              )}

              {/* Subtle execution badge */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-500 font-mono">
                <span>Operadores nativos: **, //, %, math.*</span>
                {isExecuting && (
                  <span className="text-amber-400 animate-pulse">Executando em Python...</span>
                )}
              </div>
            </div>

            {/* Quick Variable / ANS Bar */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleAppend('ans')}
                className="px-2.5 py-1 text-xs font-mono bg-slate-800/80 hover:bg-slate-800 text-amber-300 rounded-lg border border-slate-700/60 transition-colors"
                title="Inserir último resultado (ans)"
              >
                ans
              </button>
              <button
                onClick={() => handleAppend('math.pi')}
                className="px-2.5 py-1 text-xs font-mono bg-slate-800/80 hover:bg-slate-800 text-blue-300 rounded-lg border border-slate-700/60 transition-colors"
                title="Constante Pi (3.14159...)"
              >
                π (math.pi)
              </button>
              <button
                onClick={() => handleAppend('math.e')}
                className="px-2.5 py-1 text-xs font-mono bg-slate-800/80 hover:bg-slate-800 text-blue-300 rounded-lg border border-slate-700/60 transition-colors"
                title="Número de Euler (2.71828...)"
              >
                e (math.e)
              </button>
              <button
                onClick={() => handleAppend(' // ')}
                className="px-2.5 py-1 text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 transition-colors"
                title="Divisão inteira em Python (//)"
              >
                // (Div Inteira)
              </button>
              <button
                onClick={() => handleAppend(' ** ')}
                className="px-2.5 py-1 text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 transition-colors"
                title="Potência em Python (**)"
              >
                x**y (Potência)
              </button>
            </div>

            {/* Mode-specific Pads */}
            {calcMode === 'financeiro' ? (
              /* Financial Mode Panel */
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Simulador Financeiro em Python (Juros Compostos)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Capital Inicial (R$):</label>
                    <input
                      type="number"
                      value={finCapital}
                      onChange={e => setFinCapital(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Taxa de Juros Anual (% a.a.):</label>
                    <input
                      type="number"
                      value={finTaxa}
                      onChange={e => setFinTaxa(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Prazo em Meses:</label>
                    <input
                      type="number"
                      value={finMeses}
                      onChange={e => setFinMeses(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Aporte Mensal (R$):</label>
                    <input
                      type="number"
                      value={finAporte}
                      onChange={e => setFinAporte(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateFinancial}
                  disabled={isExecuting}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-medium shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Calcular com Script Python
                </button>
              </div>
            ) : calcMode === 'programador' ? (
              /* Programmer Mode Panel */
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                  <Binary className="w-4 h-4" />
                  Conversões de Base & Operações Bit a Bit (Python)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">HEXADECIMAL [hex(n)]</span>
                    <span className="text-purple-300 font-bold">{intVal.toString(16).toUpperCase()}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">DECIMAL [int(n)]</span>
                    <span className="text-slate-200 font-bold">{intVal}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">OCTAL [oct(n)]</span>
                    <span className="text-amber-300 font-bold">{intVal.toString(8)}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">BINÁRIO [bin(n)]</span>
                    <span className="text-emerald-300 font-bold break-all">{intVal.toString(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-2">
                  <button
                    onClick={() => handleAppend(' & ')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono rounded-lg border border-slate-700"
                    title="Bitwise AND"
                  >
                    & (AND)
                  </button>
                  <button
                    onClick={() => handleAppend(' | ')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono rounded-lg border border-slate-700"
                    title="Bitwise OR"
                  >
                    | (OR)
                  </button>
                  <button
                    onClick={() => handleAppend(' ^ ')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono rounded-lg border border-slate-700"
                    title="Bitwise XOR"
                  >
                    ^ (XOR)
                  </button>
                  <button
                    onClick={() => handleAppend(' << ')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono rounded-lg border border-slate-700"
                    title="Deslocamento à esquerda"
                  >
                    &lt;&lt; (SHL)
                  </button>
                  <button
                    onClick={() => handleAppend(' >> ')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono rounded-lg border border-slate-700"
                    title="Deslocamento à direita"
                  >
                    &gt;&gt; (SHR)
                  </button>
                </div>
              </div>
            ) : (
              /* Scientific Function Bar (when in scientific mode) */
              calcMode === 'cientifico' && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3 bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
                  <button
                    onClick={() => handleAppend('math.sqrt(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700/60"
                  >
                    √x
                  </button>
                  <button
                    onClick={() => handleAppend('math.sin(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg border border-slate-700/60"
                  >
                    sin
                  </button>
                  <button
                    onClick={() => handleAppend('math.cos(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg border border-slate-700/60"
                  >
                    cos
                  </button>
                  <button
                    onClick={() => handleAppend('math.tan(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg border border-slate-700/60"
                  >
                    tan
                  </button>
                  <button
                    onClick={() => handleAppend('math.log10(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700/60"
                  >
                    log10
                  </button>
                  <button
                    onClick={() => handleAppend('math.log(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700/60"
                  >
                    ln (log)
                  </button>
                  <button
                    onClick={() => handleAppend('math.factorial(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700/60"
                  >
                    n!
                  </button>
                  <button
                    onClick={() => handleAppend('abs(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60"
                  >
                    |x|
                  </button>
                  <button
                    onClick={() => handleAppend('math.radians(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg border border-slate-700/60"
                  >
                    rad
                  </button>
                  <button
                    onClick={() => handleAppend('math.degrees(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg border border-slate-700/60"
                  >
                    deg
                  </button>
                  <button
                    onClick={() => handleAppend('math.exp(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg border border-slate-700/60"
                  >
                    exp(x)
                  </button>
                  <button
                    onClick={() => handleAppend('round(')}
                    className="p-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60"
                  >
                    round
                  </button>
                </div>
              )
            )}

            {/* Standard Keypad Grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {/* Row 1: Clear & Parentheses */}
              <button
                onClick={handleClear}
                className="py-3 px-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-sm border border-rose-500/40 transition-all active:scale-95"
              >
                AC
              </button>
              <button
                onClick={() => handleAppend('(')}
                className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-blue-300 font-mono text-base border border-slate-700/60 transition-all active:scale-95"
              >
                (
              </button>
              <button
                onClick={() => handleAppend(')')}
                className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-blue-300 font-mono text-base border border-slate-700/60 transition-all active:scale-95"
              >
                )
              </button>
              <button
                onClick={handleBackspace}
                className="py-3 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-sm border border-amber-500/40 transition-all active:scale-95 flex items-center justify-center"
                title="Apagar último caractere"
              >
                ⌫
              </button>

              {/* Row 2: 7, 8, 9, Division */}
              <button
                onClick={() => handleAppend('7')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                7
              </button>
              <button
                onClick={() => handleAppend('8')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                8
              </button>
              <button
                onClick={() => handleAppend('9')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                9
              </button>
              <button
                onClick={() => handleAppend('/')}
                className="py-3 px-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 font-mono text-lg font-bold border border-blue-500/40 transition-all active:scale-95"
                title="Divisão float (/)"
              >
                /
              </button>

              {/* Row 3: 4, 5, 6, Multiplication */}
              <button
                onClick={() => handleAppend('4')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                4
              </button>
              <button
                onClick={() => handleAppend('5')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                5
              </button>
              <button
                onClick={() => handleAppend('6')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                6
              </button>
              <button
                onClick={() => handleAppend('*')}
                className="py-3 px-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 font-mono text-lg font-bold border border-blue-500/40 transition-all active:scale-95"
                title="Multiplicação (*)"
              >
                *
              </button>

              {/* Row 4: 1, 2, 3, Subtraction */}
              <button
                onClick={() => handleAppend('1')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                1
              </button>
              <button
                onClick={() => handleAppend('2')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                2
              </button>
              <button
                onClick={() => handleAppend('3')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                3
              </button>
              <button
                onClick={() => handleAppend('-')}
                className="py-3 px-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 font-mono text-lg font-bold border border-blue-500/40 transition-all active:scale-95"
                title="Subtração (-)"
              >
                -
              </button>

              {/* Row 5: 0, ., Equals (=), Addition */}
              <button
                onClick={() => handleAppend('0')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                0
              </button>
              <button
                onClick={() => handleAppend('.')}
                className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono text-lg font-medium border border-slate-700/50 transition-all active:scale-95"
              >
                .
              </button>
              <button
                onClick={executeCalculation}
                disabled={isExecuting}
                className="py-3 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono text-xl font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                title="Calcular (Enter)"
              >
                =
              </button>
              <button
                onClick={() => handleAppend('+')}
                className="py-3 px-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 font-mono text-lg font-bold border border-blue-500/40 transition-all active:scale-95"
                title="Adição (+)"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick Keyboard Hint */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-mono">
            <span>Dica: Use o teclado numérico físico (Enter para =, C para limpar)</span>
            <span className="text-amber-400/70">Python 3.12 syntax</span>
          </div>
        </div>

        {/* Right Column: Real-time Python Code & History (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Live Generated Python Code Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Código Python Gerado</h3>
                  <p className="text-[11px] text-slate-400">Tradução instantânea do que você digitou</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyPythonCode(generatePythonSnippet(expression || result, result))}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                  title="Copiar código Python"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  onClick={() => onSendToRepl(generatePythonSnippet(expression || result, result))}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition-colors"
                  title="Abrir no Terminal REPL"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>No REPL</span>
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800/90 font-mono text-xs overflow-x-auto text-slate-200">
              <div className="text-slate-500 select-none pb-1 border-b border-slate-900 mb-2 flex items-center justify-between">
                <span>calculo.py</span>
                <span className="text-[10px] text-amber-400">CPython</span>
              </div>
              <pre className="text-slate-300 whitespace-pre leading-relaxed">
                {generatePythonSnippet(expression || result, result)}
              </pre>
            </div>
          </div>

          {/* History Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Histórico de Cálculos</h3>
                  <p className="text-[11px] text-slate-400">{history.length} operações salvas</p>
                </div>
              </div>

              {history.length > 0 && (
                <button
                  onClick={() => {
                    soundEffects.playClick(400);
                    setHistory([]);
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {/* History List */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Nenhum cálculo registrado ainda.
                </div>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    className="group bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800/70 hover:border-slate-700 rounded-xl p-3 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono text-slate-400 truncate">
                        {item.expression}
                      </div>
                      <div className="text-sm font-mono font-bold text-amber-300 truncate">
                        = {item.result}
                      </div>
                      <span className="text-[10px] text-slate-600">{item.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          soundEffects.playClick(650);
                          setExpression(item.result);
                          setResult(item.result);
                          setIsCalculated(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Usar valor"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyPythonCode(item.pythonCode)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copiar código Python desse cálculo"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
