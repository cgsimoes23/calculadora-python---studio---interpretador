/**
 * Templates, downloadable Python scripts, and pre-built code examples for the user.
 */

export interface PythonScript {
  id: string;
  title: string;
  filename: string;
  description: string;
  category: 'terminal' | 'gui' | 'poo' | 'cientifica';
  code: string;
  tags: string[];
}

export const PYTHON_SCRIPTS: PythonScript[] = [
  {
    id: 'terminal',
    title: 'Calculadora de Terminal Interativa (CLI)',
    filename: 'calculadora_terminal.py',
    description: 'Calculadora completa para linha de comando com menu interativo, tratamento de exceções (ZeroDivisionError, ValueError) e cores ANSI.',
    category: 'terminal',
    tags: ['Iniciante', 'CLI', 'Tratamento de Erros', 'math'],
    code: `"""
Calculadora Interativa em Linha de Comando (Python 3)
Execute no seu computador com: python3 calculadora_terminal.py
"""

import math
import sys

# Cores ANSI para deixar o terminal estilizado
COR_AZUL = "\\033[94m"
COR_VERDE = "\\033[92m"
COR_AMARELO = "\\033[93m"
COR_VERMELHO = "\\033[91m"
COR_RESET = "\\033[0m"
COR_NEGRITO = "\\033[1m"


def cabecalho():
    print(f"{COR_AZUL}=" * 45)
    print(f"{COR_AMARELO}{COR_NEGRITO}   🐍 CALCULADORA EM PYTHON 3 🐍{COR_RESET}")
    print(f"{COR_AZUL}=" * 45 + f"{COR_RESET}")


def exibir_menu():
    print(f"\\n{COR_NEGRITO}Escolha uma operação:{COR_RESET}")
    print(f" [1] {COR_VERDE}Adição (+){COR_RESET}")
    print(f" [2] {COR_VERDE}Subtração (-){COR_RESET}")
    print(f" [3] {COR_VERDE}Multiplicação (*){COR_RESET}")
    print(f" [4] {COR_VERDE}Divisão Real (/){COR_RESET}")
    print(f" [5] {COR_VERDE}Divisão Inteira (//){COR_RESET}")
    print(f" [6] {COR_VERDE}Resto / Módulo (%){COR_RESET}")
    print(f" [7] {COR_VERDE}Potenciação (**){COR_RESET}")
    print(f" [8] {COR_VERDE}Raiz Quadrada (√){COR_RESET}")
    print(f" [9] {COR_VERDE}Porcentagem (% de x){COR_RESET}")
    print(f" [0] {COR_VERMELHO}Sair{COR_RESET}")


def ler_numero(mensagem: str) -> float:
    """Lê um número do usuário garantindo validação de erro."""
    while True:
        try:
            return float(input(mensagem))
        except ValueError:
            print(f"{COR_VERMELHO}Erro: Digite um número válido (ex: 10 ou 3.14)!{COR_RESET}")


def main():
    cabecalho()
    historico = []

    while True:
        exibir_menu()
        opcao = input(f"\\n{COR_AMARELO}Digite a opção desejada: {COR_RESET}").strip()

        if opcao == "0":
            print(f"\\n{COR_VERDE}Obrigado por usar a Calculadora Python! Até logo! 👋{COR_RESET}")
            sys.exit(0)

        if opcao not in [str(i) for i in range(1, 10)]:
            print(f"{COR_VERMELHO}Opção inválida! Escolha entre 0 e 9.{COR_RESET}")
            continue

        try:
            if opcao == "8":
                # Raiz quadrada (apenas 1 número)
                num = ler_numero("Digite o número para a raiz: ")
                if num < 0:
                    print(f"{COR_VERMELHO}Erro: Não existe raiz real de número negativo!{COR_RESET}")
                    continue
                resultado = math.sqrt(num)
                expr = f"√({num}) = {resultado}"
            else:
                num1 = ler_numero("Digite o 1º número: ")
                num2 = ler_numero("Digite o 2º número: ")

                if opcao == "1":
                    resultado = num1 + num2
                    expr = f"{num1} + {num2} = {resultado}"
                elif opcao == "2":
                    resultado = num1 - num2
                    expr = f"{num1} - {num2} = {resultado}"
                elif opcao == "3":
                    resultado = num1 * num2
                    expr = f"{num1} * {num2} = {resultado}"
                elif opcao == "4":
                    if num2 == 0:
                        raise ZeroDivisionError("Divisão por zero não permitida!")
                    resultado = num1 / num2
                    expr = f"{num1} / {num2} = {resultado}"
                elif opcao == "5":
                    if num2 == 0:
                        raise ZeroDivisionError("Divisão por zero não permitida!")
                    resultado = num1 // num2
                    expr = f"{num1} // {num2} = {resultado}"
                elif opcao == "6":
                    if num2 == 0:
                        raise ZeroDivisionError("Módulo por zero não permitido!")
                    resultado = num1 % num2
                    expr = f"{num1} % {num2} = {resultado}"
                elif opcao == "7":
                    resultado = num1 ** num2
                    expr = f"{num1} ** {num2} = {resultado}"
                elif opcao == "9":
                    # Porcentagem: num1% de num2
                    resultado = (num1 / 100) * num2
                    expr = f"{num1}% de {num2} = {resultado}"

            print(f"\\n{COR_AZUL}--------------------------------{COR_RESET}")
            print(f"{COR_VERDE}{COR_NEGRITO}Resultado: {expr}{COR_RESET}")
            print(f"{COR_AZUL}--------------------------------{COR_RESET}")
            historico.append(expr)

        except ZeroDivisionError as err:
            print(f"{COR_VERMELHO}Erro Matemático: {err}{COR_RESET}")
        except OverflowError:
            print(f"{COR_VERMELHO}Erro: O resultado é grande demais para calcular!{COR_RESET}")
        except Exception as err:
            print(f"{COR_VERMELHO}Ocorreu um erro inesperado: {err}{COR_RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\nPrograma interrompido pelo usuário. Até logo!")
`
  },
  {
    id: 'gui',
    title: 'Calculadora Gráfica Desktop (Tkinter)',
    filename: 'calculadora_gui.py',
    description: 'Interface gráfica nativa com botões, visor responsivo e suporte ao teclado. Não requer instalação de pacotes externos.',
    category: 'gui',
    tags: ['Tkinter', 'Interface Gráfica', 'Desktop', 'Nativo'],
    code: `"""
Calculadora Gráfica Desktop com Tkinter (Python 3 Nativo)
Execute no seu computador com: python3 calculadora_gui.py
(Não requer nenhuma biblioteca externa como PyQt ou Kivy)
"""

import tkinter as tk
from tkinter import ttk, messagebox
import math


class CalculadoraTkinter:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Python")
        self.root.geometry("340x480")
        self.root.resizable(False, False)
        self.root.configure(bg="#1e1e2e")

        self.expressao = ""

        # Visor de cálculo
        self.criar_visor()

        # Grade de botões
        self.criar_botoes()

        # Atalhos do teclado físico
        self.root.bind("<Key>", self.tratar_teclado)

    def criar_visor(self):
        # Frame do visor
        frame_visor = tk.Frame(self.root, bg="#1e1e2e", padx=10, pady=15)
        frame_visor.pack(fill="both")

        self.label_expressao = tk.Label(
            frame_visor,
            text="",
            font=("Consolas", 12),
            bg="#1e1e2e",
            fg="#a6adc8",
            anchor="e"
        )
        self.label_expressao.pack(fill="x")

        self.display = tk.Entry(
            frame_visor,
            font=("Consolas", 24, "bold"),
            bg="#181825",
            fg="#cdd6f4",
            insertbackground="#f9e2af",
            justify="right",
            bd=0,
            relief="flat"
        )
        self.display.insert(0, "0")
        self.display.pack(fill="x", ipady=8, pady=(4, 0))

    def criar_botoes(self):
        frame_botoes = tk.Frame(self.root, bg="#1e1e2e", padx=10, pady=5)
        frame_botoes.pack(fill="both", expand=True)

        layout_botoes = [
            ("C", "#f38ba8", self.limpar),
            ("(", "#89b4fa", lambda: self.inserir("(")),
            (")", "#89b4fa", lambda: self.inserir(")")),
            ("⌫", "#fab387", self.apagar),

            ("7", "#313244", lambda: self.inserir("7")),
            ("8", "#313244", lambda: self.inserir("8")),
            ("9", "#313244", lambda: self.inserir("9")),
            ("÷", "#cba6f7", lambda: self.inserir("/")),

            ("4", "#313244", lambda: self.inserir("4")),
            ("5", "#313244", lambda: self.inserir("5")),
            ("6", "#313244", lambda: self.inserir("6")),
            ("×", "#cba6f7", lambda: self.inserir("*")),

            ("1", "#313244", lambda: self.inserir("1")),
            ("2", "#313244", lambda: self.inserir("2")),
            ("3", "#313244", lambda: self.inserir("3")),
            ("-", "#cba6f7", lambda: self.inserir("-")),

            ("0", "#313244", lambda: self.inserir("0")),
            (".", "#313244", lambda: self.inserir(".")),
            ("=", "#a6e3a1", self.calcular),
            ("+", "#cba6f7", lambda: self.inserir("+")),
        ]

        for i in range(5):
            frame_botoes.rowconfigure(i, weight=1)
        for j in range(4):
            frame_botoes.columnconfigure(j, weight=1)

        idx = 0
        for texto, cor, comando in layout_botoes:
            linha = idx // 4
            coluna = idx % 4
            cor_texto = "#11111b" if cor in ["#a6e3a1", "#f9e2af", "#f38ba8", "#fab387"] else "#cdd6f4"

            btn = tk.Button(
                frame_botoes,
                text=texto,
                font=("Segoe UI", 14, "bold"),
                bg=cor,
                fg=cor_texto,
                activebackground="#45475a",
                activeforeground="#ffffff",
                relief="flat",
                command=comando,
                cursor="hand2"
            )
            btn.grid(row=linha, column=coluna, padx=4, pady=4, sticky="nsew")
            idx += 1

    def inserir(self, caractere):
        atual = self.display.get()
        if atual == "0" and caractere not in [".", "+", "-", "*", "/"]:
            self.display.delete(0, tk.END)
        self.display.insert(tk.END, caractere)

    def limpar(self):
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")
        self.label_expressao.config(text="")

    def apagar(self):
        conteudo = self.display.get()
        if len(conteudo) > 1:
            self.display.delete(len(conteudo) - 1, tk.END)
        else:
            self.display.delete(0, tk.END)
            self.display.insert(0, "0")

    def calcular(self):
        expressao = self.display.get()
        self.label_expressao.config(text=expressao + " =")
        try:
            # Substituições amigáveis
            sanitizada = expressao.replace("×", "*").replace("÷", "/")
            resultado = eval(sanitizada, {"__builtins__": None}, {"math": math})

            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)

            self.display.delete(0, tk.END)
            self.display.insert(0, str(resultado))
        except ZeroDivisionError:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Erro: Div/0")
        except Exception:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Erro de Sintaxe")

    def tratar_teclado(self, event):
        tecla = event.char
        if tecla in "0123456789.+-*/()":
            self.inserir(tecla)
        elif event.keysym in ["Return", "KP_Enter"]:
            self.calcular()
        elif event.keysym == "BackSpace":
            self.apagar()
        elif event.keysym == "Escape":
            self.limpar()


if __name__ == "__main__":
    janela = tk.Tk()
    app = CalculadoraTkinter(janela)
    janela.mainloop()
`
  },
  {
    id: 'poo',
    title: 'Calculadora em Programação Orientada a Objetos (POO)',
    filename: 'calculadora_poo.py',
    description: 'Código profissional com classe, métodos fortemente tipados, histórico, persistência e suíte de testes unitários com unittest.',
    category: 'poo',
    tags: ['POO', 'Classes', 'Type Hints', 'Unittest', 'Profissional'],
    code: `"""
Calculadora Orientada a Objetos em Python (POO)
Exemplo com boas práticas: Type Annotations, Docstrings e Testes Automatizados.
"""

from typing import List, Union, Tuple
import math
import unittest


class Calculadora:
    """
    Classe representativa de uma calculadora com memória e histórico.
    """

    def __init__(self, valor_inicial: float = 0.0):
        self._resultado: float = float(valor_inicial)
        self._historico: List[str] = []

    @property
    def resultado(self) -> float:
        """Retorna o valor atual acumulado na memória."""
        return self._resultado

    @property
    def historico(self) -> List[str]:
        """Retorna a lista de operações realizadas."""
        return self._historico.copy()

    def _registrar(self, operacao: str) -> None:
        """Registra uma operação no histórico interno."""
        registro = f"{operacao} -> {self._resultado}"
        self._historico.append(registro)

    def somar(self, *valores: float) -> float:
        """Soma um ou mais valores ao resultado atual."""
        total = sum(valores)
        self._resultado += total
        self._registrar(f"+ {valores}")
        return self._resultado

    def subtrair(self, valor: float) -> float:
        """Subtrai um valor do total acumulado."""
        self._resultado -= valor
        self._registrar(f"- {valor}")
        return self._resultado

    def multiplicar(self, valor: float) -> float:
        """Multiplica o valor atual por um fator."""
        self._resultado *= valor
        self._registrar(f"* {valor}")
        return self._resultado

    def dividir(self, divisor: float) -> float:
        """Divide o valor acumulado por um divisor."""
        if divisor == 0:
            raise ZeroDivisionError("Impossível dividir por zero!")
        self._resultado /= divisor
        self._registrar(f"/ {divisor}")
        return self._resultado

    def potencia(self, expoente: float) -> float:
        """Eleva o valor atual ao expoente fornecido."""
        self._resultado = self._resultado ** expoente
        self._registrar(f"** {expoente}")
        return self._resultado

    def raiz_quadrada(self) -> float:
        """Calcula a raiz quadrada do número atual."""
        if self._resultado < 0:
            raise ValueError("Não é possível calcular raiz quadrada real de número negativo!")
        self._resultado = math.sqrt(self._resultado)
        self._registrar("sqrt()")
        return self._resultado

    def fatorial(self) -> int:
        """Calcula o fatorial do número atual (se for inteiro positivo)."""
        if self._resultado < 0 or not self._resultado.is_integer():
            raise ValueError("Fatorial só é suportado para números inteiros não-negativos!")
        self._resultado = float(math.factorial(int(self._resultado)))
        self._registrar("fatorial()")
        return int(self._resultado)

    def limpar(self) -> None:
        """Reseta o acumulador para zero."""
        self._resultado = 0.0
        self._registrar("RESET")


# =====================================================================
# Testes Unitários Automatizados
# =====================================================================

class TestCalculadora(unittest.TestCase):
    def setUp(self):
        self.calc = Calculadora()

    def test_soma_basica(self):
        self.calc.somar(10, 5, 2)
        self.assertEqual(self.calc.resultado, 17.0)

    def test_subtracao_e_multiplicacao(self):
        self.calc.somar(20)
        self.calc.subtrair(5)
        self.calc.multiplicar(2)
        self.assertEqual(self.calc.resultado, 30.0)

    def test_divisao_por_zero(self):
        self.calc.somar(10)
        with self.assertRaises(ZeroDivisionError):
            self.calc.dividir(0)

    def test_potencia_e_raiz(self):
        calc = Calculadora(4)
        calc.potencia(2)  # 16
        self.assertEqual(calc.resultado, 16.0)
        calc.raiz_quadrada()  # 4
        self.assertEqual(calc.resultado, 4.0)


if __name__ == "__main__":
    print("--- Demonstração da Calculadora POO ---")
    calc = Calculadora(10)
    print(f"Início: {calc.resultado}")
    calc.somar(15)
    print(f"Após somar 15: {calc.resultado}")
    calc.multiplicar(2)
    print(f"Após multiplicar por 2: {calc.resultado}")
    calc.potencia(2)
    print(f"Após elevar ao quadrado: {calc.resultado}")

    print("\\n--- Histórico de Operações ---")
    for linha in calc.historico:
        print(" ", linha)

    print("\\n--- Executando Testes Unitários ---")
    unittest.main(argv=[''], exit=False)
`
  },
  {
    id: 'cientifica',
    title: 'Calculadora Científica & Expressões Matemáticas',
    filename: 'calculadora_cientifica.py',
    description: 'Suporte a funções trigonométricas (sin, cos, tan), logaritmos, constantes pi e e, além de conversão radianos/graus.',
    category: 'cientifica',
    tags: ['Trigonometria', 'Logaritmo', 'Científica', 'math'],
    code: `"""
Calculadora Científica em Python usando o módulo 'math'.
Resolve expressões matemáticas completas e funções avançadas.
"""

import math

def calcular_expressao(expr: str):
    """
    Avalia com segurança expressões que utilizam a biblioteca math.
    """
    contexto_seguro = {
        "math": math,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "asin": math.asin,
        "acos": math.acos,
        "atan": math.atan,
        "sqrt": math.sqrt,
        "log": math.log,        # ln (base e)
        "log10": math.log10,    # log na base 10
        "log2": math.log2,      # log na base 2
        "exp": math.exp,
        "pi": math.pi,
        "e": math.e,
        "abs": abs,
        "pow": pow,
        "radians": math.radians,
        "degrees": math.degrees,
        "factorial": math.factorial
    }

    try:
        # Avalia a expressão de forma controlada
        resultado = eval(expr, {"__builtins__": {}}, contexto_seguro)
        return resultado
    except ZeroDivisionError:
        return "Erro: Divisão por zero!"
    except Exception as e:
        return f"Erro ao calcular: {e}"


if __name__ == "__main__":
    print("=== Exemplos de Cálculos Científicos em Python ===")
    
    exemplos = [
        "2 ** 10",                                  # Potência
        "math.sqrt(144) + 5",                       # Raiz quadrada
        "sin(radians(90))",                         # Seno de 90 graus
        "log10(1000)",                              # Logaritmo base 10
        "factorial(6)",                             # Fatorial de 6!
        "pi * (5 ** 2)",                            # Área do círculo (r=5)
        "(10 // 3) + (10 % 3)",                     # Divisão inteira + resto
    ]

    for ex in exemplos:
        res = calcular_expressao(ex)
        print(f"Expressão: {ex:25} -> Resultado: {res}")
`
  }
];

