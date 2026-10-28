import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InteractiveCalculator } from './components/InteractiveCalculator';
import { PythonReplConsole } from './components/PythonReplConsole';
import { PythonScriptsViewer } from './components/PythonScriptsViewer';
import { PythonCheatSheet } from './components/PythonCheatSheet';
import { pythonRunner, PyodideStatus } from './services/pythonRunner';
import { soundEffects } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'repl' | 'scripts' | 'cheatsheet'>('calc');
  const [pythonStatus, setPythonStatus] = useState<PyodideStatus>(pythonRunner.getStatus());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [replCode, setReplCode] = useState<string>('');

  useEffect(() => {
    // Subscribe to Pyodide status
    const unsubscribe = pythonRunner.onStatusChange(status => {
      setPythonStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const handleSendToRepl = (code: string) => {
    setReplCode(code);
    setActiveTab('repl');
    soundEffects.playClick(850);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-300">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pythonStatus={pythonStatus}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'calc' && (
          <InteractiveCalculator onSendToRepl={handleSendToRepl} />
        )}

        {activeTab === 'repl' && (
          <PythonReplConsole initialCode={replCode || undefined} />
        )}

        {activeTab === 'scripts' && (
          <PythonScriptsViewer onLoadIntoRepl={handleSendToRepl} />
        )}

        {activeTab === 'cheatsheet' && (
          <PythonCheatSheet />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold">Python 3.12</span>
            <span>•</span>
            <span>Calculadora Interativa com suporte a CLI, GUI Tkinter e POO</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">WebAssembly Pyodide & Engine Local</span>
            <span>•</span>
            <span>Pronto para rodar localmente com <code className="text-amber-300 font-mono">python3</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
