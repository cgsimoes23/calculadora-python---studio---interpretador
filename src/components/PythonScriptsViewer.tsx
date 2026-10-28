import React, { useState } from 'react';
import {
  FileCode2,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { PYTHON_SCRIPTS, PythonScript } from '../utils/pythonScripts';
import { soundEffects } from '../utils/audio';

interface PythonScriptsViewerProps {
  onLoadIntoRepl: (code: string) => void;
}

export const PythonScriptsViewer: React.FC<PythonScriptsViewerProps> = ({ onLoadIntoRepl }) => {
  const [selectedScript, setSelectedScript] = useState<PythonScript>(PYTHON_SCRIPTS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (script: PythonScript) => {
    soundEffects.playClick(600);
    const blob = new Blob([script.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Intro Header */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Python Nativo
              </span>
              <span className="text-xs text-slate-500">Pronto para rodar no seu computador</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Scripts de Calculadora em Python para Download
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Escolha abaixo entre diferentes arquiteturas de calculadoras criadas em Python 3: desde um script interativo de terminal com tratamento de erros até uma interface gráfica com Tkinter e modelo orientado a objetos (POO).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload(selectedScript)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Baixar {selectedScript.filename}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Script Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {PYTHON_SCRIPTS.map(script => {
          const isSelected = selectedScript.id === script.id;
          return (
            <button
              key={script.id}
              onClick={() => {
                soundEffects.playClick(700);
                setSelectedScript(script);
              }}
              className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-400/50 shadow-lg shadow-amber-400/5 ring-1 ring-amber-400/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {script.filename}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{script.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {script.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {script.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Code Display Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Code Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <FileCode2 className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <span>{selectedScript.filename}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  ({selectedScript.code.split('\n').length} linhas)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{selectedScript.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(selectedScript.code, selectedScript.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedId === selectedScript.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload(selectedScript)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .py</span>
            </button>

            {selectedScript.category !== 'gui' && (
              <button
                onClick={() => onLoadIntoRepl(selectedScript.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Testar no Console</span>
              </button>
            )}
          </div>
        </div>

        {/* Code View */}
        <div className="bg-slate-950 p-5 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed text-slate-300">
          <pre>{selectedScript.code}</pre>
        </div>

        {/* Local Execution Instructions Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Para rodar no seu computador: abra o terminal e digite:{' '}
              <code className="bg-slate-950 px-2 py-1 rounded text-amber-300 font-mono border border-slate-800">
                python3 {selectedScript.filename}
              </code>
            </span>
          </div>

          <span className="text-slate-500 text-[11px]">Compatível com Python 3.8+</span>
        </div>
      </div>
    </div>
  );
};