export interface SnippetExample {
  title: string;
  category: string;
  code: string;
  description: string;
}

export const RUNNABLE_SNIPPETS: SnippetExample[] = [
  {
    title: 'Cálculo de Juros Compostos & Aporte Mensal',
    category: 'Financeiro',
    description: 'Simula o crescimento de investimentos ao longo dos anos com aportes mensais e juros.',
    code: `# Cálculo de Investimento com Aporte Mensal
aporte_inicial = 5000.0   # R$
aporte_mensal = 500.0     # R$ por mês
taxa_anual = 0.10         # 10% ao ano
anos = 5

taxa_mensal = (1 + taxa_anual) ** (1 / 12) - 1
meses = anos * 12

saldo = aporte_inicial
total_investido = aporte_inicial

print(f"--- Simulação para {anos} anos ({meses} meses) ---")
print(f"Taxa mensal equivalente: {taxa_mensal * 100:.2f}%\\n")

for mes in range(1, meses + 1):
    saldo = saldo * (1 + taxa_mensal) + aporte_mensal
    total_investido += aporte_mensal

lucro = saldo - total_investido
print(f"Total Investido do Bolso: R$ {total_investido:,.2f}")
print(f"Saldo Final Acumulado:     R$ {saldo:,.2f}")
print(f"Lucro em Juros:            R$ {lucro:,.2f}")
`
  },
  {
    title: 'Fórmula de Bhaskara (Equação do 2º Grau)',
    category: 'Álgebra',
    description: 'Calcula o discriminante (Delta) e as raízes reais ou complexas de ax² + bx + c = 0.',
    code: `import math

# Coeficientes: a*x² + b*x + c = 0
a = 1
b = -5
c = 6

print(f"Equação: {a}x² + ({b})x + ({c}) = 0")

delta = b**2 - 4 * a * c
print(f"Delta = {delta}")

if delta > 0:
    x1 = (-b + math.sqrt(delta)) / (2 * a)
    x2 = (-b - math.sqrt(delta)) / (2 * a)
    print(f"Duas raízes reais distintas:")
    print(f"x1 = {x1}")
    print(f"x2 = {x2}")
elif delta == 0:
    x = -b / (2 * a)
    print(f"Raiz real única:")
    print(f"x = {x}")
else:
    real = -b / (2 * a)
    imag = math.sqrt(-delta) / (2 * a)
    print(f"Raízes complexas:")
    print(f"x1 = {real} + {imag:.2f}i")
    print(f"x2 = {real} - {imag:.2f}i")
`
  },
  {
    title: 'Estatística com o módulo "statistics"',
    category: 'Estatística',
    description: 'Calcula média, mediana, desvio padrão amostral e variância de um conjunto numérico.',
    code: `import statistics

# Lista de dados amostrais (ex: notas de alunos ou medições)
dados = [7.5, 8.0, 6.5, 9.0, 7.5, 10.0, 5.0, 8.5]

print(f"Amostra de dados: {dados}")
print(f"Total de observações: {len(dados)}")
print("=" * 35)

media = statistics.mean(dados)
mediana = statistics.median(dados)
moda = statistics.mode(dados)
desvio_padrao = statistics.stdev(dados)
variancia = statistics.variance(dados)

print(f"Média:          {media:.2f}")
print(f"Mediana:        {mediana:.2f}")
print(f"Moda:           {moda:.2f}")
print(f"Desvio Padrão:  {desvio_padrao:.2f}")
print(f"Variância:      {variancia:.2f}")
`
  },
  {
    title: 'Calculadora de IMC (Índice de Massa Corporal)',
    category: 'Saúde',
    description: 'Calcula o IMC baseado em peso e altura e classifica segundo a OMS.',
    code: `peso = 74.5    # kg
altura = 1.76  # metros

imc = peso / (altura ** 2)

print(f"Peso: {peso} kg | Altura: {altura} m")
print(f"Seu IMC é: {imc:.2f}")

if imc < 18.5:
    classificacao = "Abaixo do peso"
elif imc < 24.9:
    classificacao = "Peso normal (Parabéns!)"
elif imc < 29.9:
    classificacao = "Sobrepeso"
elif imc < 34.9:
    classificacao = "Obesidade Grau I"
elif imc < 39.9:
    classificacao = "Obesidade Grau II"
else:
    classificacao = "Obesidade Mórbida"

print(f"Classificação: {classificacao}")
`
  },
  {
    title: 'Conversor de Bases Numéricas (Programador)',
    category: 'Programador',
    description: 'Converte números entre decimal, binário, octal, hexadecimal e operações bit a bit.',
    code: `numero = 255

print(f"Número Decimal:     {numero}")
print(f"Binário (bin):      {bin(numero)}")
print(f"Hexadecimal (hex):  {hex(numero)}")
print(f"Octal (oct):        {oct(numero)}")

print("\\n--- Operações Bit a Bit em Python ---")
a = 0b1100  # 12 em binário
b = 0b1010  # 10 em binário

print(f"a = {bin(a)} ({a})")
print(f"b = {bin(b)} ({b})")
print(f"a & b (AND) = {bin(a & b)} ({a & b})")
print(f"a | b (OR)  = {bin(a | b)} ({a | b})")
print(f"a ^ b (XOR) = {bin(a ^ b)} ({a ^ b})")
print(f"a << 2      = {bin(a << 2)} ({a << 2})")
`
  }
];
