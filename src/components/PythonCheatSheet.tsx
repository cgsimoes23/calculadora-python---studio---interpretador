import React from 'react';
import { BookOpen, CheckCircle, AlertTriangle, Lightbulb, Code2 } from 'lucide-react';

export const PythonCheatSheet: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Guia de Operações Matemáticas em Python
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Entenda a diferença dos operadores matemáticos do Python, a biblioteca padrão <code className="text-amber-300 font-mono">math</code> e como evitar os erros mais comuns ao programar sua calculadora.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Operadores Aritméticos Básicos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold text-xs">
                + - * /
              </span>
              <h3 className="text-sm font-bold text-white">Operadores Aritméticos</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-mono text-slate-300 font-bold mb-1">
                  <span>Adição & Subtração</span>
                  <span className="text-amber-300">10 + 5 | 10 - 5</span>
                </div>
                <p className="text-slate-400 text-[11px]">Soma e subtrai inteiros ou floats.</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-mono text-slate-300 font-bold mb-1">
                  <span>Multiplicação</span>
                  <span className="text-amber-300">6 * 7 # 42</span>
                </div>
                <p className="text-slate-400 text-[11px]">Usa o asterisco (*).</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-mono text-slate-300 font-bold mb-1">
                  <span>Divisão Real (Float)</span>
                  <span className="text-amber-300">7 / 2 # 3.5</span>
                </div>
                <p className="text-slate-400 text-[11px]">Em Python 3, a barra única (/) sempre retorna float.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Operadores Especiais do Python */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-xs">
                ** // %
              </span>
              <h3 className="text-sm font-bold text-white">Operadores Exclusivos</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-mono text-slate-300 font-bold mb-1">
                  <span>Potenciação (**)</span>
                  <span className="text-amber-300">2 ** 8 # 256</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  <strong>Atenção:</strong> Em Python não se usa ^ para potência (o ^ é XOR bit a bit). Usa-se sempre <code className="text-amber-300">**</code>.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-mono text-slate-300 font-bold mb-1">
                  <span>Divisão Inteira (//)</span>
                  <span className="text-amber-300">15 // 4 # 3</span>
                </div>
                <p className="text-slate-400 text-[11px]">Descarta as casas decimais e retorna a parte inteira (floor).</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-mono text-slate-300 font-bold mb-1">
                  <span>Resto da Divisão (%)</span>
                  <span className="text-amber-300">15 % 4 # 3</span>
                </div>
                <p className="text-slate-400 text-[11px]">Excelente para checar se número é par (<code className="text-amber-300">n % 2 == 0</code>).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Módulo math */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
                import math
              </span>
              <h3 className="text-sm font-bold text-white">Funções do Módulo math</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono">
                <span className="text-blue-300 block font-bold">math.sqrt(x)</span>
                <span className="text-slate-400 text-[11px]">Raiz quadrada de x (ex: math.sqrt(64) = 8.0)</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono">
                <span className="text-blue-300 block font-bold">math.sin(rad), math.cos(rad)</span>
                <span className="text-slate-400 text-[11px]">Trigonometria (recebe o ângulo em radianos)</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono">
                <span className="text-blue-300 block font-bold">math.log10(x), math.log(x)</span>
                <span className="text-slate-400 text-[11px]">Logaritmo na base 10 e logaritmo natural (ln)</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono">
                <span className="text-blue-300 block font-bold">math.pi, math.e</span>
                <span className="text-slate-400 text-[11px]">Constantes matemáticas Pi (3.1415...) e Euler (2.7182...)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Tratamento de Erros e Boas Práticas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold text-xs">
                try/except
              </span>
              <h3 className="text-sm font-bold text-white">Tratamento de Exceções</h3>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Ao criar uma calculadora em Python, você sempre deve tratar possíveis erros para o programa não fechar inesperadamente:
            </p>

            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`try:
    a = float(input("Num 1: "))
    b = float(input("Num 2: "))
    resultado = a / b
except ZeroDivisionError:
    print("Erro: Divisão por zero!")
except ValueError:
    print("Erro: Digite apenas números!")`}
            </pre>
          </div>
        </div>

        {/* Card 5: Precedência de Operadores (PEMDAS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono font-bold text-xs">
                ( ) ** * / + -
              </span>
              <h3 className="text-sm font-bold text-white">Ordem de Precedência</h3>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              O Python segue estritamente a ordem matemática universal de operações:
            </p>

            <ol className="space-y-2 text-xs font-mono text-slate-300">
              <li className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">1</span>
                <span><strong>Parênteses:</strong> ( ... )</span>
              </li>
              <li className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">2</span>
                <span><strong>Potenciação:</strong> **</span>
              </li>
              <li className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">3</span>
                <span><strong>Multiplicação / Divisão:</strong> *, /, //, %</span>
              </li>
              <li className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">4</span>
                <span><strong>Adição / Subtração:</strong> +, -</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Card 6: F-Strings & Formatação */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono font-bold text-xs">
                f"..."
              </span>
              <h3 className="text-sm font-bold text-white">Formatação de Resultados</h3>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Use as f-strings do Python para exibir números arredondados e moedas de forma profissional:
            </p>

            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-amber-300">{'f"{valor:.2f}"'}</span>
                <span className="text-slate-500 block">Exibe com exatamente 2 casas decimais (ex: 3.14)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-amber-300">{'f"R$ {valor:,.2f}"'}</span>
                <span className="text-slate-500 block">Formato financeiro com vírgulas de milhar</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-amber-300">{'f"{taxa * 100:.1f}%"'}</span>
                <span className="text-slate-500 block">Formato percentual (ex: 15.5%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
