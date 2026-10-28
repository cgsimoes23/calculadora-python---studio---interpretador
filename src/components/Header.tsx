import React from 'react';
import { Terminal, Calculator, FileCode2, BookOpen, Volume2, VolumeX, Sparkles, Cpu } from 'lucide-react';
import { PyodideStatus } from '../services/pythonRunner';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  activeTab: 'calc' | 'repl' | 'scripts' | 'cheatsheet';
  setActiveTab: (tab: 'calc' | 'repl' | 'scripts' | 'cheatsheet') => void;
  pythonStatus: PyodideStatus;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pythonStatus,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playClick(800);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-amber-400 p-[2px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-mono text-xl font-black bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent">
                  Py
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-900 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Calculadora em Python
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  v3.12
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Motor CPython WebAssembly</span>
                <span className="text-slate-600">•</span>
                {pythonStatus === 'loading' && (
                  <span className="flex items-center gap-1 text-amber-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Carregando Pyodide...
                  </span>
                )}
                {pythonStatus === 'ready' && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Python WASM Conectado
                  </span>
                )}
                {(pythonStatus === 'error' || pythonStatus === 'idle') && (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Cpu className="w-3 h-3" />
                    Avaliador Python Local Ativo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs & Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('calc');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'calc'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculadora Visual</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('repl');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'repl'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Terminal / REPL</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('scripts');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'scripts'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Scripts .py Prontos</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('cheatsheet');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'cheatsheet'
                    ? 'bg-slate-800 text-amber-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guia de Sintaxe</span>
                <span className="sm:hidden">Guia</span>
              </button>
            </nav>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar cliques de som' : 'Ativar som dos botões'}
              aria-label="Alternar som dos botões"
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
