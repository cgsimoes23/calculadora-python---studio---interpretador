import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Terminal as TermIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { pythonRunner, PythonExecutionResult } from '../services/pythonRunner';
import { RUNNABLE_SNIPPETS, SnippetExample } from '../utils/pythonScripts';
import { soundEffects } from '../utils/audio';

interface PythonReplConsoleProps {
  initialCode?: string;
}

export const PythonReplConsole: React.FC<PythonReplConsoleProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(
    initialCode ||
      `# Calculadora Científica e Financeira em Python 3
import math
import statistics

# 1. Potenciação e Raízes
base = 2
expoente = 10
potencia = base ** expoente
raiz = math.sqrt(potencia)

print(f"{base} elevado a {expoente} = {potencia}")
print(f"Raiz quadrada de {potencia} = {raiz}")

# 2. Estatística Básica
amostra = [12.5, 18.2, 24.0, 31.8, 42.1]
media = statistics.mean(amostra)
print(f"\\nAmostra: {amostra}")
print(f"Média calculada: {media:.2f}")

# 3. Trigonometria
angulo_graus = 45
rad = math.radians(angulo_graus)
seno = math.sin(rad)
print(f"\\nSeno de {angulo_graus}° = {seno:.4f}")
`
  );

  const [output, setOutput] = useState<string>('Clique em "Executar Código" para rodar o script no motor Python WebAssembly.');
  const [lastResult, setLastResult] = useState<PythonExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);

  const handleRun = async () => {
    if (!code.trim()) return;
    soundEffects.playClick(900);
    setIsRunning(true);

    try {
      const res = await pythonRunner.execute(code);
      setLastResult(res);
      if (res.success) {
        setOutput(res.output || '(Executado com sucesso sem saída print)');
        soundEffects.playSuccess();
      } else {
        setOutput(`❌ ${res.error || 'Erro durante a execução'}`);
      }
    } catch (err: any) {
      setOutput(`❌ Erro inesperado: ${err?.message || err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSelectSnippet = (snippet: SnippetExample) => {
    soundEffects.playClick(750);
    setCode(snippet.code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleDownload = () => {
    soundEffects.playClick(600);
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meu_calculo_python.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
    // Tab support inside code editor
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      target.value = val.substring(0, start) + '    ' + val.substring(end);
      target.selectionStart = target.selectionEnd = start + 4;
      setCode(target.value);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Quick Presets */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TermIcon className="w-5 h-5 text-amber-400" />
            Console & Interpretador Python 3.12 (REPL)
          </h2>
          <p className="text-xs text-slate-400">
            Escreva ou execute scripts de cálculo livremente. Suporta <code className="text-amber-300 font-mono">math</code>, <code className="text-amber-300 font-mono">statistics</code>, loops e funções.
          </p>
        </div>

        {/* Snippets pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">Exemplos:</span>
          {RUNNABLE_SNIPPETS.map(snip => (
            <button
              key={snip.title}
              onClick={() => handleSelectSnippet(snip)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/60 whitespace-nowrap transition-colors"
            >
              {snip.category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Editor on Left, Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Editor Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[500px]">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">script_calculadora.py</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                title="Copiar código"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                title="Baixar como .py"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Textarea */}
          <div className="flex-1 relative bg-slate-950 p-4 font-mono text-xs sm:text-sm">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full h-full min-h-[380px] bg-transparent text-slate-200 resize-none outline-none font-mono leading-relaxed"
              placeholder="# Digite seu código Python aqui..."
            />
          </div>

          {/* Editor Footer / Run Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Dica: Pressione <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Ctrl + Enter</kbd> para rodar
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => {
                  soundEffects.playClick(400);
                  setCode('');
                  setOutput('');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isRunning ? 'Executando...' : 'Executar Código'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Output Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[500px]">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TermIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-300">Terminal (stdout / stderr)</span>
            </div>

            <div className="flex items-center gap-2">
              {lastResult && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{lastResult.executionTimeMs} ms</span>
                </div>
              )}
              <button
                onClick={handleCopyOutput}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
                title="Copiar saída do terminal"
              >
                {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick(400);
                  setOutput('');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
                title="Limpar terminal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Screen */}
          <div className="flex-1 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-300 overflow-y-auto min-h-[380px]">
            <div className="text-slate-600 mb-2 select-none text-[11px]">
              Python 3.12 (CPython WebAssembly - Interactive Environment)
            </div>

            <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300 font-mono">
              {output}
            </pre>
          </div>

          {/* Terminal Status Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              {lastResult ? (
                lastResult.success ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Processo finalizado com código 0
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Processo finalizado com erro de execução
                  </span>
                )
              ) : (
                <span>Pronto para executar</span>
              )}
            </div>

            <span>UTF-8</span>
          </div>
        </div>

      </div>
    </div>
  );
};
