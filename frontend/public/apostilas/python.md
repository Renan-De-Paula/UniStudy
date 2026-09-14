# Programação Python

## 🔗 Links Uteis

[‣](https://app.notion.com/p/bf31dd30493247229eba2923547a9267?pvs=21) 

[Notions.txt](Notions.txt)

#### Aprender linguas

```jsx
você será o meu professor de inglês.
a partir de agora, quero que você crie frases pra mim
dividiremos os níveis de dificuldades de 1 a 20. Caso eu peça
para subir um nível de dificuldade, você irá subir 1 nível por vez, o mesmo pra descer, 
salvo caso eu especifique quantos níveis quero mudar. 
Nossa forma de aprendizado, será por frases, você criará uma sequência
de 80 frases, aonde, nas primeiras 40, terão um contexto, e nas 40
subsequentes o contexto/palavras serão repetidos, para que eu possa
verificar se entendi e consigo recordar da minha memória.
Você também irá, logo abaixo de cada frase em inglês, inserir a tradução em 
português itálico, e se possível numa fonte um pouco menor
(a ideia é que eu traduza sem olhar e, caso eu tenha
dúvidas, dou uma olhadela rápida na tradução).
Ao final de cada ciclo de 80 frases, me dê uma pequena série de dicas
sobre o que acabei de aprender.
evite temas de viagens, e horários.
meu nível atual é: 2
```

# Algoritmos & VisuAlg

## Lógica de Programação

A lógica de programação consiste em você compreender a linguagem usada, conseguindo transcrever o que um código significa ou criando um código a partir da linguagem. No exemplo abaixo, estamos pedindo para o VisuAlg mostrar uma mensagem na tela, a partir do comando “escreva”, e então para que o usuário insira um valor, a partir do comando “leia”.

```jsx
var
n1 : real
inicio

		escreva("Escreva o valor da Variável")
		leia(n1)
```

Agora, temos um código que calcula a média aritmética dentre 3 notas.

```jsx
var
n1, n2, n3, media : real
inicio

		escreva("Escreva o valor da primeira nota")
		leia(n1)
		escreva("Escreva o valor da segunda nota")
		leia(n2)
		escreva("Escreva o valor da teceira nota")
		leia(n3)
		
		media <- (n1 + n2 + n3) / 3
		escreva("A media foi de ", media)
```

Aqui temos um código que requer dois valores, para que o programa nos mostre comparações verdadeiras e falsas entre eles.

```jsx
var
a, b : real
inicio

		escreva("digite a ")
		leia(a)
		escreva("digite b ")
		leia(b)
		
		escreva("A é maior que B?", a > b)
		escreva("A é menor que B?", a < b)
		escreva("A é igual a B?", a = b)
		escreva("A é diferente a B?", a <> b)
```

Por último, aqui temos um programa em que o usuário escolhe uma fruta de uma feira para compra.

```jsx
var
a: literal
inicio

		escreval("digite qual fruta você vai levar ")
		leia(a)
		se a = "Abacaxi" entao
				escreva("Você comprou abacaxi com sucesso!")
				senao
						se a = "Banana" entao
						escreva("Você comprou banana com sucesso!")
				senao
						se a = "Melancia" entao
						escreva("Você comprou melancia com sucesso!")
				senao
						escreva("Você comprou morango com sucesso!")
						fimse
				fimse
		fimse

fimalgoritmo
```

## Exercícios

**1.** Crie um programa em python que verifique se o email do usuário possui um “@”, e caso haja, escreva “Cadastro efetuado com sucesso.” Caso contrário, escreva “Endereço de email inválido”.

- Resolução:
    
    ```python
    email = input('Informe seu email: ')
    if '@' in email:
        print('Cadastro efetuado com sucesso.')
    else:
        print('Endereço de email inválido.')
    ```
    

**1.** Faça com que o usuário digite o nome e a idade de um indivíduo. Caso a idade seja menor que 12, a pessoa é uma criança. Caso contrário, se for menor de 18, é um adolescente. Caso contrário, se for menor de 50, é um adulto. Caso contrário, será um senior.

---

**2.** Crie um programa que receba uma entrada de quantas vezes o usuário deseja repetir o programa. Após isso, deve repetir a frase “Estou na linha N” uma quantidade de vezes igual ao número especificado pelo usuário (Estou na linha 1, Estou na linha 2 … Estou na linha N).

## Desafios

**1.** Crie um programa em python que verifique se o email do usuário possui um “@”, e caso haja, escreva “Cadastro efetuado com sucesso.” Caso contrário, escreva “Endereço de email inválido”.

- Resolução:
    
    ```python
    email = input('Informe seu email: ')
    if '@' in email:
        print('Cadastro efetuado com sucesso.')
    else:
        print('Endereço de email inválido.')
    ```
    

**1.** Crie um programa de adivinhação de número, dizendo se o número é maior ou menor até que o usuário acerte o número a ser adivinhado.

---

**2.** Se o aluno do curso de python tiver pelo menos 90% de presença e uma nota ≥ a 60 ele estará “aprovado”. Se ele tiver presença e notas superiores a 95% e 85 respectivamente, ele estará “aprovado com destaque”.

### Fluxogramas

Fluxogramas são representações visuais de um algoritmo, tal qual deve ter início e fim definidos e todos os caminhos que possivelmente forem tomados devem chegar ao fim. O fluxograma deve ser construído de forma simples, para que o usuário consiga entender mesmo sem ter amplo conhecimento específico do assunto.

### Algoritmos

Algoritmos são uma forma de representar o passo a passo de um programa não utilizando-se de uma linguagem específica, servindo como um guia para que possamos nos nortear passo a passo durante a construção dos nossos códigos. Ainda que possam ser utilizados para tudo no dia a dia, iremos utilizá-lo com foco na programação, pensando nele sempre antes de construirmos um programa.

### Exemplo 1

O seguinte exemplo é um algoritmo que pergunta seu nome e idade, e então faz um teste lógico que verifica se você é senior na empresa.. e oferece um bolo grátis no final! :D

```jsx
var
meuNome : string
idade : inteiro

inicio
	escreval ("Digite seu nome")
	leia(meuNome)
	escreval("Digite sua idade")
	leia(idade)
	se idade > 60 entao
	  escreval("Parabéns ", meuNome, ", você é senior com ", idade, " anos de idade!")
	senao
	  escreval("Continue trabalhando na nossa empresa, um dia você tbm pode ser senior!")
	fimse
	escreval("Pode retirar o ticket de vale bolo de graça na saída!")
fimalgoritmo
```

### Exemplo 2

O próximo programa pergunta sua idade e seu sexo, para então verificar se você já pode se aposentar.

```jsx
var
idade : inteiro
sexo : string

inicio
	escreval("idade")
	leia(idade)
	escreval("sexo")
	leia(sexo)
	se (idade>=63) e (sexo = "m") entao
		escreva("O senhor está aposentado.")
	senao
		se (idade>=58) e (sexo= "f") entao
			escreva("A Senhora está aposentada.")
		senao
			escreva("Ainda não!")
		fimse
	fimse
fimalgoritmo
```

### Exemplo 3

```jsx
var
nota, faltas : inteiro

inicio
	escreval("digite a nota do aluno")
	leia(nota)
	escreval("digite as faltas do aluno")
	leia(faltas)
	se (nota < 30) e (faltas>10) entao
		escreva("O Aluno foi reprovado")
	senao
		se nota < 60 entao
			escreva("O Aluno está de recuperação")
		senao
			escreva("O aluno está aprovado")
		fimse
	fimse
fimalgoritmo
```

### Exercícios:

1-Verifique o nome do usuário, escreva uma mensagem de bom dia para ele.

---

2-Verifique o nome e a idade de um cidadão e informe se o mesmo pode ou não votar.

---

3-Sabendo o nome e o salário de um usuário, informe se o mesmo deve ou não pagar INSS

- *Desafio (Difícil):*
    
    Pesquise as porcentagens de taxa de INSS de acordo com a faixa salarial do usuário e informe o valor exato do quanto ele deve pagar com base em seu salário.
    

---

4-Imagine que você é uma princesa e, para entrar em seu castelo, você cobrará uma taxa aos cidadãos baseado em sua faixa etária. Crie um programa que informe o quanto um cidadão deve pagar de taxa, baseado na idade que ele informar

*Dados: 0-12 anos: 15 moedas*

*13-25: 35 moedas*

*26-40: 40 moedas*

*41-99: 30 moedas*

Note que, por você estar em um tempo aonde a longevidade não era alta, não devem ser aceitas entradas acima de 99 anos. Também não devem ser aceitas entradas abaixo de 0 anos.

---

5-Uma empresa dará uma viagem para seus funcionários com os destinos dessas viagens baseados nos setores em que estes trabalham. Crie um programa que pergunte o nome do usuário e a qual setor ele pertence, indicando então qual será seu destino da viagem e limite de gastos diários com alimentação que eles podem ter.

| Setores | Limite Diario Alimentacao (R$) |
| --- | --- |
| Gerencia | 350 |
| RH | 300 |
| Contabil | 300 |
| Operacional | 300 |

Caso o funcionário informe um setor inválido, informe que o setor informado é inválido e informe também como ele deve digitar os setores na sua forma correta.

# ⚙💻 Nivel 0: Instalação

Para utilizar o notebook jupyter, estaremos instalando o Anaconda, IDE’s de python trazem uma *suite* de facilidades específicas e o Anaconda proverá o que precisamos para começar nossa programação.

**1.** Entre no site [https://www.anaconda.com/download](https://www.anaconda.com/download)

**2.** Insira seu email. Não é necessário marchar o *checkbox.*

![Untitled](Untitled.png)

**3.** Faça o download do Anaconda*.*

![Untitled](Untitled%201.png)

![Untitled](Untitled%202.png)

**3.** Após o download, execute o arquivo baixado e clique em “próximo” até que a instalação esteja finalizada. A instalação demora cerca de 13 minutos.

![Untitled](Untitled%203.png)

Após a instalação, basta abrir o menu Iniciar e executar o *Jupyter Notebook.*

# 🛡🗡 Nivel 1: Funções Básicas

## Tabela Didática de Aprendizado em Python (Linguagem Estruturada)

| Etapa | Conceito | O que é | Como funciona | Sintaxe | Exemplo | Onde usar | Exemplo mental | Observações |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ➕ Operadores aritméticos | Realizam cálculos | Operam números | + - * / | total = a + b | Cálculos gerais | Soma de compras | / gera float |
| 2 | 🖥️ Entrada e saída | Mostrar e receber dados | print exibe, input recebe | print(); input() | nome = input() | Interação com usuário | Perguntar nome na tela | input retorna string |
| 3 | 📦 Variáveis | Armazenam valores | Nome recebe valor com = | x = 10 | nome = "Ana" | Qualquer programa | Caixa guardando valor | Nome claro é essencial |
| 4 | 🔢 Tipos de dados | Classificação dos dados | int, float, str, bool | int(), str() | idade = 20 | Controle de dados | Idade número, nome texto | Tipo influencia operação |
| 5 | 🧮 Conversão | Troca tipo | Converte valores | int(), float() | int("10") | Input numérico | Converter idade | Evita erro |
| 6 | 📏 len() | Mede tamanho | Conta itens | len() | len(nomes) | Contagem | Quantos alunos | Muito usado |
| 7 | ⚖️ Comparação | Compara valores | Retorna True/False | == > < | idade > 18 | Decisões | Verificar maior idade | Base do if |
| 8 | 🔗 Lógicos | Combina condições | Usa and, or, not | and, or | idade > 18 and ativo | Regras complexas | Acesso com 2 condições | Usado com if |
| 9 | 🔀 if / else | Tomada de decisão | Executa bloco condicional | if cond: | if idade > 18: | Regras de negócio | Aprovar aluno | Indentação obrigatória |
| 10 | 🔍 Índice | Acesso a posição | Usa posição numérica | lista[0] | nomes[0] | Buscar dados | Primeiro aluno | Começa em 0 |
| 12 | 🔧 Métodos string | Funções de texto | Manipulam string | .upper() | nome.upper() | Limpeza de dados | Nome maiúsculo | Retorna novo valor |
| 11 | 📚 Listas | Vários valores juntos | Estrutura indexada | [] | nomes = ["Ana"] | Dados agrupados | Lista de alunos | Mutável |
| 13 | ✏️ Alteração lista | Modificar valores | Atribui novo valor | lista[0] = x | nomes[0] = "João" | Atualizações | Corrigir nome | Lista permite alteração |
| 14 | 🔁 for | Repetição com sequência | Percorre lista | for x in lista: | for n in nomes | Listas, dados | Ler lista de alunos | Mais usado que while |
| 15 | 🔄 while | Repetição por condição | Loop até condição falsa | while cond: | while senha != ok | Validação | Pedir senha | Cuidado infinito |
| 16 | 🧩 Funções | Blocos reutilizáveis | Define com def | def nome(): | def soma(): | Reutilização | Função calcular média | Evita repetição |
| 17 | 📥 Parâmetros | Entrada da função | Recebe valores | def f(x): | soma(a, b) | Funções dinâmicas | Passar valores | Flexibilidade |
| 18 | 📤 Return | Saída da função | Retorna resultado | return x | return soma | Processamento | Retornar cálculo | Sem return = vazio |
| 19 | 🌍 Escopo | Onde existe variável | Local/global | def f(): | variável local | Organização | Variável dentro função | Evitar global |
| 20 | 🧹 Boas práticas | Código limpo | Organização | nomes claros | idade_usuario | Projetos reais | Código legível | Facilita manutenção |

## Tabela Didática de Aprendizado em Python (Orientação a Objetos)

| Etapa | Conceito | O que é | Como funciona | Sintaxe | Exemplo | Onde usar | Exemplo mental | Observações |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 📦 Objeto | Instância de uma classe | Criado a partir da classe | obj = Classe() | p = Pessoa() | Uso real da classe | Casa construída | Cada objeto é único |
| 1 | 🧱 Classe | Estrutura que define um tipo de objeto | Serve como molde para criar objetos | class Nome: | class Pessoa: | Modelagem de sistemas | Planta de uma casa | Base do OOP |
| 4 | 🧾 Atributos | Variáveis do objeto | Guardam dados internos | self.nome = valor | self.idade = 20 | Armazenar estado | Características da pessoa | Usam self |
| 6 | 🔗 self | Referência ao próprio objeto | Permite acessar atributos e métodos | self.atributo | self.nome | Dentro da classe | "eu mesmo" | Obrigatório |
| 5 | ⚙️ Métodos | Funções dentro da classe | Definem comportamentos | def metodo(self): | def falar(self): | Ações do objeto | Pessoa falando | Sempre usam self |
| 3 | 🏗️ **init** | Método construtor | Inicializa dados do objeto | def **init**(self): | def **init**(self, nome): | Criar objetos com dados | Dar nome ao nascer | Executa automaticamente |
| 7 | 🧪 Instanciação | Criar objetos | Chamar a classe | Classe() | Pessoa("Ana") | Criar entidades | Criar pessoa | Executa **init** |
| 9 | 🧬 Herança | Reutilizar código de outra classe | Classe filha herda da mãe | class Filho(Pai): | class Aluno(Pessoa): | Evitar repetição | Filho herda pai | Reutilização forte |
| 11 | 🧠 Polimorfismo | Mesmo método, comportamentos diferentes | Depende do objeto | metodo() | obj.falar() | Flexibilidade | Pessoas falando diferente | Ligado à herança |
| 12 | 🏷️ Classe vs Instância | Diferença entre classe e objeto | Classe = molde, objeto = uso | Classe / obj | Pessoa / p1 | Entendimento base | Planta vs casa | Fundamental |
| 13 | 📊 Atributo de classe | Compartilhado por todos objetos | Definido fora do **init** | var = x | especie = "Humano" | Dados comuns | Todos humanos iguais | Compartilhado |
| 14 | 🧷 Método de classe | Atua na classe, não no objeto | Usa @classmethod | @classmethod | def criar(cls): | Fábricas | Criar objetos padrão | Usa cls |
| 15 | 🧩 Método estático | Não usa classe nem objeto | Função isolada na classe | @staticmethod | def util(): | Utilidades | Calculadora | Independente |
| 16 | 🔄 Composição | Classe dentro de outra | Um objeto usa outro | self.obj = Classe() | self.motor = Motor() | Sistemas complexos | Carro tem motor | Mais flexível que herança |
| 8 | 🔒 Encapsulamento | Controle de acesso | Protege dados internos | _var / __var | self._saldo | Segurança | Cofre com senha | Convenção Python |
| 17 | 🧹 Boas práticas OOP | Organização do código | Separar responsabilidades | nomes claros | class Usuario | Projetos reais | Código modular | Evitar classes gigantes |

## Tabela Didática de Aprendizado em Python (Bibliotecas, Frameworks e Ecossistema)

| Etapa | Conceito | O que é | Como funciona | Sintaxe | Exemplo | Onde usar | Exemplo mental | Observações |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 🧩 Módulo | Arquivo Python reutilizável | Contém funções/variáveis | import arquivo | import utils | Organização | Gaveta específica | Parte da biblioteca |
| 1 | 📦 Biblioteca | Conjunto de códigos prontos | Importada para reutilizar funções | import lib | import math | Funções prontas | Caixa de ferramentas | Evita reinventar |
| 3 | 🏗️ Framework | Estrutura pronta de aplicação | Define padrão e fluxo | segue regras do framework | Django app | Sistemas completos | Planta + regras | Mais rígido que biblioteca |
| 4 | 🔌 Import | Trazer código externo | Permite usar módulos | import / from | from math import sqrt | Reutilização | Pegar ferramenta | Pode importar específico |
| 17 | 📥 pip | Gerenciador de pacotes | Instala bibliotecas | pip install | pip install pandas | Instalação | Loja de apps | Essencial |
| 5 | 📚 math | Biblioteca padrão matemática | Operações matemáticas | math.func | math.sqrt(9) | Cálculos | Calculadora | Já vem com Python |
| 6 | 🎲 random | Geração de aleatoriedade | Escolhas aleatórias | random.func | random.randint() | Jogos, testes | Sorteio | Muito usado |
| 7 | 📅 datetime | Manipulação de datas | Cria e formata datas | datetime.now() | datetime.today() | Sistemas com tempo | Agenda | Essencial backend |
| 8 | 📁 os | Interação com sistema | Arquivos e diretórios | os.func | os.listdir() | Automação | Navegar pastas | Muito usado em scripts |
| 9 | 🧪 sys | Controle do sistema Python | Argumentos e execução | sys.func | sys.exit() | Scripts avançados | Controle interno | Mais técnico |
| 10 | 📊 pandas | Manipulação de dados | Trabalha com tabelas | pd.func | pd.read_csv() | Data science | Excel no Python | Muito poderoso |
| 11 | 🔢 numpy | Cálculo numérico avançado | Arrays eficientes | np.array() | np.array([1,2]) | Ciência de dados | Vetores matemáticos | Base do pandas |
| 12 | 📈 matplotlib | Visualização de dados | Cria gráficos | plt.plot() | plt.show() | Relatórios | Gráfico Excel | Visualização |
| 15 | 🗄️ JSON | Formato de dados | Estrutura chave-valor | json.loads() | {"nome":"Ana"} | APIs | Dicionário | Muito comum |
| 13 | 🤖 requests | Requisições HTTP | Acessa APIs | requests.get() | get(url) | Integração web | Pedir dados site | Muito usado |
| 14 | 🌐 API | Interface entre sistemas | Permite comunicação | via requests | API REST | Integrações | Garçom entre sistemas | JSON comum |
| 24 | 🗃️ Banco de dados | Armazenamento persistente | Salva dados estruturados | SQL | SELECT * | Sistemas | Arquivo organizado | Essencial |
| 23 | 🔗 SQLAlchemy | ORM para banco de dados | Conecta Python ao banco | model | classe mapeada | Backend | Tradutor SQL | Evita SQL direto |
| 22 | 🚀 Flask | Framework web leve | Mais simples e flexível | rota simples | app.route() | APIs | Micro serviço | Fácil aprender |
| 21 | 🕸️ Django | Framework web completo | Backend robusto | segue padrão MVC | app Django | Sistemas web | Construção completa | Alto nível |
| 16 | 🧠 Ambiente virtual | Isolamento de projetos | Separa dependências | venv | python -m venv | Projetos | Caixa separada | Evita conflitos |
| 18 | 🧪 pytest | Testes automatizados | Valida código | pytest | test_func() | Qualidade | Testar máquina | Profissional |
| 19 | 🧵 threading | Execução paralela | Múltiplas tarefas | thread | Thread() | Performance | Várias mãos | Limitação GIL |
| 20 | ⚡ asyncio | Programação assíncrona | Execução não bloqueante | async/await | async def | I/O intensivo | Cozinhar várias coisas | Avançado |
| 25 | 🧹 Boas práticas | Organização de projetos | Estrutura modular | pastas / imports | projeto organizado | Projetos reais | Escritório organizado | Escalabilidade |

## 🧱🌱 **Capítulo 1 — Comando de Voz (`print()`)**

### O Narrador do jogo

Em um RPG, existem sempre alguem que conta a historia…

No Python, esse papel é do print( )

Ele é o **Narrador do jogo**, responsavel por mostrar tudo que acontece:

- 📜 Diálogos
- ⚔️ Ações
- 🧪 Resultados de cálculos
- 💀 Eventos da batalha

### 📜 Sintaxe básica

```python
print('Texto de saida na tela')
```

Tudo que estiver dentro do **print( )** sera exibido na tela.

#### ⚔️ Exemplo 1 — Primeira narrativa

```python
print('⚔️  Um heroi entrou na dungeon!')
print(15 + 4)
print(10 - 2)
print('2 + 3 * 6)
print(1.5 * 3)
print(2 / 4)
```

#### 🎮 Saída no jogo:

```
⚔️ Um herói entrou na dungeon!
60
20
4.5
0.5
```

### 🧠 Regras do Reino

- 📄 Texto → Sempre entre **aspas**
- 🔢 Números → sem aspas
- ➕ Operções → Mostram apenas o **Resultado final**

### 🔗 União de palavras (Concatenação) ⚠️

Às vezes precisamos juntas falas do narrador com atributos do herói.

Isso é chamado de **concatenação.**

```python
vida = 100
print('A vida do herói é ' + str(vida))
```

📌 **str()** transforma o número em texto (magia de conversão)

## 🎮 Exemplo RPG

```python
ouro=50
print("💰 O herói possui "+str(ouro)+" moedas de ouro")
```

## ⚠️ Forma antiga (evitar)

```python
nome="WaaRsk8"
idade=40
tempo="noite"

print("Oi " + nome + " você tem " + str(idade) +" anos e hoje a " + tempo +" está linda!")
```

## 🧙‍♂️ Forma recomendada (magia moderna)

```python
nome = "WaaRsk8"
nivel = 50
classe = "Guerreiro"

print("O heroi {} é um {} de nivel {}".format(nome, classe, nivel))
```

## ❓ Dúvida do Aprendiz: “+” ou “,” ?

```
print("Herói:","WaaRsk8")
print("Herói:"+"WaaRsk8")
```

### 🧠 Diferença:

- `,` → separa elementos (mais usado 👍)
- `+` → junta tudo (menos flexível)

## ⚠️ Lei do Reino: Case Sensitive

O **Python** diferencia letras maiúsculas de minúsculas.

```python
heroi="Arthas"
print(HEROI)# ❌ ERRO
```

📌 Isso gera erro porque:

- `heroi` ≠ `HEROI`

## ⚠️ Lei do Tempo (Ordem de execução)

O código é lido **de cima para baixo**

### ❌ Feitiço inválido:

```
print(nome)
nome="Arthas"
```

### ✔ Correto:

```
nome="Arthas"
print(nome)
```

## ⚙️ Poderes avançados do narrador

🔹 **sep** (separador mágico)

```python
print("b", "n", "n", " ", sep="a")
```

🎮 Saída:

```
banana
```

**🔹** **end** (Final da fala)

```
print("⚔️ Ataque",end=" ")
print("crítico!!!")
```

🎮 Saída:

```
⚔️ Ataque crítico!!!
```

## 🏰 Quadro de Missões

## ⚠️ Dica do Mestre

> A programação é como um RPG.
> 
> 
> Você só evolui quando pratica.
> 

### 🥉 Bronze — Aprendiz

1. Mostre o nome de um herói
2. Mostre o dano de um ataque (10 * 5)

### 🥈 Prata — Aventureiro

1. Mostre:
    - Nome
    - Classe
    - Nível

### 🥇 Ouro — Guerreiro

1. Mostre:
    - Vida
    - Mana
    - Ouro

Usando `.format()`

### 💎 Diamante — Mestre do Código

Crie uma narrativa:

- Um herói entra na dungeon
- Ele ataca
- Mostre o dano causado
- Mostre a vida restante

## 🧱🌱 **Capítulo 2 — Variáveis (Atributos do Herói)**

### **🧬 O que são Variáveis?**

Em um RPG, todo personagem possui atributos:

- ❤️ Vida
- 🔮 Mana
- ⚔️ Força
- 🏹 Destreza

No python, esses atributos são chamados de **variaveis.**

Uma variavel é um espaço que guarda um valor que pode mudar durante o jogo.

🎮 Exemplo RPG

```python
vida = 100
mana = 50
nome = 'WaaRsk8'
vida+= 1000
print(f'Herói: {nome}')
print(f'Vida: {vida}')

mana += 100
print(f'Mana: {mana}')

```

🧠 Tipos de Variáveis (Tipos de Atributos)

| Tipo | Explicação | Exemplo RPG |
| --- | --- | --- |
| `str` | Texto | nome = "WaaRsk8" |
| `int` | Número inteiro | vida = 100 |
| `float` | Número decimal | dano = 35.5 |
| `bool` | Verdadeiro ou falso | vivo = True |

## 🎮 Exemplo RPG

```python
nome = "WaaRsk8"     # str
vida = 100          # int
dano = 35.5         # float
vivo = True         # bool

print(nome, vida, dano, vivo)

```

## ⚙️ Atribuição de Variáveis

Para dar um valor a uma variável usamos o símbolo`=`  (não é igual, é recebe)

```python
vida= 10

```

📌 Significa:

👉 “A variável vida recebe 100”

---

## 🎮 Exemplo RPG

```
ouro=200
nivel=5

print("Ouro:",ouro)
print("Nível:",nivel)
```

---

## ⚠️ Nomes proibidos (Palavras do sistema)

Existem palavras que você **NÃO pode usar como nome de variável**, porque já fazem parte do Python.

❌ Exemplos proibidos:

```
print =10
if =5
while =20
```

👉 Isso causa erro porque essas palavras já são usadas pelo sistema.

---

## ⚔️ Regra prática (do programador iniciante)

✔ Use nomes claros:

```
vida=100
mana=50
```

❌ Evite:

```
x=100
a=50
```

---

## 🧙‍♂️ f-String (Forma moderna de mostrar variáveis)

A melhor forma de exibir variáveis hoje é usando **f-string**

```
nome="Arthas"
print(f"Herói:{nome}")
```

---

## 🎮 Exemplo RPG

```
nome="Arthas"
vida=100

print(f"O herói{nome} possui{vida} de vida")
```

---

# 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Saudação do Reino

Crie:

```
nome="Arthas"
```

Mostre:

👉 “Bom dia Arthas”

✔ Resolução:

```
nome="Arthas"
print(f"Bom dia{nome}")
```

---

## 🥈 Missão 2 — Grupo de Aventureiros

Crie 3 heróis e mostre:

👉 “Os heróis X, Y e Z entraram na dungeon.”

✔ Resolução:

```
h1="Arthas"
h2="Jaina"
h3="Thrall"

print(f"Os heróis{h1},{h2} e{h3} entraram na dungeon.")
```

---

## 🥇 Missão 3 — Ficha de Personagem

Mostre:

👉 Nome + nível

✔ Resolução:

```
nome="Arthas"
nivel=10

print(f"O herói{nome} está no nível{nivel}")
```

---

## 💎 Missão 4 — Sistema de Combate

Crie 4 valores e faça:

👉 (n1 + n2) * (n3 + n4)

✔ Resolução:

```
dano_base=10
bonus=20
forca=30
arma=40

print((dano_base+bonus)* (forca+arma))
```

---

# ⚠️ Dicas do Mestre

- Variáveis são como atributos do personagem
- Sempre dê nomes claros
- Use f-string (é o padrão atual 🔥)

## 🧱🌱 **Capítulo 3 — Identificação de Tipos (`type()`) e Criação do Herói (`input()`)**

# 🔍 **Parte 1 — `type()` (Visão do Sistema)**

## 👁️ O Olho do Sistema

No mundo do RPG, existe uma magia que revela a natureza das coisas…

👉 No Python, essa magia é o `type()`

Ele mostra **o tipo de um valor ou variável**.

---

## ⚙️ Sintaxe

```
type(valor)
```

📌 Normalmente usamos com `print()` para ver o resultado.

---

## 🎮 Exemplo RPG

```
print(type(100))# vida
print(type("Arthas"))# nome
print(type(35.5))# dano
```

---

## 🧠 Resultado esperado

```
<class'int'>
<class'str'>
<class'float'>
```

---

## 🧪 Usando com variáveis

```
nome="Arthas"
print(type(nome))
```

---

## 🎮 Exemplo RPG

```
vida=100
mana=50.5
nome="Arthas"

print(type(vida))
print(type(mana))
print(type(nome))
```

---

## ⚠️ Observação importante

```
print(type(123))# int
print(type("123"))# str
```

🎮 Interpretação:

- `123` → número real no jogo
- `"123"` → apenas texto (não serve para cálculo)

---

---

# 🧙‍♂️ **Parte 2 — `input()` (Criação do Herói)**

## 🏰 Introdução

Agora o jogador entra no jogo…

👉 O `input()` permite que o jogador **insira dados no sistema**

---

## ⚙️ Sintaxe

```
variavel=input("Mensagem para o jogador: ")
```

---

## 🎮 Exemplo RPG

```
nome=input("Digite o nome do seu herói: ")
print(f"O herói{nome} iniciou sua jornada!")
```

---

## 🧠 Importante (REGRA DO JOGO)

👉 Tudo que vem do `input()` é **string (texto)**

```
idade=input("Digite sua idade: ")
```

📌 Mesmo digitando número, será texto!

---

## ⚠️ Problema comum

```
nivel=input("Digite o nível: ")
print(nivel+1)# ❌ ERRO
```

---

## 🧙‍♂️ Solução (Conversão de tipo)

Você pode converter o valor:

```
nivel=int(input("Digite o nível: "))
```

---

## 🎮 Exemplo RPG

```
nivel=int(input("Digite o nível do herói: "))
print(f"O herói está no nível{nivel+1} após evolução!")
```

---

## 🔄 Tipos de conversão

| Função | Converte para | Exemplo |
| --- | --- | --- |
| `int()` | Inteiro | vida = int(input()) |
| `float()` | Decimal | dano = float(input()) |
| `str()` | Texto | nome = str(input()) |

---

## 🎮 Exemplo RPG completo

```
nome=input("Nome do herói: ")
vida=int(input("Vida inicial: "))
mana=float(input("Mana inicial: "))

print(f"Herói:{nome}")
print(f"Vida:{vida}")
print(f"Mana:{mana}")
```

---

# 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Identificação

Mostre o tipo de:

- Nome do herói
- Vida
- Dano

---

## 🥈 Missão 2 — Criação do Herói

Peça ao jogador:

- Nome
- Classe

Mostre uma mensagem:

👉 “O herói X, da classe Y, entrou na dungeon”

---

## 🥇 Missão 3 — Evolução

Peça:

- Nível do herói

Mostre:

👉 nível + 1

---

## 💎 Missão 4 — Ficha Completa

Peça:

- Nome
- Vida
- Mana
- Nível

Mostre tudo formatado (f-string)

---

# ⚠️ Dicas do Mestre

- `type()` → mostra o tipo do dado
- `input()` → sempre retorna texto
- Use `int()` quando precisar calcular
- Sempre pense: “isso é número ou texto?”

## 🧱🌱 **Capítulo 4 — Conversões (Transformações Mágicas)**

## 🧙‍♂️ Introdução — Magia de Transformação

No mundo do RPG, existem magias capazes de transformar coisas…

👉 No Python, essas magias são:

- `int()` → transforma em número inteiro
- `float()` → transforma em número decimal
- `str()` → transforma em texto
- `bool()` → transforma em verdadeiro ou falso

---

## ⚙️ Exemplos básicos

```python
a = int("10")   # vira 10
b = str(315)    # vira "315"
```

---

## 🎮 Exemplo RPG

```python
vida = int("100")
ouro = str(50)

print(vida)
print("Moedas: " + ouro)
```

---

## ⚠️ Feitiço proibido (Erro comum)

Nem toda transformação é possível…

```python
c = int("Abóbora")  # ❌ ERRO
```

📌 Motivo:

- "Abóbora" não é número → impossível converter

---

## 🎮 Exemplo RPG

```python
mana = int("mana")  # ❌ erro
```

👉 O sistema não consegue transformar texto em número

---

## 🔮 Conversão para Booleano (`bool()`)

Booleano representa:

- ✅ Verdadeiro (`True`)
- ❌ Falso (`False`)

---

## 🎮 Exemplo RPG

```python
vida = 1
print(bool(vida))  # True → herói vivo

vida = 0
print(bool(vida))  # False → herói morreu 💀
```

---

## ⚠️ Regra importante

```python
print(bool("Arthas"))  # True
```

📌 Toda string → vira `True` (mesmo sendo texto)

---

# 💰 **Parte Extra — Porcentagem (Sistema de Buff/Debuff)**

---

## ⚔️ O que é porcentagem?

Porcentagem é usada para:

- 💥 Aumentar dano
- 🛡️ Reduzir dano
- 💰 Aplicar bônus

---

## 🧠 Fórmula básica

```python
porcentagem = valor * (percentual / 100)
```

---

## 🎮 Exemplo RPG

```python
dano = 100
buff = 20  # 20%

dano_final = dano * (buff / 100)

print(dano_final)
```

---

## ⚔️ Aumento de atributo

```python
vida = 100
aumento = 10  # 10%

vida = vida + (vida * aumento / 100)

print(vida)
```

---

## 🎮 Exemplo RPG

```python
ouro = 500
bonus = 50  # 50%

ouro_total = ouro + (ouro * bonus / 100)

print(f"O herói agora tem {ouro_total} moedas!")
```

---

# 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Transformação

Converta:

- "150" → inteiro
- 300 → string

---

## 🥈 Missão 2 — Vida do Herói

Crie:

- vida = 1 → mostrar se está vivo
- vida = 0 → mostrar se morreu

---

## 🥇 Missão 3 — Buff de Ataque

Um herói tem:

- dano = 200
- buff = 25%

👉 Mostre o dano final

---

## 💎 Missão 4 — Tesouro do Dragão

O herói possui:

- 500 moedas

Ele encontra um bônus de:

- 40%

👉 Mostre o total de moedas

---

## 🔥 Desafio Mestre (Avançado)

Um herói recebeu:

- 8 buffs de 11% (um após o outro)

👉 Calcule o valor final

💡 Dica:

```python
valor = valor * 1.11
```

(repita 8 vezes)

---

## 🧠 Desafio Lendário

Uma casa vale hoje:

- 300.000 moedas

Ela teve:

- 4 aumentos de 10%

👉 Qual era o valor original?

💡 Dica:

```python
valor = valor / 1.10
```

(repita 4 vezes)

---

# ⚠️ Dicas do Mestre

- Nem toda conversão é possível ⚠️
- `input()` sempre vem como texto
- Use conversão para fazer cálculos
- Porcentagem é essencial em sistemas de RPG

---

Se quiser, agora você está pronto para algo MUITO importante:

👉 **Capítulo 5 — Operadores (Sistema de Combate ⚔️🔥)**

👉 ou já posso começar a montar seu **RPG jogável no terminal com tudo que você aprendeu até agora** 😄

### Lista de Exercícios progressiva inicial

- **1.** Crie um programa que pergunte ao usuário seu nome e imprima a mensagem “bom dia {nome}” do usuário.
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        #Resolução 1: básico
        nome = input('informe seu nome: ')
        print('bom dia')
        print(nome)
        #R2: usando format
        nome = input('informe seu nome: ')
        print('bom dia {}'.format(nome) )
        #R3: usando f-String
        nome = input('informe seu nome: ')
        print(f'bom dia {nome}')
        ```
        
- **2.** Crie um programa que pergunte a idade de um usuário. Informe quantos anos faltam para ele ter 100 anos.
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        #Básica
        idade = int(input('idade?'))
        falta = 100-idade
        print('faltam ')
        print(falta)
        print('anos para vc fazer 100 anos')
        #R2 com .format
        idade = int(input('informe sua idade:'))
        print('Faltam: {} anos pra completar 100 anos'.format(100-idade))
        #com f-String
        print(f'faltam {idade} anos para você fazer 100 anos')
        ```
        
- **3.** Crie um programa em python que leia dois nomes, e salve em duas variáveis distintas. Após, o programa deve imprimir a mensagem <{nome1} e {nome2} comparecerão na festa.
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        ~~#format~~
        nome1,nome2= input('n1'),input('n2')
        print('{} e {} comparecerão na festa.'.format(nome1,nome2))
        #f string
        nome1 = input('informe o 1º nome: ')
        nome2 = input('informe o 2º nome: ')
        print(f'{nome1} e {nome2} compareceração a festa ')
        
        ```
        
- **4.** Numa situação real do dia a dia de Adriana, ela precisa fazer o orçamento de 5 itens para seus clientes, e mostrar uma mensagem com o total. Faça um programa que resolva esta situação simples de soma pra ela, imprimindo a mensagem, ao final: <O total do orçamento foi R${total}>
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        #Resposta easy
        a = int(input('informe a primeira despesa: '))
        b = int(input('Informe o próximo gasto: '))
        c = int(input('Informe o próximo gasto: '))
        d = int(input('Informe o próximo gasto: '))
        e = int(input('Informe o próximo gasto: '))
        print(f'Total gasto foi de: R${a+b+c+d+e}')
        #R$ elaborada
        a,b,c,d,e = float(input('item 1')),float(input('item 2')),float(input('item 3')),float(input('item 4')),float(input('item 5'))
        print('O total do orçamento foi R${:.2f}'.format(a+b+c+d+e))
        ```
        
- **5.** A partir do código abaixo, informe o tipo de cada uma das variáveis:
    - Dados
        
        ```python
        a = 12
        b = 1.5
        c = '10'
        d = 'leonardo'
        e = int('123')
        f = float(1)
        g = float('10.5')
        h = a
        j = str(float(int(input('informe seu salário (com centavos, separados por ponto)'))))
        ```
        
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        print(type(a))
        print(a)
        print(type(b))
        print(b)
        print(type(c))
        print(c)
        print(type(d))
        print(d)
        print(type(e))
        print(e)
        print(type(f))
        print(f)
        print(type(g))
        print(g)
        print(type(h))
        print(h)
        print(type(j))
        print(j)
        ```
        
    
- **6.** Crie 10 variáveis. Utilize um print, somente, para informar cada uma dessas variáveis. *Dica:* Para pular linhas dentro de um print, basta utilizar um \n. Exemplo: print(’bom dia\nBoa tarde\nBoa noite’)
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        nome = "WaaRsk8"
        idade = 30
        nivel = 90
        ouro = 1500.50
        ataque = 50
        defesa = 40
        vida = 5500.65
        armadura = True
        magia = False
        fala  = (input('informe sua fala: '))
        
        print("""Nome: {}
        				Idade: {} anos
        				Nível: {}""".format(nome, idade, nivel))
        print("Ataque: {}".format(ataque))
        print("Defesa: {}".format(defesa))
        print("Vida: {}".format(vida))
        print("Armadura: {}".format(armadura))
        print("Magia: {}".format(magia))
        print("Ouro: {} moedas".format(ouro))
        print("Fala: {}".format(fala.capitalize()))
        ```
        
- **7.** Crie um script em python que pergunte o nome, a idade, o salário e as despesas mensais de um indivíduo utilizando a função `input()`. Crie, então, uma resposta que diga:
        ”Nome: <nome> , idade: <idade>, no final do mes sobrará: <sobra>"
    - **⚠ Dica do Mestre:**
        
        A maestria na programação nasce da prática, não apenas da leitura. O código só ganha vida quando você o escreve! Tente resolver o desafio com sua própria lógica antes de espiar a solução. **Confie no seu processo; o erro de hoje é o acerto de amanhã!**
        
    - **Resolução:**
        
        ```python
        nome = input("Digite o nome: ")
        idade = input("Digite a idade: ")
        salario = input("Digite o salário: ")
        dispesas = input("Digite as despesas: ")
        resto = float(salario) - float(dispesas)
        
        print(f"Nome: {nome.capitalize()}, idade: {idade}, no final do mes sobrará: {resto:.2f}")
        ```
        
    

# 🧱⚔️ **Nível 2 — Estruturas de Condição**

## 📘 **Capítulo 5 — Testes Lógicos (Decisões do Destino)**

### 🧠 O que é um Teste Lógico?

No RPG, o jogo precisa tomar decisões:

- O heroi morreu? 💀
- O ataque foi forte? ⚔️
- o item está na mochila? 🎒

👉 Para isso usamos testes logicos.

Um testo logico é uma comparação entre dois valores

- ✅ `True` (Verdadeiro)
- ❌ `False` (Falso)

### ⚙️ Operadores Lógicos (Regras do Mundo)

| Operador | Significado | Exemplo RPG |
| --- | --- | --- |
| `>` | Maior que | dano > 50 |
| `<` | Menor que | vida < 20 |
| `>=` | Maior ou igual | nivel >= 10 |
| `<=` | Menor ou igual | mana <= 30 |
| `==` | Igual | classe == "Mago" |
| `!=` | Diferente | nome != "Arthas" |
| `in` | Está dentro | "espada" in inventario |

#### 🎮 Exemplos RPG

```python
vida = 100
print(vida > 50)
```

🎮 Interpretação:

A vida do heroi é maior que 50?

 ✔ Resultado:

- ✅ `True` (Verdadeiro)

```python
nivel = 5
print(nivel >= 10)
```

🎮 Interpretação:

O heroi pode entrar na dungeon avançada?

❌ Resultado:

- ❌ `False` (Falso)alse

#### 🧪 Exemplos práticos

```python
print(10 == 11) #False
print(5 > 4) #True
print(5 < 4) #False
print(7 >= 7) #True
print(9 <= 8) #False
print(11 != 12) #True
```

#### 🎮 Exemplo RPG completo

```python
dano = 80
print(dano > 50) #Ataque forte

classe = "Mago"
print(classe == "Mago") #É mago?

nome = "WaaRsk8"
print("nome != "Arragorn") #Não é Arragorn?
```

### 🗡️ Operador `in` (Inventário)

Usado para verificar se algo esta dentro de outro valor.

```python
print("a" in "amanda") #True
```

**🎮 Exemplo RPG**

```python
inventario = "espada, escudo, poção"
print("espada" in inventario)
```

O heroi possui espada?

✔ Resultado:

 ✅ True

# 🏰 **Missões (Exercícios RPG)**

# 🧠 Dica do Mestre

👉 Testes lógicos **não tomam decisões ainda**

Eles apenas respondem:

> “Sim ou não?”
> 

## 🥉 Missão 1 — Vida do Herói

Crie:

```
vida=40
```

👉 Verifique se:

- vida é menor que 50

## 🥈 Missão 2 — Classe

Crie:

```
classe="Guerreiro"
```

👉 Verifique se:

- classe é igual a "Mago"

## 🥇 Missão 3 — Nível

Crie:

```
nivel=12
```

👉 Verifique se:

- nível é maior ou igual a 10

## 💎 Missão 4 — Inventário

Crie:

```
inventario="espada, escudo, poção"
```

👉 Verifique se:

- existe "poção"

## 🧱⚔️ **Capítulo 6 — Estruturas de Decisão (`if`, `elif`, `else`)**

### 🧠 O Sistema de Escolhas

No RPG, o Jogo precisa tomar decisões:

- O herói pode entrar na dungeon? 🏰
- Ele morreu? 💀
- Ganhou bonus? 💰

No Python, usamos

- if → Se
- elif → Senão se
- else → Senão

### ⚔️ **`if` — A Primeira Decisão**

### O Julgamento do destino

O **if** executa um codigo somente se a codição for verdadeira.

#### ⚙️ Estrutura

```python
if condição:
	ação
```

O que define o bloco?

**identação (espaço/tab)**

#### 🎮 Exemplo RPG

```python
nivel = 10
if nivel >= 10
	print("🏰O heroi pode entrar na dungeon!")
```

### ⚠️ Regra da identação

```python
vida = 100

if vida > 10:
		print("O heroi esta vido")
		print("Pronto para lutar")
	
print("Fim do turno")
```

Apenas oque esta **identado** pertence ao **if**

### 🔁 **`else` — Caminho Alternativo**

🧠 Se não for isso…

se o **if** for falso, o **else** executa outra ação.

#### ⚙ Estrutura

```python
if condição:
		ação
else: 
		outra ação
```

🎮 Exemplo RPG

```python
vida = 0 

if vida > 0:
		print("O heroi esta vivo")
else:
		print("O horoi morreu")
```

### 🔀 **`elif` — Múltiplas Decisões**

🧠 Caminhos do destino

O **elif** permite testar varias confições

#### ⚙ Estrutura

```python
if condição:
		ação
elif condição:
		ação
else:
		ação
```

#### 🎮 Exemplo RPG

```python
nivel = 18

if nivel < 10:
	print("👾 Área iniciante")
elif nivel >= 18:
	print("🐉 Área avançada")
else:
	print("🐱‍🐉 Área intermediaria")
```

#### Exemplo 1 - Nome do Heroi:

```python
nome = "WaaRsk8"

if nome == "WaaRsk8":
		print("O verdadeiro rei retornou")
else:
		print("Heroi desconhecido")
```

#### Exemplo 2 - Sistema de Rank

```python
nota = int(input("Digite o nivel do heroi:"))

if nota < 30:
		print("Heroi derrotado")
elif nota < 60:
		print("Em Recuperação")
elif nota < 100:
		print("Heroi vitorioso")
else:
		print("lenda Viva!")

```

#### Exemplo 3 — Sistema de Recompensa

```python
meta = 100
vendas = int(input("Quantos monstros derrotados? "))

ifvendas >= 2*meta:
print("Bônus lendário:{}".format(0.2*vendas**)**)
elifvendas >= meta:
print("Bônus:{}".format(0.1*vendas))
else:
print("Sem recompensa")
```

#### Exemplo 4 — Condições compostas

```python
aliados = input("Os aliados chegaram? ")
arma = input("Você tem espada? ")
magia = input("Você tem magia? ")

if aliados == "sim" and (arma == "sim" or magia == "sim"):
print("É possível vencer a batalha!")
else:
print("A batalha será perdida.")
```

#### Exemplo 5 — Interação divertida

```python
dragao = " /\\_/\\\n( o.o )\n > ^ <\n"

print(dragao)
resposta = input("Isso é um dragão ou um pão? ")

if resposta == "dragão":
	print("Correto!")
elif resposta == "pão":
	print("Incorreto!")
else:
	print("Não entendi.")
```

### 🏰 **Missões (Exercícios RPG)**

# ⚠️ Dicas do Mestre

- `if` → testa condição
- `elif` → adiciona mais opções
- `else` → caso padrão
- **Indentação é obrigatória** ⚠️

## 🥉 Missão 1 — Vida do Herói

Crie:

```
vida= int(input("quanto de vida? "))

if vida > 0:
	print("Heroi vivo")
else: 
	print("Heroi morto")
```

👉 Se vida > 0 → “Herói vivo”

👉 Senão → “Herói morreu”

## 🥈 Missão 2 — Classe

Peça ao jogador:

- Classe

👉 Se for “mago” → mensagem especial

👉 Senão → mensagem padrão

- Resolução:
    
    ```python
    classe = input("""Escolha a classe do herói: 
                   1. Guerreiro
                   2. Mago
                   3. Arqueiro """)
    
    if classe == "1":
        print("Você escolheu a classe Guerreiro!")
    elif classe == "2":
        print("Você escolheu a classe Mago!")
    elif classe == "3":
        print("Você escolheu a classe Arqueiro!")
    else:
        print("Classe inválida. Por favor, escolha entre Guerreiro, Mago ou Arqueiro.")
    ```
    

## 🥇 Missão 3 — Nível da Dungeon

Peça:

- nível

👉 < 10 → iniciante

👉 >= 10 → avançado

- Resolução
    
    ```python
    classe = input("""Escolha a classe do herói: 
                   1. Guerreiro
                   2. Mago
                   3. Arqueiro """)
    
    if classe == "1":
        print("Você escolheu a classe Guerreiro!")
    elif classe == "2":
        print("Você escolheu a classe Mago!")
    elif classe == "3":
        print("Você escolheu a classe Arqueiro!")
    else:
        print("Classe inválida. Por favor, escolha entre Guerreiro, Mago ou Arqueiro.")
    
    nivel = int(input("Digite o nível do seu herói (1-100): "))
    
    if nivel < 10:
        print(f"Nivel: {nivel}")
        print("Iniciante")
        print("voce pode entrar em dungeons de nivel 1-10")
    elif nivel >= 10 and nivel < 50:
        print(f"Nivel: {nivel}")
        print("Intermediário")
        print("voce pode entrar em dungeons de nivel 0-50")
    elif nivel >= 50 and nivel < 100:
        print(f"Nivel: {nivel}")
        print("Avançado")
        print("voce pode entrar em dungeons de nivel 0-100")
    elif nivel == 100:
        print(f"Nivel: {nivel}")
        print("Lendário")
        print("voce pode entrar em dungeons de nivel 0-100")
    else:
        print("Nível inválido. Por favor, digite um número entre 1 e 100.")
    
    ```
    

## 💎 Missão 4 — Sistema Completo

Peça:

- vida
- mana

👉 Se vida <= 0 → morreu

👉 Senão se mana > 50 → pode usar magia

👉 Senão → ataque básico

- Resolução:
    
    ```python
    classe = input("""Escolha a classe do herói: 
                   1. Guerreiro
                   2. Mago
                   3. Arqueiro """)
    
    if classe == "1":
        print("Você escolheu a classe Guerreiro!")
    elif classe == "2":
        print("Você escolheu a classe Mago!")
    elif classe == "3":
        print("Você escolheu a classe Arqueiro!")
    else:
        print("Classe inválida. Por favor, escolha entre Guerreiro, Mago ou Arqueiro.")
    
    nivel = int(input("Digite o nível do seu herói (1-100): "))
    
    if nivel < 10:
        print(f"Nivel: {nivel}")
        print("Iniciante")
        print("voce pode entrar em dungeons de nivel 1-10")
    elif nivel >= 10 and nivel < 50:
        print(f"Nivel: {nivel}")
        print("Intermediário")
        print("voce pode entrar em dungeons de nivel 0-50")
    elif nivel >= 50 and nivel < 100:
        print(f"Nivel: {nivel}")
        print("Avançado")
        print("voce pode entrar em dungeons de nivel 0-100")
    elif nivel == 100:
        print(f"Nivel: {nivel}")
        print("Lendário")
        print("voce pode entrar em dungeons de nivel 0-100")
    else:
        print("Nível inválido. Por favor, digite um número entre 1 e 100.")
    
    vida = float(input("Digite a vida do seu herói: "))
    mana = float(input("Digite o mana do seu herói: "))
                 
    if vida > 0 and mana > 0:
        print("O herói está vivo e com mana disponível.")
        print(f"Vida {vida:.2f} | Mana {mana:.2f}")
        if mana > 50:
            print("O herói tem muita mana e pode usar magia!")
        elif mana > 10 and mana <= 50:
            print("O heroi tem pouca mana e deve usá-la com sabedoria.")
    elif vida > 0 and mana <= 0:
        print("O herói está vivo, mas sem mana.")
        print(f"Vida {vida:.2f} | Mana {mana:.2f}")  
    elif vida <= 0:
        print("O herói está morto")
        print(f"Vida {vida:.2f} | Mana {mana:.2f3}")
    else:
        print("Valores inválidos para vida ou mana.")
    ```
    

## Exercícios Progressivos

- Extras:
    
    1 Pergunte a escola que um aluno estuda. Se a escola for SENAI, responda Bem vindo ao senai! Se não, responda “Você deveria conhecer a escola senai!”
    
    2 Você está numa creche, a partir da idade da criança informada, responda:
    
    4 anos: ‘A criança deve ser levada para a Sala A’
    
    5 anos: ‘A criança deve ser levada para a Sala B’
    
    6 anos: ‘A criança deve ser levada para a sala C’
    
    3 A partir do exercício anterior, pergunte também o nome da criança, e imprima:
    
    ‘A criança {nome} deve ser levada para a sala X’
    

**0.** Verifique se um aluno pode fazer curso técnico no senai (idade mínima 16 anos).

Desafio: Utilize somente if, não else, e informe, também, caso ele NÃO possa fazer o curso.

Exemplo: “O aluno <nome> pode se matricular no curso técnico do senai”

Ou

“O aluno <nome> não pode se matricular no curso técnico do senai”

*Dados: Perguntar ao usuário.*

- Resolução:
    
    ```python
    nome = input("Digite o nome: ").capitalize()
    idade = input("Digite a idade: ")
    idade = int(idade)
    if idade >= 16:
        print(f"{nome} você tem {idade} anos e pode fazer o curso no Senai")
    if idade < 16:
        print(f"{nome} você tem {idade} anos e não pode fazer o curso no Senai")
    ```
    

**1.** Crie um programa que, pergunte a nota de um aluno e verifique se ele passou na nota de corte (acima de 50)

*Dados: Perguntar ao usuário.*

- Resolução:
    
    ```python
    nome = input("Digite o nome: ").capitalize()
    if nome.isalpha():
      print(f"Olá {nome} seja bem-vindo(a)!")
      n1 =  input("Digite a 1ª nota: (0 a 10) ")
      n2 = input("Digite a 2ª nota: (0 a 10) ")
      n3 = input("Digite a 3ª nota: (0 a 10) ")
      n4 = input("Digite a 4ª nota: (0 a 10) ")
      print(f"{n1} + {n2} + {n3} + {n4} / 45")
      nota = (int(n1) + int(n2) + int(n3) + int(n4)) / 4
    
      if nota >= 5:
        print(f"{nome} Sua nota é {nota} e você foi aprovado")
      if nota < 5:
        print(f"{nome} Sua nota é {nota} e você foi reprovado")
    else:
      print("Digite um nome válido! e apenas letras!")
    
    ```
    

---

**2.** Pergunte o salário de um funcionário qualquer e verifique se ele paga imposto de renda

- *Dados:*
    
    
    | Salário (R$) | Alíquota | Dedução |
    | --- | --- | --- |
    | Até 2.428,80 | Isento (0%) | 0 |
    | 2.428,81 até 2.826,65 | 7,5% | 182,16 |
    | 2.826,66 até 3.751,05 | 15% | 394,16 |
    | 3.751,06 até 4.664,68 | 22,5% | 675,49 |
    | Acima de 4.664,68 | 27,5% | 908,73 |
- Resolução:
    
    ```python
    nome = input("Digite o nome: ").capitalize()
    if nome.isalpha():
      print(f"Olá {nome} seja bem-vindo(a)!")
      salario = float(input("Digite o salário: "))
      imposto = 0
      if salario < 2428.00:
        print(f"imposto de Renda Insento! {salario*0.0:.2f}")
      elif salario >= 2428.00 and salario < 2826.65:
        print(f"imposto de Renda 7.5%! {salario*0.075:.2f}")
      elif salario >= 2826.65 and salario < 3751.05:
        print(f"imposto de Renda 15%! {salario*0.15:.2f}")
      elif salario >= 3751.05 and salario < 4664.68:
        print(f"imposto de Renda 22.5%! {salario*0.225:.2f}")
      elif salario >= 4664.68:
        print(f"imposto de Renda 27.5%! {salario*0.275:.2f}")
    
    else:
      print("Digite um nome válido! e apenas letras!")
    
    ```
    

---

**3.** Crie um programa que decida se um vendedor irá receber um bônus. Para que o vendedor receba o bônus, é necessário que tanto ele como a sua empresa tenham batido suas respectivas metas e, caso ele consiga dobrar a meta, ele recebe 20% de bônus ao invés dos 10% padrão.

*Dados: A meta de vendas da empresa é de R$ 200.000,00, e a meta de vendas do funcionário é de R$ 15.000,00.*

- Resolução:
    
    ```python
    nome = input("Digite o nome: ").capitalize()
    if nome.isalpha():
      print(f"Olá {nome} seja bem-vindo(a)!")
      metaEmp = 20000.00
      metaFunc = 1500.00
      vendasEmp = float(input("Digite o valor das vendas: "))
      vendasFunc = float(input("Digite o valor das vendas: "))
    
      if vendasEmp >= metaEmp:
        print("A empresa bateu a meta!")
        if vendasFunc >= metaFunc and vendasFunc < (metaFunc * 2):
          print(f"O funcionário bateu a meta! entao recebera o bonus de {vendasFunc * 0.1:.2f} reais")
        elif vendasFunc >= (metaFunc * 2):
          print(f"O funcionário bateu a meta! entao recebera o bonus de {vendasFunc * 0.2:.2f} reais")  
        else:
          print("O funcionário não bateu a meta! entao não recebera o bonus")
    
    else:
      print("Digite um nome válido! e apenas letras!")
    
    ```
    

---

1. Escreva um programa que pergunte a nota de um aluno. Dada as ranges de conceitos, dê as seguintes respostas:

< 20: Reprovado ; < 40 Rec 1 ; < 50 Rec 2 ; ≥ 50 Aprovado.

- Resolução:
    
    ```python
    nome = input("Digite o nome: ").capitalize()
    if nome.isalpha():
      print(f"Olá {nome} seja bem-vindo(a)!")
      n1 =  input("Digite a 1ª nota: (0 a 10) ")
      n2 = input("Digite a 2ª nota: (0 a 10) ")
      n3 = input("Digite a 3ª nota: (0 a 10) ")
      n4 = input("Digite a 4ª nota: (0 a 10) ")
    
      nota = float(float(n1) + float(n2) + float(n3) + float(n4)) / 4
    
      if nota >= 5:
          print(f"{nome} Sua nota é {nota} e você foi aprovado")
      elif nota < 5 and nota > 4:
          print(f"{nome} Sua nota é {nota} e você esta de recuperaçao 2")
      elif nota <= 4 and nota > 2:
        print(f"{nome} Sua nota é {nota} e você esta de recuperaçao 1")
      else: 
        print(f"{nome} Sua nota é {nota} e você foi reprovado")
    
    else:
      print("Digite um nome válido! e apenas letras!")
    ```
    

---

---

**5.** O programa deve: responder se o aluno foi aprovado. Receber os dados de um aluninho que será do senai vila alpina ou do mooca. Se ele for do senai vila alpina, no curso de python ele deve ter pelo menos 60 de nota e 75% de frequência. Se ele for do senai mooca, também do curso de python, ele deve ter a mesma quantidade de presença porém com uma nota de 50 ele já consegue ser aprovado.

*Dados: O curso possui 80 aulas. Input: número de faltas*

- Resolução:
    
    ```python
    nome = input("Digite o nome: ").strip()
    
    horas_curso = int(input("Quantas horas tem o curso? "))
    minutos_curso = horas_curso * 60
    
    print("Observação: se a falta for sábado conte por dois dias")
    
    faltas = int(input("Quantas faltas teve no curso? "))
    
    minutos_por_dia = 220
    minutos_faltados = faltas * minutos_por_dia
    
    frequencia = (minutos_curso - minutos_faltados) / minutos_curso
    
    if nome.replace(" ", "").isalpha():
        print(f"Olá {nome.title()}, seja bem-vindo(a)!")
    
        n1 = float(input("Digite a 1ª nota: "))
        n2 = float(input("Digite a 2ª nota: "))
        n3 = float(input("Digite a 3ª nota: "))
        n4 = float(input("Digite a 4ª nota: "))
    
        nota = (n1 + n2 + n3 + n4) / 4
    
        escola = input("Digite a escola (1 - Vila Alpina / 2 - Mooca): ").strip().lower()
    
        if escola == "1":
            nota_minima = 6
        elif escola == "2":
            nota_minima = 5
        else:
            print("Escola inválida!")
            nota_minima = None
    
        if nota_minima is not None:
    
            if frequencia >= 0.75 and nota >= nota_minima:
                print(f"{nome.title()} - Nota: {nota:.2f} | Frequência: {frequencia:.2%} - APROVADO")
    
            elif frequencia >= 0.50 and frequencia < 0.75 and nota >= nota_minima:
                print(f"{nome.title()} - Nota: {nota:.2f} | Frequência: {frequencia:.2%} - REPOSIÇÃO DE FALTAS NECESSÁRIA")
    
            elif frequencia < 0.50:
                print(f"{nome.title()} - Frequência: {frequencia:.2%} - REPROVADO")
    
            else:
                print(f"{nome.title()} - Nota: {nota:.2f} | Frequência: {frequencia:.2%}- REPROVADO")
    
    else:
        print("Digite um nome válido (apenas letras)")
    ```
    

---

**6.** Faça um programa que retorne o servidor do email do usuário, vocês precisam avisar caso não tenha @ no endereço do email que o usuário deve digitar um e-mail válido.

- Resolução:
    
    ```python
    email = input("Digite seu email: ")
    
    if "@" in email:
        print("Email válido")
    else:
        print("Email inválido")
    ```
    

---

**7.** Imagine que você está numa escola. Diga se o aluno está aprovado se:
a) A nota dele for maior ou igual a 50.
a.a) Faça também para notas superiores a 30, ser possível fazer
uma recuperação.
b) A nota dele for maior ou igual a 50 e a sua frequência
superior a 75% da quantidade de horas de curso
c) A nota dele for superior a 70 (caso seja inferior a 30
assuma que ele está reprovado, entre 30 e 50 está de recuperação
e acima de 50 até 70 está de exame). E também, se for da escola
HRC ele precisa ter 50% de frequência. Se for de outra escola, 40%.
Nome ,  Nota  ,  Quantidade de horas do curso (h)   ,   Faltas (h)

- Resolução:
    
    ```python
    nome = input("Digite o nome: ").strip()
    
    horas_curso = int(input("Quantas horas tem o curso? "))
    minutos_curso = horas_curso * 60
    
    print("Observação: se a falta for sábado conte por dois dias")
    
    faltas = int(input("Quantas faltas teve no curso? "))
    
    minutos_por_dia = 220
    minutos_faltados = faltas * minutos_por_dia
    
    frequencia = (minutos_curso - minutos_faltados) / minutos_curso
    
    if nome.replace(" ", "").isalpha():
        print(f"Olá {nome.title()}, seja bem-vindo(a)!")
    
        n1 = float(input("Digite a 1ª nota: "))
        n2 = float(input("Digite a 2ª nota: "))
        n3 = float(input("Digite a 3ª nota: "))
        n4 = float(input("Digite a 4ª nota: "))
    
        nota = (n1 + n2 + n3 + n4) / 4
    
        escola = input("Digite a escola (1 - Vila Alpina / 2 - Mooca): ").strip().lower()
    
        if escola == "1":
            nota_minima = 6
        elif escola == "2":
            nota_minima = 5
        else:
            print("Escola inválida!")
            nota_minima = None
    
        if nota_minima is not None:
    
            if frequencia >= 0.75 and nota >= nota_minima:
                print(f"{nome.title()} - Nota: {nota:.2f} | Frequência: {frequencia:.2%} - APROVADO")
    
            elif frequencia >= 0.50 and frequencia < 0.75 and nota >= nota_minima:
                print(f"{nome.title()} - Nota: {nota:.2f} | Frequência: {frequencia:.2%} - REPOSIÇÃO DE FALTAS NECESSÁRIA")
    
            elif frequencia < 0.50:
                print(f"{nome.title()} - Frequência: {frequencia:.2%} - REPROVADO")
    
            else:
                print(f"{nome.title()} - Nota: {nota:.2f} | Frequência: {frequencia:.2%}- REPROVADO")
    
    else:
        print("Digite um nome válido (apenas letras)")
    ```
    

---

**8.** A partir de três números informados pelo usuário, informe a ordem crescente deles utilizando somente estruturas de condição.

- Resolução:
    
    ```java
    n1 = float(input("Digite o primeiro número: "))
    n2 = float(input("Digite o segundo número: "))
    n3 = float(input("Digite o terceiro número: "))
    
    if n1 > n2 and n1 > n3:
        print(f"O 1º numero é o maior número: {n1}")
    elif n2 > n1 and n2 > n3:
        print(f"O 2º numero é o maior número: {n2}")
    else:
        print(f"O 3º numero é o maior número: {n3}")
    ```
    

## 🧱⚔️ **Capítulo 7 — Indentação (Estrutura do Código)**

### 🏰 O que é Indentação?

No mundo do RPG, cada ação acontece dentro de um contexto:

- Detro de uma batalha ⚔
- Dentro de uma dungeon 🏰
- Dentro de uma decisão 🤔

No python , usamos **identação** para definir isso.

#### 🧠 Definição

**Indentação** é o espaço no inicio da linha que indica:

Quais comandos pertencem a um bloco

#### ⚙️ Regra do Python

Diferente de outras linguagens:

- ❌ Não usa { }
- ✅ Usa **espaços (indenteção)**

Padrão

- 1 nivel = **4 espaços (ou TAB)**

#### 🎮 Exemplo RPG

```python
if True:
		print("⚔️ O heroi atacou")
print("📜 Turno encerrado")

```

#### 🎮 Resultado

⚔️ O herói atacou!

📜 Turno encerrado

#### 🧠 Interpretação

- O ataque esta **dentro do if**
- O fim do turno esta **fora do if**

#### ❌ Quando a condição é falsa

```python
if False:
    print("⚔️ O herói atacou!")
print("📜 Turno encerrado")
```

#### 🎮 Resultado

📜 Turno encerrado

#### 🧠 Interpretação

👉 O código dentro do **if foi ignorado.**

### ⚠️ Regra mais importante do Python

Indentação errada = erro no programa

### ❌ Exemplo errado

```python
if True:
print("Erro") 
#Isso causa erro porque não tem indentação
```

Isso causa erro porque **não tem indentação.**

**✔️ Correto.**
 

```python
if True:
    print("Funciona!")
    #Isso esta certo porque **tem indentação.**
```

Isso esta certo porque **tem indentação.**

### 🧱 Blocos dentro de blocos.

Você pode ter estruturas dentro de estruturas.

### 🎮 Exemplo RPG

```python
vida = 100

if vida > 0:
		print("Heroi vivo")
		
		if vida > 50:
				print("vida alta")
```

#### 🎮 Resultado

💚 Herói vivo

🔥 Vida alta

### 🧠 Interpretação

- Segundo, **if** está dentro do primeiro.
- Só roda se o primeiro for verdadeiro.

### 🏰 **Missões (Exercícios RPG)**

# ⚠️ Dicas do Mestre

- Indentação define TUDO no Python
- Sempre use padrão de 4 espaços
- Use TAB para facilitar
- Código mal indentado = erro 💀

## 🥉 Missão 1 — Ataque

Crie:

```python
if True:
```

👉 Mostre:

- “Herói atacou”
    
    ```
    if True:
    	print("O Heroi atacou")
    print("Turno encerrado!")
    ```
    

## 🥈 Missão 2 — Vida

Crie:

👉 Se vida > 0:

- “Herói vivo”

👉 Fora do if:

- “Fim do turno”
    
    ```
    vida = 0
    
    if vida > 0:
    	print("Heroi vivo!")
    print("fim do Turno!")
    ```
    

## 🥇 Missão 3 — Vida avançada

Crie:

- vida = 80

👉 Se vida > 0:

- Mostrar “vivo”

👉 Dentro disso:

- Se vida > 50 → “vida alta”

```python
vida = float(input("Quanto tem de vida?"))

if vida > 0:
	print("Heroi vivo")
elif vida > 50:
	print("Heroi com vida Alta")
```

## 💎 Missão 4 — Dungeon

Crie:

- nivel = 15

👉 Se nivel >= 10:

- Mostrar “Entrou na dungeon”

👉 Dentro:

- Se nivel >= 15:
    - “Área avançada”

```python
nivel = int(input("Qual seu nivel: ")

if nivel >= 10:
	print("Entrou na dungeon")
	if nivel >= 15:
		print("Area Avançada")
else:
	print("Não pode entrar na dungeon")
```

## 🧱⚔️ **Capítulo 8 — `match`/`case` (Escolhas do Destino)**

### 🧠 O que é `match`?

Em um RPG, o jogador pode fazer varias escolhas:

- Escolher classe 🧙‍♂️🐱‍👤
- Escolher caminho 🛤
- Escolher ação ⚔

Quando exsitem **muitas opções**, usamos varios if fica confuso.

Para iso usamos:

**match + case**

### Interpretação

- **match →** Analisa uma variável.
- case → defina cada possibilidade.

#### ⚙️ Estrutura

```python
match variavel:
	case valor:
			ação
	case valor:
			ação
	case _:
			ação padrão
```

#### 🎮 Exemplo RPG — Escolha de Classe

```python
classe = input("escolha sua classe (guerreiro, mago, arqueiro): ")

match classe:
	case "guerreiro":
			print("⚔ Você escolheu o Guerreiro!")
	case "mago":
			print("🔮 Você escolhei o Mago!")
	case "arqueiro":
			print("🏹 Você escolheu o Arqueiro!")
	case _:
			print("❌ Classe invalida!")
```

🧠 `case _` (O Caminho Desconhecido)

Funciona como o **else**

✔ Executa quando nenhuma opção for verdadeira.

### 🎮 Exemplo RPG — Portal da Dungeon

```python
portal = input("Escolha um portal (1, 2 ou 3): ")

match portal:
		case "1":
				print("🔥 Você entrou no reino de fogo")
		case "2":
				print("❄️ Você entrou no reino de gelo")
		case "3":
				print("🌪️ Você entrou no reino do vento")
		case _:
				print("💀 Portal desconhecido...")
```

### 🗓️ Exemplo adaptado (Dia da semana → RPG)

```python
dia=input("Escolha um dia sagrado (1 a 7): ")

matchdia:
	case"1":
			print("☀️ Dia do Sol (Domingo)")
	case"2":
			print("🌙 Dia da Lua (Segunda)")
	case"3":
			print("🔥 Dia do Fogo (Terça)")
	case"4":
			print("💨 Dia do Vento (Quarta)")
	case"5":
			print("🌿 Dia da Natureza (Quinta)")
	case"6":
			print("⚔️ Dia da Batalha (Sexta)")
	case"7":
			print("👑 Dia do Rei (Sábado)")
	case _:
		print("❌ Escolha inválida!")
```

### ⚔️ Quando usar `match`?

Use quando tiver:

- muitas opçoes fixas
- Comparação com valores exatos
- Menus de escolhas

### ⚠️ Quando NÃO usar

Evite usar **match** quando:

- Precisa de comparações (>, <, etc.)
- condiçoes complexas

Nesse caso, use **if**

### 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Escolha de Arma

Peça:

- arma

Opções:

- espada ⚔️
- arco 🏹
- cajado 🔮

```python
print("""
	1 - Espada
	2 - Arco e flecha
	3 - Cajado mágico
      """)
      
arma = input("Digite o nome da arma: ")

match arma:
    case "1":
        print("Você escolheu a espada!")
    case "2":
        print("Voce escolheu o arco e flecha!")
    case "3":
        print("Voce escolheu o cajado mágico!")
    case _:
        print("Opção inválida!")
```

## 🥈 Missão 2 — Escolha de Caminho

Peça:

- caminho (1, 2, 3)

Mostre:

- destinos diferentes

```python
print("""
	1 - Castelo de Varrock
	2 - Castelo de Faladore
	3 - Castelo de lumbridge
      """)

arma = input("Digite a opção para onde quer seguir: ")

match arma:
    case "1":
        print("Você escolheu o caminho do Castelo de Varrock!")
    case "2":
        print("Você escolheu o caminho do Castelo de Faladore!")
    case "3":
        print("Você escolheu o caminho do Castelo de Lumbridge!")
    case _:
        print("Opção inválida!")
```

## 🥇 Missão 3 — Classe do Herói

Peça:

- classe

Mostre habilidades diferentes para cada uma

```python
print("""
1 - Guerreiro
2 - Arqueiro
3 - Mago
      """)

arma = input("Digite qual classe voce quer: ")

match arma:
    case "1":
        print("Você escolheu a Guerreiro!")
        print("A arma do Guerreiro é a Espada!")
        print("O Guerreiro é forte e resistente, ideal para combates corpo a corpo.")
    case "2":
        print("Você escolheu o Arqueiro!")
        print("A arma do Arqueiro é o Arco e Flecha!")
        print("O Arqueiro é ágil e preciso, ideal para ataques à distância.")
    case "3":
        print("Você escolheu o Mago!")
        print("A arma do Mago é o Cajado Mágico!")
        print("O Mago é poderoso e versátil, ideal para magias de alto nível.")

```

## 💎 Missão 4 — Sistema de Ação

Peça:

- ação do jogador

Opções:

- atacar
- defender
- fugir

👉 Mostre o resultado de cada ação

```python
print("""
1 - Atacar
2 - Defender
3 - Fugir
      """)

arma = input("Digite o quer fazer: ")

match arma:
    case "1":
        print("Você escolheu Atacar!")
        print("voce atacou com a espada, causando 10 de dano!")
        
    case "2":
        print("Você escolheu Defender!")
        print("Você se defendeu com o escudo, reduzindo o dano pela metade!")
    case "3":
        print("Você escolheu Fugir!")
        print("Você correu para longe, salvando sua vida!")
```

# 🧠 Dicas do Mestre

- `match` deixa o código mais limpo
- `case _` é o “plano B”
- Ideal para menus e escolhas

## 🧱⚔️ **Capítulo 9 — Operador `in` (Busca no Mundo)**

### 🧠 O que é `in`?

No RPG, o heroi precisa verificar coisas como:

- Tem uma espada no inventario? 🎒
- O nome contem uma palavra especial? 📜
- Existe um item escondido? 🔍

Para isso usamos o operador:

🔍 **in**

### 📌 Definição

O **in** verifica se um valor está **dentro de outro.**

#### Resultado:

- ✅ True (está dentro)
- ❌ False (não está)

### ⚙️ Estrutura

```python
valor in conjunto
```

### ⚙️ Estrutura

```python
if "oito" in "Biscoito":
	print("8!")
```

#### 🎮 Interpretação

A palava “oito” esta dentro de “Biscoito”?

✅ Sim → resultado verdadeiro.

### 🎮 Exemplo RPG

```python
inventario = "espada, escudo, poção"

if "espada" in inventario:
    print("O herói pode atacar!")
```

### 🧪 Mais exemplos.

```python
print("a" in "WaaRsk8") #True
print("z" in "WaaRsk8") #False
```

### 🎮 Exemplo RPG

```python
nome="WaaRsk8"

if "sk8" in nome:
print("Nome raro detectado!")
```

### ⚠️ Atenção (Case Sensitive)

```python
print("a" in "WaaRsk8") #True
print("A" in "WaaRsk8") #True
print("a" in "WAARSK8") #False
```

Letras maiúsculas e minúsculas fazem diferença ⚠️

### 🎮 Exemplo RPG

```python
item="Espada"

if"espada"initem:
print("⚔️ Encontrado!")
```

❌ Não funciona por causa da diferença de letras.

### ✔️ Solução comum.

```python
item="Espada"

if"espada" in item.lower():
print("Encontrado!")
```

### 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Inventário

Crie:

```
inventario="espada, escudo, poção"
```

👉 Verifique se:

- existe "pocao"

```python
inventario = "espada, escudo, pocao"

procurar = input("Digite o item que deseja procurar: ").lower()

if procurar in inventario:
    print(f"Item '{procurar.capitalize()}' encontrado!")
```

## 🥈 Missão 2 — Nome do Herói

Crie:

```
nome="WaaRsk8"
```

👉 Verifique se:

- contém "waar"

```python
nome = "WaaRsk8".lower()

procurar = input("Digite o que deseja procurar: ").lower()

if procurar in nome:
    print(f"O nome contém {procurar}")
```

## 🥇 Missão 3 — Item raro

Peça:

- nome de um item

👉 Se tiver "lendário" → mensagem especial

```python
inventario = ["espada lendaria", "escudo de ferro", "poção de cura", "arco lendario"]
items_lendarios = []
if "lendario" in inventario[0] or "lendaria" in inventario[0]:
    print(inventario[0])
    items_lendarios.append(inventario[0])

if "lendario" in inventario[1] or "lendaria" in inventario[1]:
    print(inventario[1])
    items_lendarios.append(inventario[1])

if "lendario" in inventario[2]:
    print(inventario[2])
    items_lendarios.append(inventario[2])

if "lendario" in inventario[3] or "lendaria" in inventario[3]:
    print(inventario[3])
    items_lendarios.append(inventario[3])

print("Itens lendarios encontrados:", items_lendarios)

```

## 💎 Missão 4 — Sistema de busca

Crie:

- inventário com lista

👉 Verifique:

- espada
- escudo
- poção
- Informe:
    - “Voce tem os itens necessarios.“
    - “Voce pode enfrentar o dragão!”

```python
inventario = ["espada", "escudo de ferro", "poção de cura", "arco", "flechas", "elmo de aço", "capa de invisibilidade lendária", "anel lendário"]

if "espada" in inventario and "escudo" in inventario and "poção" in inventario:
    print("Voce tem os itens necessarios.")
    print("Voce pode enfrentar o dragão!")
```

#### ⚠️ Dicas do Mestre

- `in` → verifica existência
- Funciona com:
    - strings
    - listas
- É case sensitive ⚠️
- Muito usado com `if`

# 🧱📜 **Nível 3 — Strings (Linguagem do Mundo)**

## 📘 **Capítulo 10 — Strings (Textos do RPG)**

### 🧠 Introdução — A Linguagem do Reino

Em um RPG, tudo é texto:

- 📜 Dialogos
- 🧙‍♂️ Feitiços
- 🏰 Descrições
- 🎮 Mensagens do jogo

No **Python,**  esse texto são chamados de:

🌟 **String (str)**

### 📌 Definição:

Strings são textos

Características importantes:

**Strings “nao pensam”**

Isso significa:

- ❌ Não fazem calculos
- ❌ Não somam numeros
- ✅ Apenas armazenam textos

### 🎮 Exemplo RPG

```python
nome = "WaaRsk8"
mensagem = "Bem-vindo a dungeon!"

print(nome)
print(mensagem)
```

### 🧙‍♂️ Caracteres de Escape (Magias de Texto)

Quebra de linha **(\n)**

permite dividir o texto em varias linhas.

## 🎮 Exemplo RPG

```python
print("⚔️ O herói entrou na dungeon.\n👹 Um monstro apareceu!")
```

## 🎮 Saída

⚔️ O herói entrou na dungeon.
👹 Um monstro apareceu!

## 🧠 Outros usos comuns

| Código | Função |
| --- | --- |
| `\n` | Nova linha |
| `\t` | Tabulação |
| `\\` | Barra invertida |

## 🎮 Exemplo RPG

```python
print("⚔️\tHerói\tVS\tDragão")
```

### 🧩 Strings são Iteráveis (Segredo do Texto)

### O que significa?

Uma string não é uma coisa só

Ela é formado por varios caracteres

Exemplo:

```python
nome = "WaaRsk8"
```

internamente

```python
W a a R s k 8
```

#### 🎮 Exemplo RPG

```python
nome = "Arthas"
print(nome[0])  # W
print(nome[1])  # a
print(nome[2])  # a
```

## 🧠 Interpretação

👉 Cada letra é um elemento separado.

## ⚠️ Atenção (Índice começa em 0)

| Letra | Índice |
| --- | --- |
| W | 0 |
| a | 1 |
| a | 2 |
| R | 3 |
| S | 4 |
| k | 5 |
| 8 | 6 |

## 🎮 Exemplo RPG

```python
nome="WaaRsk8"

print(nome[0]) #primeira letra (W)
print(nome[6]) #última letra (8)
```

### 🏰 **Missões (Exercícios RPG)**

### ⚠️ Dicas do Mestre

- Strings são textos 📜
- São **imutáveis** (não mudam diretamente)
- São **iteráveis** (podem ser percorridas)
- Índices começam em **0**

## 🥉 Missão 1 — Nome do Herói

Crie:

```
nome = "WaaRsk8"
```

👉 Mostre:

- Nome completo
- Primeira letra
- Resolução:
    
    ```python
    nome = "WaaRsk8"
    
    print(f"Olá, {nome}!")
    print(nome[0])
    print(nome[1])
    print(nome[2])
    print(nome[3])
    print(nome[4])
    print(nome[5])
    print(nome[6])
    ```
    

## 🥈 Missão 2 — Mensagem de batalha

Mostre:

👉 Duas linhas: (usando `\n`)

- Herói entrou
- Monstro apareceu
- Resolução:
    
    ```python
    nome = input("Digite o nome do personagem: ")
    monstro = input("Digite o nome do monstro: ")
    
    print(f"Nome: {nome} \nMonstro: {monstro}!")
    ```
    

## 🥇 Missão 3 — Inspeção de nome

Crie:

```
nome = "WaaRsk8"
```

👉 Mostre:

- Primeira letra
- Terceira letra
- Resolução:
    
    ```python
    
    nome = input("Digite o nome do personagem: ")
    
    print(nome[0])
    print(nome[3])
    ```
    

## 💎 Missão 4 — Nome secreto

Peça:

- nome do jogador

👉 Mostre:

- primeira letra
- última letra
- Resolução:
    
    ```python
    nome = input("Digite o nome do personagem: ")
    
    print(f"Primeira letra: {nome[0]}")
    print(f"Última letra: {nome[-1]}")
    ```
    

## 🧱📜 **Capítulo 11 — `len()` (Medida do Texto)**

### 🧠 O que é `len()`?

No mundo do RPG, as vezes precisamos medis coisas:

- 📏 Tamanho de um nome
- 📜 Quantidade de letras de um feitiço
- 🔐 Tamanho de uma senha mágica

No Python, usamos **len( )**

#### 📌 Definição

A função **len( )** retorna:

a quantidade de caracteres de uma string

⚙ **Sintaxe**

```python
len(texto)
```

#### 🎮Exemplo básico

```python
a = len("Paralelepípedo")
print(a)
```

📌 Resultado:

14

#### 🎮 Exemplo simples

```python
print(len("Renan"))
```

📌 Resultado

5

#### 🎮 Exemplo RPG

```python
nome = "WaaRsk8"

print(len(nome))
```

Quantas letras tem o nome do heroi?

### 🧠 Interpretação

```
"WaaRsk8" → 7 letras
```

✔ Resultado:

7

### ⚔️ Usando com variáveis.

```python
nome = input("Digite o nome do herói: ")
tamanho = len(nome)

print("O nome possui {} letras".format(tamanho))
```

## 🎮 Exemplo RPG

```
feitiço="Bola de Fogo"

print(len(feitiço))
```

Conta espaços também. ⚠️

#### ⚠️ Atenção importante

```python
print(len("Bola de Fogo"))
```

👉 Resultado:

12

📌 Porque:

- Conta letras
- Conta espaços.

### 🧩 Aplicação prática (RPG)

#### 🔐 Validação de nome

```python
nome = input("Digite o nome do herói: ")

if len(nome) < 3:
		print("Nome muito curto!")
else:
		print("Nome válido!")
```

### 🎮 Sistema de nome épico

```python
nome = input("Nome do herói: ")

if len(nome) >= 10:
		print(" Nome lendário!")
else:
		print("Nome comum")
```

### 🏰 **Missões (Exercícios RPG)**

### ⚠️ Dicas do Mestre

- `len()` conta tudo:
    - letras
    - espaços
    - símbolos
- Funciona em:
    - strings
    - listas
- Muito usado em validações

## 🥉 Missão 1 — Contar letras

Crie:

```
nome="WaaRsk8"
```

👉 Mostre o tamanho do nome

- Resolução:
    
    ```python
    nome = input("Digite seu nome: ")
    
    print(len(nome))
    ```
    

## 🥈 Missão 2 — Nome do jogador

Peça:

- nome

👉 Mostre:

- quantidade de letras
- Resolução:
    
    ```python
    nome = input("Digite seu nome: ")
    
    print("Olá, " + nome + "!")
    print(f"Seu nome tem {len(nome)} caracteres.")
    ```
    

## 🥇 Missão 3 — Nome válido

👉 Se nome tiver menos de 5 letras:

- “Nome fraco”

👉 Senão:

- “Nome poderoso”
- Resolução:
    
    ```python
    nome = input("Digite seu nome: ").capitalize()
    
    print("Olá, " + nome + "!")
    
    if len(nome) < 5:
        print("Seu nome é fraco.")
    elif len(nome) <= 10:
        print("Seu nome é médio.")
    else:
        print("Seu nome é forte.")
    
    ```
    

## 💎 Missão 4 — Feitiço

Crie:

```
feitiço = "Relâmpago Supremo"
```

👉 Mostre:

- quantidade de caracteres
- Resolução:
    
    ```python
    feitiço = "Relampago Supremo"
    
    print(f"O feitiço é: {feitiço}")
    print(f"O feitiço tem {len(feitiço)} caracteres.")
    ```
    

## 🧱📜 **Capítulo 12 — Métodos de String (Magias do Texto)**

### 🧙‍♂️ O que são métodos de string?

No mundo do RPG, existem magias que alteram textos:

- tranforma letras. 🔠
- Organizar frases 📜
- inserir informações automaticamente 🧠

No python, essas magias são chamadas de:

#### Métodos de String

### 📌 Definição:

um método de string é uma função que só **funciona em textos (strings).**

⚙ Sintaxe (forma de uso)

```python
"texto".metodo()
```

📌 Leitura:

👉 **string → ponto → método → ()**

## 🎮 Exemplo RPG

```python
print("WaaRsk8".upper())
```

Transforma o nome do heroi em maiúsculo

### Método **.format() (Magia de Inserção)**

### 🧠 O que ele faz?

Permite colocar valores dentro de um texto **sem usar +**

### ⚙ Sintaxe

```python
"texto {}".format(valor)
```

## 🎮 Exemplo básico

```python
nome="WaaRsk8"
print("Olá {}".format(nome))
```

## 🎮 Exemplo RPG

```python
nome = input("Nome do herói: ")
nivel = input("Nível do herói: ")

print("O herói {} está no nível {}".format(nome, nivel))
```

### 🧠 Como funciona?

```python
"Olá {} você tem {} anos".format(nome,idade)
```

👉 As `{}` são substituídas na ordem:

1️⃣ Primeiro valor → primeira `{}`

2️⃣ Segundo valor → segunda `{}`

### 🎮 Exemplo RPG

```python
nome = "WaaRsk8"
classe = "Guerreiro"
nivel = 90

print("O herói {} é um {} de nível {}".format(nome,classe,nivel))
```

### ⚠️ Atenção

- A quantidade de `{}` deve bater com os valores.
- A ordem importa.

### ❌ Exemplo errado.

```python
print("Olá {}".format(nome,idade)) #sobra valor dentro do .format()
```

### 🆚 `.format()` vs f-string

Você já viu f-string:

```python
print(f"Olá {nome}")
```

📌 Comparação:

| Método | Forma | Uso |
| --- | --- | --- |
| `.format()` | `"{}".format()` | Mais antigo |
| `f-string` | `f"{var}"` | Mais moderno. 🔥 |

## 🎮 Exemplo RPG (comparação)

```python
nome = "WaaRsk8"

# .format()
print("Herói: {}".format(nome))

# f-string
print(f"Herói:{nome}")
```

### 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Saudação

Crie:

- nome do herói

👉 Mostre usando `.format()`

- Resoulução:
    
    ```python
    nome = input("Qual seu nome? ")
    
    print("Nome: {}".format(nome)
    ```
    

## 🥈 Missão 2 — Ficha

Crie:

- nome
- classe
- nível

👉 Mostre tudo com `.format()`

- Resolução:
    
    ```python
    from random import randint
    
    nome = input("Qual o nome do heroi: ")
    classe = input("""
    1 - Guerreiro \n
    2 - Mago \n
    3- Arqueiro
    		""")
    
    if classe == "1":
      print("O guerreiro é forte e resistente, especializado em combate corpo a corpo.")
      classe = "guerreiro"
    elif classe == "2":
      print("O mago é poderoso e versátil, especializado em magia.")
      classe = "mago"
    elif classe == "3":
      print("O arqueiro é preciso e ágil, especializado em ataque à distância.")
      classe = "arqueiro"
    else:
      print("Classe inválida.")
    
    nivel = randint(1, 100)
    
    print("Nome: {}".format(nome))
    print("Classe: {}".format(classe))
    print("Nível: {}".format(nivel))
    
    	
    ```
    

## 🥇 Missão 3 — Narrativa

Mostre:

👉 “O herói X entrou na dungeon e enfrentou um Y”

```python
nome = input("Digite seu nome: ")
monstro = input("Digite o nome do monstro: ")

print("O heroi {} entrou na dungeon e enfrentará o {}".format(nome, monstro))
```

## 💎 Missão 4 — Sistema completo

Peça:

- nome
- vida
- mana

👉 Mostre:

- ficha completa usando `.format()`

```python
nome = input("Digite seu nome: ")
vida = int(input("Digite sua vida: "))
mana = int(input("Digite sua mana: "))

print("Nome: {} \nVida: {} \nMana: {}".format(nome, vida, mana))

```

### ⚠️ Dicas do Mestre

- Métodos usam `.`
- Só funcionam em strings
- `.format()` evita concatenação
- Hoje usamos mais **f-string**, mas `.format()` ainda é importante

## 🧱📜 **Capítulo 13 — Métodos de String (Magias Avançadas)**

## 🧙‍♂️ Introdução

No RPG, o texto pode ser manipulado como magia:

- Transformar nomes 🔠
- Procurar palavras 🔍
- Separar informações. 📜
- Validar comandos do jogador 🎮

👉 Para isso usamos **métodos de string**

## ⚙️ Sintaxe

```python
string.metodo()
```

### 🔥 Principais Métodos (Modo RPG)

### 🔠 Transformação de Texto

### 🎮 `.capitalize()` — Nome Inicial

```python
nome="waaRsk8"
print(nome.capitalize())
```

Resultado:

```python
WaaRsk8
```

### 🎮 `.title()` — Nome de Herói

```python
titulo="waaRsk8 o rei guerreiro"
print(titulo.title())
```

Resultado:

```python
WaaRsk8 O Rei Guerreiro
```

### 🎮 `.lower()` — Texto normalizado

```python
	print("WAARSK8".lower())
```

Resultado:

```python
waarsk8
```

### 🎮 `.upper()` — Grito de batalha

```python
print("waarsk8".upper())
```

Resultado:

```python
WAARSK8
```

## 🔍 Busca e Verificação

### 🎮 `.count()` — Contar letras

```python
nome = "WaaRsk8"
print(nome.count("a"))
```

Resultado:

```python
2
```

### 🎮 `.find()` — Encontrar posição

```python
nome="WaaRsk8"
print(nome.find("s"))
```

Resultado:

```python
4
```

### 🎮 `.startswith()` — Começa com

```python
nome="WaaRsk8"
print(nome.startswith("W"))
```

👉 Resultado:

```
True
```

### 🎮 `.endswith()` — Termina com

```python
nome = "8"
print(nome.endswith("8"))
```

Resultado:

```python
True
```

## 🧪 Validação (sistema do jogo)

### 🎮 `.isalpha()` — Só letras

```python
nome="WaaRsk"
print(nome.isalpha())
```

Resultado:

```python
True
```

### 🎮 `.isnumeric()` — Só números

```python
nivel = "100"
print(nivel.isnumeric())
```

Resultado:

```python
True
```

### 🎮 `.isalnum()` — Letras + números

```python
codigo = "WaaRsk8"
print(codigo.isalnum())
```

👉 Resultado:

```python
True
```

## 🔄 Manipulação de Texto

### 🎮 `.replace()` — Transformação mágica

```python
frase="WaaRsk8 é fraco"
print(frase.replace("fraco","lendário")) #troca "fraco" por "lendário"
```

👉 Resultado:

```
WaaRsk8 é lendário
```

### 🎮 `.strip()` — Limpeza de texto

```python
nome="  WaaRsk8  "
print(nome.strip())
```

👉 Resultado:

```python
WaaRsk8
```

## 📦 Separação de Texto

### 🎮 `.split()` — Separar inventário

```python
itens="espada,escudo,poção"
print(itens.split(","))
```

👉 Resultado:

```python
['espada', 'escudo', 'poção']
```

### 🎮 `.splitlines()` — Quebra de linhas

```python
texto="Linha1\nLinha2"
print(texto.splitlines())
```

👉 Resultado:

```python
['Linha1', 'Linha2']
```

### 📜 Tabela de Metodos:

| Método | Funcionalidade | Exemplo + Resultado |
| --- | --- | --- |
| .capitalize( ) | Torna a primeira letra do texto maiúscula | “Linguagem Python”.capitalize()
Linguagem python |
| .title( ) | Torna a primeira letra de cada palavra maiúscula | “linguagem PYTHON”.title()
Linguagem Python |
| .casefold( ) ou
.lower() | Torna todas as letras do texto minúsculas | “Linguagem Python”.lower()
linguagem python |
| .upper( ) | Coloca o texto todo em maiúsculas | “Linguagem Python”.upper()
LINGUAGEM PYTHON |
| .count(’s’) | Conta a quantidade de vezes que aquele caractere - ‘*Substring’* - aparece no texto | “Linguagem Python”.count(”g”)
2 |
| .endswith(‘s’) | Verifica se uma string termina com uma substring | “Linguagem Python”.endswith(”n”)
True |
| .find(‘s’) 
ou 
.find(’s’,n) | Retorna o índice da posição (numérica) da substring, se contida no texto, na primeira vez em que aparece. 
Caso você deseje procurar a partir de uma posição, você pode utilizá-la como segundo argumento.  | “Linguagem Python”.find(”n”)
2
“Linguagem Python”.find(”n”,3)
15.format(variável) |
| .format(objeto) | Formata dentro do texto - este necessita conter { } - as variáveis indicadas | “Linguagem {}”.format(”Python”)
Linguagem Python |
| .isalpha( ) | Verifica se os caracteres da string são todos letras. | “LinguagemPython”.isalpha()
True |
| .isnumeric( ) | Verifica se os caracteres da string são todos números. | “Linguagem Python”.isnumeric()
False |
| .isalnum( ) | Verifica se os caracteres de uma string são todos compostos por letras ou números. | “Linguagem Python”.isalnum()
False |
| .replace(‘s’,‘s’) | Substitui um texto por outro dentro de uma string | “Linguagem Python”.replace(’g’, ‘b’)
Linbuabem Python |
| .split(‘s’) | Separa um texto de acordo com um delimitador em vários outros textos | “Linguagem Python”.split(g)
['Lin', 'ua', 'emPython'] |
| .splitlines( ) | Separa um texto por linhas - enters - em vários outros textos | "Linguagem\nPython".splitlines()
['Linguagem', 'Python'] |
| .startswith(‘s’) | Verifica se o texto começa com uma certa substring | “Linguagem Python”.startswith(”L”)
True |
| .strip() | Remove espaços no início e no fim do texto | “  Linguagem Python  ”.strip()
Linguagem Python |

### Exercícios progressivos.

**1.** Crie um programa em python que verifique se o email do usuário possui um “@”, e caso haja, escreva “Cadastro efetuado com sucesso.” Caso contrário, escreva “Endereço de email inválido”.

- Resolução:
    
    ```python
    email = input('Informe seu email: ')
    if '@' in email:
        print('Cadastro efetuado com sucesso.')
    else:
        print('Endereço de email inválido.')
    ```
    

---

**2.** Usando como base o programa anterior, se houver um “@”, verifique se há um “.” após. Em caso de erro, indique o motivo da falha, e em caso de acerto, escreva “Cadastro efetuado com sucesso”

Desafio: Indique também o domínio do email.  

- Resolução 1:
    
    ```python
    email = input('Informe o email: ')
    if '@' in email:
        pos = email.find('@')
        resto = email[pos+1:]
        if '.' in resto:
            print('Cadastro efetuado com sucesso!')
        else:
            print('Não existe "." após o "@"')
    else:
        print('todo email válido necessita ter um @')
    ```
    
- Resolução 2 (completa):
    
    ```python
    email = input('Informe o email: ')
    if '@' in email:
        pos = email.find('@')
        resto = email[pos+1:]
        if '.' in resto:
            posicaoponto = resto.find('.')
            print('Cadastro efetuado com sucesso. Servidor: {}'.format(resto[i+1:posicaoponto]))
        else:
            print('Não existe "." após o "@"')
    else:
        print('todo email válido necessita ter um @')
    ```
    

**3.** Faça um programa que peça o cadastro de um CPF. O programa deve remover os espaços, pontos e hifens. Se o CPF tiver 11 números após a remoção de pontos e hifens, o CPF deve ser aprovado.

- Resolução:
    
    ```python
    cpf = input('Informe seu cpf:\n').strip().replace('-','').replace('.','')
    
    if cpf.isnumeric():
        if len(cpf) == 11:
            print('O cpf {} Está aprovado!'.format(cpf))
        else:
            print('Informe 11 dígitos.')
    else:
        print('Favor digitar somente números.')
    
    ```
    

**4.** Crie um programa que peça dois inputs a um usuário e imprima o primeiro input todo maiúsculo, o segundo todo minúsculo, e depois ambos com todas as primeiras letras de cada palavra maiúsculas.

- Resolução:
    
    ```python
    n1 = input("Digite o primeiro nome: ").upper()
    n2 = input("Digite o segundo nome: ").lower()
    n3 = input("Digite o terceiro nome: ").capitalize()
    
    print("------------------------")
    print("Nomes digitados:")
    print("1. {}".format(n1))
    print("2. {}".format(n2))
    print("3. {}".format(n3))
    ```
    

**5.** Conte quantas letras “a” tem em um dado input. *Desafio: Não utilize variáveis.*

- Resolução:
    
    ```python
    letra = input('informe uma letra para procurar no nome que sera informado:')
    
    print("existem {} letras {}'".format(input('informe uma palavra:').count(letra), letra))
    ```
    

**6.** Verifique se um email termina com gmail.com. Caso sim, informe “este é um endereço gmail”.

- Resolução:
    
    ```python
    email = input('Informe o email: ')
    if '@' in email:
        pos = email.find('@')
        resto = email[pos+1:]
        if '.' in resto:
            print('Cadastro efetuado com sucesso!')
            if "gmail.com" in email:
    	        print("Esse Email é do Gmail")
            elif "yahoo.com" in email:
              print("Esse Email é do Yahoo")
            elif "outlook.com" in email:
              print("Esse Email é do Outlook")
            else:          print("Esse Email é de outro provedor")
        else:
            print('Não existe "." após o "@"')
            
    else:
        print('todo email válido necessita ter um @')
    ```
    

**7.** Faça um programa que receba um nome completo e idade. Ele deve remover os espaços extras do nome, e todo e qualquer espaço da idade.

Caso a idade informada não seja um número, informe: idade inválida.

Caso contrário, informe: dados válidos

*Desafio: faça com que somente nomes com duas ou mais palavras sejam válidos*

- Resolução:
    
    ```python
    nome = input("Digite seu nome completo: ").replace("   ", " ")
    idade = input("Digite sua idade: ").replace(" ", "")
    
    print("Nome completo: {}".format(nome))
    print("Idade: {}".format(idade))
    ```
    

**8.** Faça um programa que, a partir da frase “Java é legal” salva em uma variável, troque o valor dessa variável para “Java é um pé no saco”, utilizando o método *replace*

- Resolução:
    
    ```python
    frase = "JAva é LEgal".lower()
    print(frase)
    print("trocando frase com replace: ")
    print(frase.replace("java é legal", "java é um pé no saco"))
    ```
    

**9.** Peça uma frase e, utilizando o método *split()*, informe o número de palavras. *Dica: utilize o len().*

- Resolução:
    
    ```python
    
    ```
    

**10.** A partir de um input (string) informado pelo usuário verifique se essa string:

é numérica

é alfabética

é alfanumérica

- Resolução:
    
    ```python
    frase = input("Digite uma frase: ").strip()
    
    quantidade = len(frase.split())
    
    print(f"Quantidade de palavras: {quantidade}")
    ```
    

**11.** A partir do código informado abaixo, substitua o uso do .format() pelo *f-String*.

- *Código:*
    
    ```python
    # Exemplo 1 – Recibo de compra
    produto = "Camiseta"
    preco = 79.9
    print("Você comprou uma {} por R${:.2f}".format(produto, preco))
    
    # Exemplo 2 – Relatório de desempenho
    aluno = "Marina"
    nota = 8.75
    print("A nota final de {} foi {:.1f}".format(aluno, nota))
    
    # Exemplo 3 – Mensagem de tempo
    horas = 14
    minutos = 5
    print("Agora são {:02d}:{:02d}".format(horas, minutos))
    
    # Exemplo 4 – Dados de endereço
    cidade = "Curitiba"
    estado = "PR"
    print("Endereço: {}, {}".format(cidade, estado))
    
    ```
    
- Resolução:
    
    ```python
    produto = "Camiseta"
    preco = 79.9
    print(f"Você comprou uma {produto} por R${preco:.2f}")
    
    aluno = "Marina"
    nota = 8.75
    print(f"A nota final de {aluno} foi {nota:.1f}")
    
    horas = 14
    minutos = 5
    print(f"Agora são {horas:02d}:{minutos:02d}")
    
    cidade = "Curitiba"
    estado = "PR"
    print(f"Endereço: {cidade}, {estado}")
    ```
    
- Questionário!
    
    Hora de testar seus conhecimentos teóricos:
    
    - 1- Baseado em seus conhecimentos de Strings e python, defina o que é um elemento iterável.
    - 2- Explique, no melhor de suas capacidades, como funcionam os índices de uma String
    - 3- Ao deparar-se com um elemento iterável em *python*, como fazer para entrar neste elemento e selecionar somente um destes índices?
    - 4- Responda:
        - a) Como saber o tipo de um dado/variável?
        - b) Ao pegarmos uma parte de uma string, este pedaço continua sendo uma string? Insira o código que demonstre sua resposta abaixo:
    - 5- Como é a sintaxe de uso de um método de string qualquer?
    - 6- Exemplifique o uso de 4 métodos de string em cadeia, insira o código abaixo
    - *Respostas:*
        - 1- Um elemento iterável é um elemento que pode ser percorrido, ou seja, que tem índices.
            
            Um elemento iterável não é uma coisa só, por exemplo:
            
            ```python
            a = 115
            #aqui vemos que a tem o valor de 115, 115 é uma coisa só, ou seja,
            #se eu me perguntasse quantos números tem aqui, eu diria somente um, o número 115.
            b = 'maria'
            #agora vemos que b tem um valor referente ao nome maria, porém, a string maria tem 5 elementos,
            #sendo o primeiro <m>, o segundo <a> e assim por diante. Notamos então que podemos percorrer esta variável
            #elemento por elemento, ou seja, essa variável é iterável pois a string é um elemento iterável.
            ```
            

### 🏰 **Missões (Exercícios RPG)**

### ⚠️ Dicas do Mestre

- Métodos NÃO alteram a string original (precisa salvar se quiser mudar)
- Muito usados em:
    - validação
    - limpeza de dados
    - sistemas de entrada

## 🥉 Missão 1 — Nome formatado

Peça:

- nome

👉 Mostre:

- `.upper()`
- `.lower()`

```python
nome = "WaaRsk8"

print(nome)
print(nome.upper())
print(nome.lower())
print(nome.capitalize())
print(nome.title())
```

## 🥈 Missão 2 — Validação de nome

👉 Se não for só letras:

- “Nome inválido”

```python
nome = input("Digite seu nome: ")

if nome.isalpha():
    print("Nome válido")
else:
    print("Nome inválido")
```

## 🥇 Missão 3 — Inventário

Crie:

```
inventario="espada,escudo,poção"
```

👉 Transforme em lista com `.split()`

```python
inventario="espada,escudo,poção"

print(inventario.split(","))
```

## 💎 Missão 4 — Sistema completo

Peça:

- nome

👉 Faça:

- remover espaços (`strip`)
- deixar primeira letra maiúscula (`capitalize`)
- validar (`isalpha`)
- Resolução:
    
    ```python
    nome = input("Digite seu nome: ").strip()
    
    nome = " ".join(nome.split()).title()
    
    if nome.replace(" ", "").isalpha():
        print(f"Nome válido: {nome}")
    else:
        print("Nome inválido")
    ```
    

### [?] CURIOSIDADE: Sites de Arte ASCII

A “Arte ASCII” é uma forma de arte, que consiste por textos e desenhos feitos a partir de múltiplos caracteres de texto. Por conta disso, elas são comumente usadas em programas de console. Aqui vão alguns sites que podem te ajudar a estilizar o programa com texto em Arte ASCII:

[https://edukits.co/text-art/](https://edukits.co/text-art/) 

[https://www.messletters.com/pt/text-art/](https://www.messletters.com/pt/text-art/)

[https://patorjk.com/software/taag/](https://patorjk.com/software/taag/)

# 🧱⚠️ **Nível 4 — Tratamento de Erros**

## 📘 **Capítulo 14 — Tratamento de Erros (Proteção do Sistema)**

### 🧠 Introdução — O Mundo Não é Perfeito

No RPG, o jogador pode:

- Digitar algo errado ⌨
- inserrir texto em vez de numeros 🧨
- Tentar algo impossivel ⚠

Sem tratamento de Erro:

💀 o jogo quebra

Com Tratamento:

🛡 o Jogo continua funcionando

### ⚔️ `try` e `except`

📌 Definição

- **try** → tenta executar um codigo
- **except →** executa se ocorrer erro

⚙ Estrutura

```python
try:
		#codigo que pode dar erro
except:
		# codigo executado se der erro
```

#### 🎮 Exemplo RPG

```python
try:
	print("espada".index("z"))
except:
	print("Item nao encontrado!")
```

#### 🧠 Interpretação

- procurou “z” em “espada”
- Não Existe → erro
- **except** executa

### 🎮 Exemplo com entrada do jogador

```python
try:
	nivel = int(input("Digite o nivel do heroi: "))
	print(nivel / 2)
except:
	print("Digite um numero valido")
```

### 🧠 Problema resolvido

sem **try:**

💀 erro quebra o programa

com **try:**

🛡 Erro é tratado

### ⚠️ Tipos de Erros (Sistema Inteligente)

#### 📌 Você pode tratar erros específicos

#### 🎮 Exemplo RPG

```python
try:
    a = 2 / "s"
except TypeError:
    print("❌ Tipo inválido!")
except ZeroDivisionError:
    print("💥 Divisão por zero!")
```

#### 📊 Erros mais comuns

| Erro | Significado |
| --- | --- |
| `TypeError` | Tipo errado |
| `ValueError` | Valor inválido |
| `ZeroDivisionError` | Divisão por zero |

## 🎮 Exemplo completo

```python
try:
		numero = int(input("Digite um número: "))
		print(10 / numero)
except ValueError:
		print("Você não digitou um número!")
except ZeroDivisionError:
		print("Não pode dividir por zero!")
```

### ⚔️ `raise Exception` — Forçar erro

### 🧠 O que é?

Permite

- criar um erro manualmente
- Mostrar mensagem personalizada
- Encerrar o programa

#### 🎮 Exemplo RPG

```python
try: 
	classe = input("Escolha sua classe: ")
	
	if classe != "guerreiro":
		raise Exception("Classe invalida")
		
	print("Classe aceita!")
except Exception as erro:
	print(erro) 
```

#### 🧠 Interpretação

Você controla quando o erro acontece

#### 🧱 `except` genérico (última defesa)

```python
try:
	 x = int("abc")
except:
		print("Erro Desconhecido!")
```

📌 Use apenas como fallback

```python
raise Exception('Favor digite conforme a requisição')
```

### 🏰 **Missões (Exercícios RPG)**

#### ⚠️ Dicas do Mestre

- Sempre trate `input()`
- Prefira erros específicos
- `raise` = controle total
- Evite deixar o programa quebrar 💀

### 🥉 Missão 1 — Entrada segura

Peça:

- nível

👉 Evite erro se digitar texto

- Resolução
    
    ```python
    try:
        nome = input("Digite seu nome: ").strip()
    
        nome = " ".join(nome.split()).title()
    
        if not nome.replace(" ", "").isalpha():
            raise ValueError("Nome inválido")
    
        print(f"Nome válido: {nome}")
    
    except ValueError as erro:
        print("Erro no sistema")
    ```
    

### 🥈 Missão 2 — Divisão segura

Peça:

- número

👉 Trate:

- texto
- zero
    - Resolução: ‘
        
        ```python
        try:
            numero = int(input("Digite um número: "))
        
            resultado = 10 / numero
        
            print(f"Resultado: {resultado}")
        
        except ValueError:
         print("Erro: você deve digitar um número válido!")
        
        except ZeroDivisionError:
           print("Erro: não é possível dividir por zero!")
        ```
        

### 🥇 Missão 3 — Classe válida

Peça:

- classe

👉 Se não for válida:

- use `raise Exception`
- Resolução:
    
    ```python
    try:
        classe = input("Escolha sua classe (guerreiro, mago, arqueiro): ").lower()
    
        classes_validas = ["guerreiro", "mago", "arqueiro"]
    
        if classe not in classes_validas:
            raise Exception("Classe inválida!")
    
        print(f"Classe escolhida: {classe}")
    
    except Exception as erro:
        print("Erro:", erro)
    ```
    

### 💎 Missão 4 — Sistema completo

Peça:

- vida

👉 Trate:

- valor inválido
- número negativo

# 🧱🎒 **Nível 5 — Listas (Inventário do Herói)**

## 📘 **Capítulo 15 — Listas (Armazenando Múltiplos Itens)**

### 🧠 Introdução — O Inventário do RPG

no RPG, o heroi nunca carrega só um item:

- ⚔️ Espada
- 🛡️ Escudo
- 🧪 Poção
- 💰 Ouro

Precisamos guardar vários valores em um só lugar.

para isso usamos:

🎒 **Listas**

#### 📌 Definição

Uma lista é uma variavel que guarda varios valores ao memso tempo.

#### ⚙ Sintaxe

```python
lista = []
```

### 🎮 Exemplo RPG

```python
inventario = ["espada", "escudo", "poção"]
print(inventario)
```

#### 🧠 Índice (Posição dos itens)

Assim como Strings:

A lista começa no índice 0

### 🎮 Exemplo

```python
nomes = ["WaaRsk8", "Arragorn", "Draco"]
print(nomes[0]) #WaaRsk8
print(nomes[1]) #Arragorn
print(nomes[2]) #Draco
```

#### ⚠ Atenção

```python
nomes[0] -> primeiro elemento
nomes[1] -> segundo
```

### 🔥 Lista são editáveis

Diferente de strings:

Listas podem ser modificadas

### ⚔ .append() - adicionar item

Adiciona no FINAL da lista

#### 🎮 Exemplo RPG

```python
inventario = ["espada", "escudo"]
inventario.append("poção")

print(inventario)
```

📌 Resultado:

```python
["espada", "escudo", "poção"]
```

### ⚔ .insert() - inserir em posição

#### 🎮 Exemplo RPG

```python
inventario = ["espada", "escudo"]
inventario.insert(1, "poção")

print(inventario)
```

#### 📌 Resultado:

```python
["espada", "poção", "escudo"]
```

#### 🧠 Interpretação

inseriu na posição 1

Empurrou os outros itens

### 🔍 `.index()` — Encontrar posição

#### 🎮 Exemplo RPG (corrigido do seu código)

```python
produtos = ["espada", "escudo", "poção"]
vendas = [10, 5, 20]

produto = "escudo"

i = produtos.index(produto)

print("O item {} teve {} usos.".format(produto, vendas[i]))
```

#### 🧠 Interpretação

- Procura posição do item
- Usa mesma posição em outra lista

### ⚠️ Correção do seu código

```python
print('O produto {} teve um total de {} vendas.'.format(produtos, vendas[i]))
```

### 🧩 Comparação com Strings

| Característica | String | Lista |
| --- | --- | --- |
| Indexada | ✅ | ✅ |
| Iterável | ✅ | ✅ |
| Editável | ❌ | ✅ |

## Métodos de lista

| Método | Função | Exemplo + Resultado |
| --- | --- | --- |
| lista.append(’n’) | adiciona um item á lista. | lista = [”a”, “b”]
lista.append(”c”)
`['a', 'b', 'c']` |
| lista.index(”n”) | Utilizado em listas para procurar o índice a partir do nome. | lista = [”a”, “b”]
lista.index(”b”)
`1` |
| lista.pop(Número índice) | Retira um item da lista a partir de seu índice. Este item pode ser salvo numa variável. | lista = [”a”, “b”]
lista.pop(1)
`['a']` |
| lista.remove(’n’) | deleta o item da lista a partir de seu nome. | lista = [”a”, “b”]
lista.remove(’b’)
`['a']` |
| len(lista) | Lê quantos índices a lista possui. | lista = [”a”, “b”]
len(lista)
`2` |
| (lista).insert(posicao, valor) | adiciona um valor a lista na posição (índice) escrito. | lista = [”a”, “b”]
lista.insert(1, “c”)
`['a', 'c']` |
| (lista).extend(lista2) | adiciona os valores da (lista2) á lista, estende a lista. | lista = [”a”, “b”]
lista2 = [”c”, “d”]
lista.extend(lista2)
`['a', 'b', 'c', 'd']` |
| (lista).clear() | limpa uma lista (exclui todos seus itens). | lista = [”a”, “b”]
lista.clear()
 |
| (lista).sort() | Ordena os valores da lista em ordem crescente, ou alfabética, (reverse=False) ou decrescente (reverse=True). | lista = [”a”, “b”]
lista.sort(reverse=True)
`['b', 'a']` |
| (lista).reverse() | inverte a ordem dos elementos de uma lista. | lista = [”a”, “b”]
lista.reverse()
`['b', 'a']` |
| novalista = lista.copy() | copia uma lista | lista = [”a”, “b”]
lista2 = lista.copy
`['a', 'b']` |
| sum(lista) | soma o números de uma lista. | lista = [2, 3]
sum(lista)
`5` |
| (lista).count(elemento) | conta quantas vezes determinado elemento apareceu na lista. | lista = [”a”, “b”, “b”]
lista.count(”b”)
`2` |

```python
Utilizando o Index:
lista =['leo', 'maria', 'marcia']
print(lista.index('maria'))
#1
```

```python
lista =['leo', 'maria', 'marcia','michael jackson']
print(lista)
lista.pop(3)
print(lista)
#['leo', 'maria', 'marcia', 'michael jackson']
#['leo', 'maria', 'marcia']
```

## Exercícios progressivos

**1.**  Faça um código que: Crie uma lista com 3 nomes. 

- Resolução:
    
    ```python
    nomes = []
    nomes.append('leo')
    nomes.append('gab')
    nomes.append('maria')
    print(nomes)
    Ou
    nomes = ['leo','maria','gab']
    ```
    

**1.1** Crie uma lista vazia e adicione 4 nomes digitados pelo usuário.

- Resolução:
    
    ```python
    nomes = []
    nome = input('Nome: ')
    nomes.append(nome)
    nome = input('Nome: ')
    nomes.append(nome)
    nome = input('Nome: ')
    nomes.append(nome)
    nome = input('Nome: ')
    nomes.append(nome)
    print(nomes)
    ```
    
    - Bônus:
        
        ```python
        nomes = []
        nomes.extend(input('Informe 4 nomes separados por espaços:\n').split())
        print(nomes)
        ```
        

**1.2** A partir da lista anterior, peça um nome ao usuário e, caso ele esteja presente na lista, exclua-o.

- Resolução:
    
    ```python
    nome = input('informe o nome a remover: ')
    if nome in nomes:
        print(f'lista antiga: {nomes}')
        nomes.remove(nome)
        print(f'{nome} removido.')
        print(f'lista atual:{nomes}')
    else:
        print('nome não encontrado na lista: ')
        print(nomes)
    ```
    

**1.2.1** Crie um programa que adicione 5 nomes digitados pelo usuário em uma lista vazia e, após isso, exclua um nome da lista, também fornecido pelo usuário.

- Resolução:
    
    ```python
    nomes=[]
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    print('A lista de nomes está assim:\n{}'.format(nomes))
    nome = input('Informe o nome a ser removido: \n')
    nomes.remove(nome)
    print('A nova lista de nomes está assim:\n{}'.format(nomes))
    
    ```
    

**1.3** Crie uma lista com 5 números inteiros fornecidos pelo usuário. 

- Resolução:
    
    ```python
    numeros = []
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    print(numero)
    ```
    

**1.3.1** Crie uma nova lista com o dobro dos valores da lista anterior.

- Resolução:
    
    ```python
    numerosdobro = [numeros[0]*2,numeros[1]*2,numeros[2]*2,numeros[3]*2,numeros[4]*2]
    print(numerosdobro)
    ```
    

---

**3.** Faça um programa que permita o usuário, a partir do nome do item, receber o preço correspondente.

*Dados:*

```python
produtos = ['Arroz', 'Feijao', 'Leite', 'Pao Frances', 'Ovos', 'Acucar', 'Farinha De Trigo', 'Oleo De Soja', 'Tomate', 'Banana', 'Maca', 'Cafe Em Po', 'Carne Bovina', 'Peito De Frango', 'Batata', 'Cebola', 'Alface', 'Agua', 'Queijo Mussarela', 'Arroz Integral']
precos = [8.0, 12.5, 5.8, 10.0, 14.4, 4.5, 4.0, 7.0, 10.24, 9.72, 14.6, 18.0, 54.0, 25.0, 7.17, 6.32, 5.8, 4.0, 62.0, 10.0]
```

- Resolução:
    
    ```python
    item = input('informe o produto desejado: ').title()
    if item in produtos:
        posicaoProduto = produtos.index(produto)
        precoP = precos[posicaoProduto]
        print(f'Meu produto {item} custa R${precoP:.2f}')
    else:
        print(f'produto não encontrado.\n,lista de produtos:{produtos}')
    ```
    

---

**4.** Resolva:

1. A partir da lista dada, calcule a soma, média, maior e menor número. 
    
    Use somente conceitos de List Slicing (posições de lista) e as funções len e print.
    
    Salve estes dados numa nova de resultados e crie uma lista sequencial com os números dados
    
    ```python
    [47, 12, 89, 3, 56]
    ```
    
    - Resolução:
        
        ```python
        listaQualquer = [47, 12, 89, 3, 56]
        soma = listaQualquer[0]+listaQualquer[1]+listaQualquer[2]+listaQualquer[3]+listaQualquer[4]
        media = soma/len(listaQualquer)
        menor = listaQualquer[0]
        maior = listaQualquer[0]
        if listaQualquer[1]<menor:
            menor = listaQualquer[1]
        if listaQualquer[1]>maior:
            maior = listaQualquer[1]
        if listaQualquer[2]<menor:
            menor = listaQualquer[2]
        if listaQualquer[2]>maior:
            maior = listaQualquer[2]
        if listaQualquer[3]<menor:
            menor = listaQualquer[3]
        if listaQualquer[3]>maior:
            maior = listaQualquer[3]
        if listaQualquer[4]<menor:
            menor = listaQualquer[4]
        if listaQualquer[4]>maior:
            maior = listaQualquer[4]
        copiaLista = listaQualquer.copy()
        copiaLista.remove(menor)
        copiaLista.remove(maior)
        listaDefinitiva = [menor]
        if copiaLista[0]<copiaLista[1] and copiaLista[0]<copiaLista[2]:
                listaDefinitiva.append(copiaLista[0])
                copiaLista.pop(0)
        elif copiaLista[1]<copiaLista[0] and copiaLista[1]<copiaLista[2]:
                listaDefinitiva.append(copiaLista[1])
                copiaLista.pop(1)
        else:
                listaDefinitiva.append(copiaLista[2])
                copiaLista.pop(2)
        if copiaLista[0]<copiaLista[1]:
            listaDefinitiva.append(copiaLista[0])
            listaDefinitiva.append(copiaLista[1])
        else:
            listaDefinitiva.append(copiaLista[1])
            listaDefinitiva.append(copiaLista[0])
        listaDefinitiva.append(maior)
        print(f'''Soma: {soma}
        Média: {media}
        Menor: {menor}
        Maior: {maior}
        Lista Ordenada: {listaDefinitiva}
        Encerrando...''')
        ```
        
    - Resolução usando o .sort():
        
        ```java
        listaQualquer = [47, 12, 89, 3, 56]
        soma = listaQualquer[0]+listaQualquer[1]+listaQualquer[2]+listaQualquer[3]+listaQualquer[4]
        media = soma/len(listaQualquer)
        listaQualquer.sort()
        menor = listaQualquer[0]
        maior = listaQualquer[len(ListaQualquer)-1]
        print(f'''Soma: {soma}
        Média: {media}
        Menor: {menor}
        Maior: {maior}
        Lista Ordenada: {ListaQualquer}
        Encerrando...''')
        ```
        
    
2. Crie uma lista chamada Operacoes com as Strings referentes aos nomes das operações calculadas anteriormente e imprima, a seguir:
    
    O cálculo de <Soma> Resultou em <400>, substituindo o <soma> por um elemento da lista de operações, e o <400> pelo resultado daquela operação.
    
    - Resolução:
        
        ```python
        item = input('informe o produto desejado: ').title()
        if item in produtos:
            posicaoProduto = produtos.index(produto)
            precoP = precos[posicaoProduto]
            print(f'Meu produto {item} custa R${precoP:.2f}')
        else:
            print(f'produto não encontrado.\n,lista de produtos:{produtos}')
        ```
        

---

**5.** Uma empresa lhe pediu para criar um programa que separasse bebidas alcóolicas e suplementos de uma lista qualquer que lhe fosse provida para pagamento separado. A tarefa exige que, dada uma lista qualquer, seu programa separe os dois itens (uma lista de bebidas alcóolicas e uma lista de suplementos), armazenando:

uma nova lista com todas as bebidas, e outra com seus respectivos preços

uma nova lista com todos os suplementos, e outra com seus respectivos preços

o valor total para pagamento de cada uma das listas, separados.

 As bebidas alcóolicas começam com o código BEB, e os suplementos com o código TFA.

*Dados:*

```python
produtos = [' beb46275','TFA23962','TFA64715','TFA69555','TFA56743', 'BSA45510','TFA44968','CAR75448','CAR23596','CAR13490','BEB21365','BEB31623', 'BSA62419','BEB73344',
'TFA20079','BEB80694','BSA11769','BEB19495','TFA14792','TFA78043','BSA33484','BEB97471','BEB62362','TFA27311','TFA17715','BEB85146','BEB48898','BEB79496','CAR38417',
'TFA19947','TFA58799','CAR94811','BSA59251','BEB15385','BEB24213','BEB56262','BSA96915','CAR53454','BEB75073']  

precos = [1258.69, 917.65, 1050.26, 414.36, 904.9, 1077.77, 640.14, 379.92, 1201.62, 1206.15, 1256.34, 729.27, 1252.72, 432.89, 457.95, 1191.3, 421.77, 1165.32, 1040.62,
781.12, 1059.19, 1232.68, 1112.44, 1265.35, 575.2, 1150.78, 544.38, 949.14, 1043.73, 758.28, 398.22, 662.56, 723.15, 468.72, 366.52, 513.45, 703.74, 421.34, 961.38]
```

### Extra: Adicionando múltiplos itens em uma lista:

```python
Caso simplesmente deseje economizar linhas de código:
l = []
l.append(1),l.append(2),l.append(3)
Caso queira adicionar várias strings:
l.extend(input().split())
Caso queira adicionar algo que não string (exemplo int):
l.extend(list(map(int, input().split())))
```

## 🏰 **Missões (Exercícios RPG)**

#### ⚠️ Dicas do Mestre

- Lista usa `[ ]`
- Índice começa em `0`
- `.append()` → final
- `.insert()` → posição
- `.index()` → encontrar posição

## 🥉 Missão 1 — Inventário básico

Crie:

```
inventario= ["espada","escudo"]
```

👉 Mostre:

- primeiro item

```python
inventario = ["espada", "escudo", "poção de vida"]
inventario.append(input("Digite o item que deseja adicionar ao inventário: "))
print("Inventário atualizado:", inventario)
print("O primeiro item é:", inventario[0])
print("O último item é:", inventario[-1])
```

## 🥈 Missão 2 — Adicionar item

👉 Adicione:

- poção

```python
inventario = ["espada", "escudo", "poção de vida"]
inventario.append("poção de mana")
inventario.append(input("Digite o item que deseja adicionar ao inventário: "))

print("Inventário atualizado:", inventario)

print("Item adicionado pelo sistema:", inventario[-2])

print("O primeiro item é:", inventario[0])

print("O último item é:", inventario[-1])
```

## 🥇 Missão 3 — Inserção estratégica

👉 Insira:

- arco na posição 1

```python
inventario = ["espada", "escudo", "poção de vida"]
inventario.append("poção de mana")
inventario[1] = "Arco"
inventario.append(input("Digite o item que deseja adicionar ao inventário: "))

print("Inventário atualizado:", inventario)

print("Item adicionado pelo sistema:", inventario[-2])

print("O primeiro item é:", inventario[0])

print("O segundo item é:", inventario[1])

print("O último item é:", inventario[-1])
```

## 💎 Missão 4 — Sistema de busca

Crie:

- lista de itens
- lista de usos

👉 Mostre:

- quantas vezes um item foi usado

```python
itens = ["espada", "arco", "poção"]
usos = ["espada", "espada", "arco", "poção", "espada"]

item = input("Qual item deseja verificar? ").lower()

quantidade = usos.count(item)

print(f"O item '{item}' foi usado {quantidade} vezes.")
```

## Exercícios

**1.**  Faça um código que: Crie uma lista com 3 nomes. 

- Resolução:
    
    ```python
    nomes = []
    nomes.append('Renan')
    nomes.append('Thalita')
    nomes.append('Lorena')
    
    print(nomes)
    ```
    

**1.1** Crie uma lista vazia e adicione 4 nomes digitados pelo usuário.

- Resolução:
    
    ```python
    nomes = []
    nome = input('Nome: ')
    nomes.append(nome.capitalize())
    nome = input('Nome: ')
    nomes.append(nome.capitalize())
    nome = input('Nome: ')
    nomes.append(nome.capitalize())
    nome = input('Nome: ')
    nomes.append(nome.capitalize())
    print(nomes)
    ```
    

**1.2** A partir da lista anterior, peça um nome ao usuário e, caso ele esteja presente na lista, exclua-o.

- Resolução:
    
    ```python
    nome = input('informe o nome a remover: ')
    if nome in nomes:
        print(f'lista antiga: {nomes}')
        nomes.remove(nome)
        print(f'{nome} removido.')
        print(f'lista atual:{nomes}')
    else:
        print('nome não encontrado na lista: ')
        print(nomes)
    ```
    

**1.2.1** Crie um programa que adicione 5 nomes digitados pelo usuário em uma lista vazia e, após isso, exclua um nome da lista, também fornecido pelo usuário.

- Resolução:
    
    ```python
    nomes=[]
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    nome = input('Informe o nome: ')
    nomes.append(nome)
    print('A lista de nomes está assim:\n{}'.format(nomes))
    nome = input('Informe o nome a ser removido: \n')
    nomes.remove(nome)
    print('A nova lista de nomes está assim:\n{}'.format(nomes))
    
    ```
    

**1.3** Crie uma lista com 5 números inteiros fornecidos pelo usuário. 

- Resolução:
    
    ```python
    numeros = []
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    numero = int(input('Informe o numero: '))
    numeros.append(numero)
    print(numero)
    ```
    

**1.3.1** Crie uma nova lista com o dobro dos valores da lista anterior.

- Resolução:
    
    ```python
    numerosdobro = [numeros[0]*2,numeros[1]*2,numeros[2]*2,numeros[3]*2,numeros[4]*2]
    print(numerosdobro)
    ```
    

---

**3.** Faça um programa que permita o usuário, a partir do nome do item, receber o preço correspondente.

*Dados:*

```python
produtos = ['Arroz', 'Feijao', 'Leite', 'Pao Frances', 'Ovos', 'Acucar', 'Farinha De Trigo', 'Oleo De Soja', 'Tomate', 'Banana', 'Maca', 'Cafe Em Po', 'Carne Bovina', 'Peito De Frango', 'Batata', 'Cebola', 'Alface', 'Agua', 'Queijo Mussarela', 'Arroz Integral']
precos = [8.0, 12.5, 5.8, 10.0, 14.4, 4.5, 4.0, 7.0, 10.24, 9.72, 14.6, 18.0, 54.0, 25.0, 7.17, 6.32, 5.8, 4.0, 62.0, 10.0]
```

- Resolução:
    
    ```python
    item = input('informe o produto desejado: ').title()
    if item in produtos:
        posicaoProduto = produtos.index(produto)
        precoP = precos[posicaoProduto]
        print(f'Meu produto {item} custa R${precoP:.2f}')
    else:
        print(f'produto não encontrado.\n,lista de produtos:{produtos}')
    ```
    

---

**4.** Resolva:

1. A partir da lista dada, calcule a soma, média, maior e menor número. 
    
    Use somente conceitos de List Slicing (posições de lista) e as funções len e print.
    
    Salve estes dados numa nova de resultados e crie uma lista sequencial com os números dados
    
    ```python
    [47, 12, 89, 3, 56]
    ```
    
    - Resolução:
        
        ```python
        listaQualquer = [47, 12, 89, 3, 56]
        soma = listaQualquer[0]+listaQualquer[1]+listaQualquer[2]+listaQualquer[3]+listaQualquer[4]
        media = soma/len(listaQualquer)
        menor = listaQualquer[0]
        maior = listaQualquer[0]
        if listaQualquer[1]<menor:
            menor = listaQualquer[1]
        if listaQualquer[1]>maior:
            maior = listaQualquer[1]
        if listaQualquer[2]<menor:
            menor = listaQualquer[2]
        if listaQualquer[2]>maior:
            maior = listaQualquer[2]
        if listaQualquer[3]<menor:
            menor = listaQualquer[3]
        if listaQualquer[3]>maior:
            maior = listaQualquer[3]
        if listaQualquer[4]<menor:
            menor = listaQualquer[4]
        if listaQualquer[4]>maior:
            maior = listaQualquer[4]
        copiaLista = listaQualquer.copy()
        copiaLista.remove(menor)
        copiaLista.remove(maior)
        listaDefinitiva = [menor]
        if copiaLista[0]<copiaLista[1] and copiaLista[0]<copiaLista[2]:
                listaDefinitiva.append(copiaLista[0])
                copiaLista.pop(0)
        elif copiaLista[1]<copiaLista[0] and copiaLista[1]<copiaLista[2]:
                listaDefinitiva.append(copiaLista[1])
                copiaLista.pop(1)
        else:
                listaDefinitiva.append(copiaLista[2])
                copiaLista.pop(2)
        if copiaLista[0]<copiaLista[1]:
            listaDefinitiva.append(copiaLista[0])
            listaDefinitiva.append(copiaLista[1])
        else:
            listaDefinitiva.append(copiaLista[1])
            listaDefinitiva.append(copiaLista[0])
        listaDefinitiva.append(maior)
        print(f'''Soma: {soma}
        Média: {media}
        Menor: {menor}
        Maior: {maior}
        Lista Ordenada: {listaDefinitiva}
        Encerrando...''')
        ```
        
    - Resolução usando o .sort():
        
        ```java
        listaQualquer = [47, 12, 89, 3, 56]
        soma = listaQualquer[0]+listaQualquer[1]+listaQualquer[2]+listaQualquer[3]+listaQualquer[4]
        media = soma/len(listaQualquer)
        listaQualquer.sort()
        menor = listaQualquer[0]
        maior = listaQualquer[len(ListaQualquer)-1]
        print(f'''Soma: {soma}
        Média: {media}
        Menor: {menor}
        Maior: {maior}
        Lista Ordenada: {ListaQualquer}
        Encerrando...''')
        ```
        
    
2. Crie uma lista chamada Operacoes com as Strings referentes aos nomes das operações calculadas anteriormente e imprima, a seguir:
    
    O cálculo de <Soma> Resultou em <400>, substituindo o <soma> por um elemento da lista de operações, e o <400> pelo resultado daquela operação.
    
    - Resolução:
        
        ```python
        item = input('informe o produto desejado: ').title()
        if item in produtos:
            posicaoProduto = produtos.index(produto)
            precoP = precos[posicaoProduto]
            print(f'Meu produto {item} custa R${precoP:.2f}')
        else:
            print(f'produto não encontrado.\n,lista de produtos:{produtos}')
        ```
        

---

**5.** Uma empresa lhe pediu para criar um programa que separasse bebidas alcóolicas e suplementos de uma lista qualquer que lhe fosse provida para pagamento separado. A tarefa exige que, dada uma lista qualquer, seu programa separe os dois itens (uma lista de bebidas alcóolicas e uma lista de suplementos), armazenando:

uma nova lista com todas as bebidas, e outra com seus respectivos preços

uma nova lista com todos os suplementos, e outra com seus respectivos preços

o valor total para pagamento de cada uma das listas, separados.

 As bebidas alcóolicas começam com o código BEB, e os suplementos com o código TFA.

```python
produtos = [' beb46275','TFA23962','TFA64715','TFA69555','TFA56743', 'BSA45510','TFA44968','CAR75448','CAR23596','CAR13490','BEB21365','BEB31623', 'BSA62419','BEB73344',
'TFA20079','BEB80694','BSA11769','BEB19495','TFA14792','TFA78043','BSA33484','BEB97471','BEB62362','TFA27311','TFA17715','BEB85146','BEB48898','BEB79496','CAR38417',
'TFA19947','TFA58799','CAR94811','BSA59251','BEB15385','BEB24213','BEB56262','BSA96915','CAR53454','BEB75073']  

precos = [1258.69, 917.65, 1050.26, 414.36, 904.9, 1077.77, 640.14, 379.92, 1201.62, 1206.15, 1256.34, 729.27, 1252.72, 432.89, 457.95, 1191.3, 421.77, 1165.32, 1040.62,
781.12, 1059.19, 1232.68, 1112.44, 1265.35, 575.2, 1150.78, 544.38, 949.14, 1043.73, 758.28, 398.22, 662.56, 723.15, 468.72, 366.52, 513.45, 703.74, 421.34, 961.38]
```

### Extra: Adicionando múltiplos itens em uma lista:

```python
Caso simplesmente deseje economizar linhas de código:
l = []
l.append(1),l.append(2),l.append(3)
Caso queira adicionar várias strings:
l.extend(input().split())
Caso queira adicionar algo que não string (exemplo int):
l.extend(list(map(int, input().split())))
```

# 🧱🔁 **Nível 6 — Estruturas de Repetição**

## 📘 **Capítulo 16 — `for` (Loop de Ações)**

### 🧠 Introdução — Ações Repetidas no RPG

No RPG, várias ações se repetem:

- ⚔️ Ataques contínuos
- 🎒 Ver inventário
- 👥 Percorrer lista de inimigos
- 💰 Ver recompensas

Para isso usamos:

🔄 **for**

### 📌 Definição

O **for** percorre elementos iteráveis:

- Listas
- Strings
- Range

Executa um bloco varias vezes

⚙ Estrutura

```python
for variavel in variavel:
		ação
```

### ⚔️ `range()` — Repetição por quantidade

### 🎮 Exemplo  RPG

```python
for i in range(5):
		print("⚔ O heroi atacou!")
```

#### 🎮 Resultado:

Repete 5 vezes

#### 🎮 Usando o índice

```python
for i in range(5):
		print(f"⚔ Ataque numero {i}")
	
```

#### 🧠 Interpretação

- **i** começa em 0
- Vai ate 4

### Percorrendo listas

#### 🎒 Percorrendo listas

#### 🎮 Exemplo RPG

```python
inventario = ["espada", "escudo", "poção"]

for item in inventario:
		print(f" item: {item}")
```

#### 🧠 Melhor prática

✔ Melhor que:

```python
for i in range(len(inventario)):
    print(inventario[i])
```

### ⚠️ Erro comum (do seu exemplo)

#### ❌ Errado

```python
for venda in vendas:
		print(vendas)
```

👉 Isso imprime a lista inteira várias vezes 💀

#### ✔️ Correto

```python
for venda in vendas:
		print(venda)
```

#### 🎮 Exemplo RPG adaptado

```python
vendas= [
    ["WaaRsk8",15000],
    ["Arragorn",27000],
    ["Draco",9900]
]

for venda in vendas:
		print(venda[1]) # mostra apenas o valor
```

#### 🧠 Interpretação

- `venda[0]` → nome
- `venda[1]` → valor

### 🧠 `enumerate()` — Índice + Valor
🎮 Exemplo RPG

```python
inventario= ["espada","escudo","poção"]

for i, item in enumerate(inventario):
		print(f"{i} -{item}")
```

## 🎮 Resultado

```python
# 0 - espada
# 1 - escudo
# 2 - poção
```

### ⚡ List Comprehension (Criação rápida)

#### 🎮 Exemplo RPG

```python
lista = [i for i in range(5)]
print(lista)

# Resultado:
# [0, 1, 2, 3, 4]
```

#### 🎮 Apenas números pares

```jsx
lista = [i for i in range(20) if i % 2 == 0]
print(lista)
```

#### 🎮 Exemplo RPG

```jsx
dano = [i for i range(20) if i % 2 == 0]
print(dano)
```

### 🏰 Cadastro com `for`

```jsx
cadastros = []

for i in range(3):
		nome = input("digite o nome do heroi: ")
		cadastro.append(nome)
print(f"herois cadastrados {cadastros}")
```

# 🏰 **Missões (Exercícios RPG)**

### ⚠️ Dicas do Mestre

- `for` percorre elementos
- `range()` → quantidade
- `enumerate()` → índice + valor
- cuidado com `print(lista)` dentro do loop ⚠️

## 🥉 Missão 1 — Ataque repetido

👉 Faça o herói atacar 5 vezes

## 🥈 Missão 2 — Inventário

👉 Percorra uma lista de itens

## 🥇 Missão 3 — Mostrar índice

👉 Use `enumerate` para mostrar posição + item

## 💎 Missão 4 — Sistema completo

Crie:

- lista de jogadores + pontuação

👉 Mostre:

- apenas pontuações

## Lista de Exercícios progressiva

1. Crie uma lista vazia. 

Após, adicione 5 nomes nessa lista .append()

após ter adicionado os 5 nomes na lista, percorra essa lista imprimindo a mensagem ‘bom dia <nome>’

**1.** Repita 10x a frase olá mundo.

---

**2.** Faça um programa que pergunte o nome de uma pessoa e responda *“Bom dia <nome>!”. R*epetindo o processo 5 vezes.

---

**3.** Crie uma lista vazia. 

Após, adicione 5 nomes nessa lista .append()

após ter adicionado os 5 nomes na lista, percorra essa lista imprimindo a mensagem ‘bom dia <nome>’

---

**3.5** Crie um script em python que, a partir de um número inteiro, entregue sua tabuada. 

---

**4.** Crie um programa que pergunte o salário bruto de um funcionário e informe o quanto ele deve pagar de INSS, repetindo o processo 4 vezes.

*Dados: Considere o INSS como 9% do salário.*

---

**5.** Crie um programa que cadastre 5 nomes informados pelo usuário em uma lista de nomes previamente definida (caso ela já tenha 11 nomes, por exemplo, deverá ficar com 16 nomes ao final do programa.)

*Dica: Utilize o método de lista* `.append()`

---

**6.** Dada a lista de nomes anterior, realize um print com a seguinte saída: *"Bom dia <nome>. Bem vindo ao nosso encontro!"* para cada nome na lista.

---

**7.** Crie um programa que pergunte um nome e em seguida pergunte o salário do mesmo nome. Após ter perguntado para 5 pessoas, faça com que o programa informe o valor do INSS para cada uma delas da seguinte forma: *"Bom dia <nome>, com um salário de <salário>, você pagará <inss> de INSS."*

---

**8.** Faça um programa que, para uma lista de mercado de 10 produtos pré-defnidos por você, gere preços aleatórios (incluindo centavos). A partir deste, crie um sistema de mercado, onde a pessoa via um menu pode adicionar novos produtos, consultar preços de produtos já existentes, verificar o catálogo de produtos e excluir produtos existentes.

## Desafio

**1.** A partir do exercício 6, pesquise as faixas de imposto do INSS e utilize a porcentagem adequada para cada faixa salarial.

---

- Respostas:
    
    ```python
    #1
    for i in range(10):
        print('Olá Mundo')
    
    #2
    for i in range(5):
        nome = input('Qual é seu nome?\n')
        print('Bom dia {}'.format(nome))
    #3
    nomes = []
    for i in range(4):
        nome = input('Digite um nome: ')
        nomes.append(nome)
    for i in range(4):
        print(f'bom dia {nomes[i
    #4:
    for i in range(2):
        nome = input('Informe seu nome: ')
        salario = float(input('{}, informe quanto vc ganha\n'))
        inss = 0.09*salario
        print('{}, Você deve pagar R${:.2f} de inss'.format(nome, inss))
    nomes = ['leo,','pat','rodrigo']
    
    #5
    for i in range(2):
        nome = input('Informe o prox. nome: ')
        nomes.append(nome)
    print(nomes)
    
    #6
    for i in nomes:
        print("Bom dia {}. Bem vindo ao nosso encontro!".format(i))
     
    #7 (Básico)
    for i in range(2):
        print('Você deve pagar R${:.2f} de inss'.format(0.09*float(input('Qual seu salário?:\n'))))
     
    #7 (Desafio):
    qtd = int(input('digite a qtd a ser cadastrado: '))
    nomes = []
    salarios = []
    for i in range(qtd):
        nome = input('informe seu nome\n')
        salario = float(input('Qual é o seu salário {}\n'.format(nome)))
        nomes.append(nome)
        salarios.append(salario)
    for i in range(qtd):
        if salarios[i] < 1412:
            taxa = 0.075
        elif salarios[i] < 2666:
            taxa = 0.09
        elif salarios[i] < 4000:
            taxa = 0.12
        else:
            taxa = 0.14
        print("Bom dia {}, com um salário de R${:.2f}, você pagará R${:.2f} de INSS".format(nomes[i],salarios[i],salarios[i]*taxa))
    # for i in range(len(salarios)):  
    
    #8
    from random import randint
    mercado = ['Banana','Abobrinha','Cenoura','Detergente','Pão','Danone','Flan','Açaí','Bolacha','Danete']
    precos = []'
    for i in range(len(mercado)):
        precos.append(randint(3,15)+randint(1,99)/100)
    menu = int(input('Digite uma das seguintes opções:\n1-Adicionar.\n2-Consultar.\n3-Imprimir Lista\n4-Excluir item.\n'))
    match menu:
        case 1:
            item = input('Informe o produto:\n').capitalize()
            preco = float(input('Agora o preço:\n'))
            mercado.append(item)
            precos.append(preco)
        case 2:
            item = input('Informe o produto a consultar:\n').capitalize()
            if item in mercado:
                indice = mercado.index(item)
                print('O Preço do item {} é R${:.2f}'.format(item,precos[indice]))
            else:
                print('Este item não está na lista de mercado')
        case 3:
            for i in range(len(mercado)):
                print('O item {} Custa R${}'.format(mercado[i],precos[i]))
        case 4:
            item = input('Informe o produto a remover:\n').capitalize()
            if item in mercado:
                indice = mercado.index(item)
                mercado.remove(item)
                precos.pop(indice)
            else:
                print('Este item não consta na lista.')
            
        case _:
            print('Digite uma opção válida.')    
    ----------------------- RASCUNHO EX 8 ------------------------------from random import randint
    from IPython.display import clear_output as co 
    from random import randint
    produtos = ['barra de chocolate ao leite', 'nutella', 'bala fini', 'brigadeiro gourmet', 'brownie de chocolate', 'sorvete de creme com cobertura de chocolate', 'cookies recheados','ovomaltine','pudim de leite condensado','bombom ferrero rocher']
    precos = []
    menu = '''Escolha uma opção:
    1- Adicionar produtos
    2- Consulta de preços
    3- Remover produtos
    '''
    for item in produtos:
        precos.append(randint(5,25) + randint(0,99)/100)
    match int(input(menu)):
        case 1:
            produto = input('informe o produto a ser adicionado').lower()
            preco = float(input('informe o preço do produto'))
            if produto not in produtos:
                produtos.append(produto)
                precos.append(preco)
        case 2:
            for indice in range(len(produtos)):
                print(f'{produtos[indice]} custa R${precos[indice]:.2f}')
        case 3:
            co()
            print('lista de produtos cadastrados: ')
            for produto in produtos:
                print(produto)
            produtoR = input('informe o produto que deseja remover').lower()
            if produtoR in produtos:
                produtos.remove(produtoR)
            else:
                print('produto não existente')
    
    # for i,produto in enumerate(produtos):
            #     print(produto)
            #     print(precos[i])
            
    
    ```
    

## 📘 **Capítulo 17 — `while` (Loop Contínuo)**

## 🧠 Introdução — Loop infinito no RPG

No RPG, várias coisas precisam acontecer **até uma condição mudar**:

- ⚔️ lutar até o inimigo morrer
- 🎮 menu rodando até o jogador sair
- 🧪 usar poções até acabar

👉 Para isso usamos:

## 🔁 `while`

## 📌 Definição

O `while` repete um bloco de código **ENQUANTO uma condição for verdadeira**

## ⚙️ Estrutura

```python
whilecondição:
# código que repete
else:
# executa quando o while termina
```

## 🎮 Exemplo RPG simples

```python
vida_inimigo=3

whilevida_inimigo>0:
print("⚔️ Atacando o inimigo!")
vida_inimigo-=1

print("💀 Inimigo derrotado!")
```

## 🧠 Interpretação

- Enquanto vida > 0 → continua
- Quando chega a 0 → para

# 🎮 Exemplo com input (seu exemplo melhorado)

```python
nomes= []
continuar="s"

whilecontinuar=="s":
nome=input("Digite o nome do herói: ")
nomes.append(nome)

continuar=input('Deseja continuar? [s/n] ')

print(f"Heróis cadastrados:{nomes}")
```

## 🧠 Uso real

👉 Cadastro

👉 Menus

👉 Sistemas interativos

# ⚠️ Cuidado — Loop infinito 💀

```python
whileTrue:
print("Isso nunca para!")
```

👉 Só para com intervenção (ou break)

# 🛑 `break` — Parar o loop

## 🎮 Exemplo RPG

```python
whileTrue:
comando=input("Digite 'sair' para encerrar: ")

ifcomando=="sair":
break

print("🎮 Jogando...")
```

## 🧠 Interpretação

👉 `break` força a parada do loop

# ⏭️ `continue` — Pular rodada

## 🎮 Exemplo RPG

```
foriinrange(5):
ifi==2:
continue

print(f"Ataque{i}")
```

## 🧠 Interpretação

👉 Pula o número 2

# ⚔️ `while` com `else`

## 🎮 Exemplo RPG

```
energia=3

whileenergia>0:
print("⚡ Usando energia...")
energia-=1
else:
print("🔋 Energia esgotada!")
```

## 🧠 Interpretação

👉 `else` executa quando o loop termina naturalmente

# 🏰 **Missões (Exercícios RPG)**

### ⚠️ Dicas do Mestre

- `while` = condição
- cuidado com loop infinito
- use `break` para sair
- use `continue` para pular

## 🥉 Missão 1 — Combate

Crie:

- vida do inimigo = 5

👉 Diminua até morrer

## 🥈 Missão 2 — Menu

Crie:

- menu com opções
- loop até jogador digitar "sair"

## 🥇 Missão 3 — Sistema de cadastro

👉 Cadastre nomes até usuário parar

## 💎 Missão 4 — Sistema completo

Crie:

- vida do jogador
- ataque com input
- loop até morrer

### Lista de Exercícios progressiva:

```python
Lista exercicios While
1- Crie uma variável chamada a.<a> começa com um valor de 0.
Faça com que a chegue até o valor 100, com incrementos de 
1, e depois faça com que o programa se encerre sozinho. Utilize while.
2- Utilizando o while, escreva 'Bom dia' 15 vezes
3- Faça um programa utilizando while que some dois números 
para o usuário e entregue o resultado da soma logo em 
seguida. Repita infinitamente, perguntando dois números e entregando 
o novo resultado.
4- faça um progama que, infinitamente, pergunte o nome e
a idade de uma pessoa e responda se a mesma pode votar.
5- Crie um programa que diga "Acesso Permitido" a cada
vez que um usuário digitar a senha 'SENAI'. Caso ele digite
outra coisa, diga "Acesso Negado" e encerre o programa
6 - Crie um programa que, indefinidamente, adicione nomes
em uma lista previamente dada. Printe a lista a cada adição.
8 - utilizando o while, crie um programa que conte de 1 a n,
tal que n seja um input inteiro informado pelo usuário.
9 - Utilizando a biblioteca random > randint, crie um loop while 
que peça ao usuário que adivinhe um número entre 1 e 999, caso ele
erre o número diga se o resultado é menor ou maior.
10 - Crie uma lista de feira onde a pessoa pode adicionar diversas
frutas; Caso ela digite "Parar", o programa deve parar o cadastramento
e exibir a lista final
Desafio:
Crie um programa que ao final da lista de compras, pergunte todos os 
preços dos respectivos itens (ou gere aleatoriamente, com centavos).
Crie também um menu, onde: 1- Consulta, 2- Adicionar, 3- Remover itens, 
4- Sair, e 5-Calcular preço total. 
Desafio 2.0: Pergunte também o salário e a quantidade vendida, dizendo assim,
quanto % do salário está sendo gasto em mercado
```

- **Respostas:**
    
    ```python
    #1-
    a = 0
    while a <= 100:
    	print(a)
    	a += 1
    #for i in range(101): Exemplo de uso com o for
    	#print(i)
    #2-
    a = 0
    while a < 15:
    	print("Bom dia")
    	a += 1
    ```
    

### Exercício:

Sua empresa lhe pediu para criar um programa que separasse bebidas alcóolicas e suplementos de uma lista qualquer que lhe fosse provida para pagamento separado.

A tarefa exige que, dada uma lista qualquer, seu programa separe os dois itens (uma lista de bebidas alcóolicas e uma lista de suplementos).

As bebidas alcóolicas começam com o código BEB, e os suplementos com o código TFA.

```python
Lista: 
produtos = [' beb46275','TFA23962','TFA64715','TFA69555','TFA56743',
'BSA45510','TFA44968','CAR75448','CAR23596','CAR13490','BEB21365','BEB31623',
'BSA62419','BEB73344','TFA20079','BEB80694','BSA11769','BEB19495','TFA14792',
'TFA78043','BSA33484','BEB97471','BEB62362','TFA27311','TFA17715','BEB85146',
'BEB48898','BEB79496','CAR38417','TFA19947','TFA58799','CAR94811','BSA59251',
'BEB15385','BEB24213','BEB56262','BSA96915','CAR53454','BEB75073']

Preços:
[
1258.69, 917.65, 1050.26, 414.36, 904.9, 1077.77,
 640.14, 379.92, 1201.62, 1206.15, 1256.34, 729.27,
 1252.72, 432.89, 457.95, 1191.3, 421.77, 1165.32, 1040.62,
 781.12, 1059.19, 1232.68, 1112.44, 1265.35, 575.2, 1150.78,
 544.38, 949.14, 1043.73, 758.28, 398.22, 662.56, 723.15, 468.72,
 366.52, 513.45, 703.74, 421.34, 961.38
]
```

- Resolução:
    
    ```python
    lista_s= []
    lista_b= []
    lista_ps= []
    lista_pb = []
    for i in range(len(produtos)):
        produtos[i]= produtos[i].upper().strip()
        if 'BEB' in produtos[i]:
            lista_b.append(produtos[i])
            lista_pb.append(precos[i])
        if 'TFA' in produtos[i]:
            lista_s.append(produtos[i])
            lista_ps.append(precos[i])
    print('A minha lista de bebidas tem o total de R${} e é : '.format(sum(lista_pb)))
    for i in range(len(lista_b)):
        print('Código: {}. Preço: {}'.format(lista_b[i],lista_pb[i]))
    print('\n\nA minha lista de suplementos tem o total de R${} e é : '.format(sum(lista_ps)))
    for i in range(len(lista_s)):
        print('Código: {}. Preço: {}'.format(lista_s[i],lista_ps[i]))
    ```
    
- Resolução2:
    
    ```python
    from IPython.display import clear_output as co
    produtos = [' beb46275','TFA23962','TFA64715','TFA69555','TFA56743',
    'BSA45510','TFA44968','CAR75448','CAR23596','CAR13490','BEB21365','BEB31623',
    'BSA62419','BEB73344','TFA20079','BEB80694','BSA11769','BEB19495','TFA14792',
    'TFA78043','BSA33484','BEB97471','BEB62362','TFA27311','TFA17715','BEB85146',
    'BEB48898','BEB79496','CAR38417','TFA19947','TFA58799','CAR94811','BSA59251',
    'BEB15385','BEB24213','BEB56262','BSA96915','CAR53454','BEB75073']
    precos=[
    1258.69, 917.65, 1050.26, 414.36, 904.9, 1077.77,
     640.14, 379.92, 1201.62, 1206.15, 1256.34, 729.27,
     1252.72, 432.89, 457.95, 1191.3, 421.77, 1165.32, 1040.62,
     781.12, 1059.19, 1232.68, 1112.44, 1265.35, 575.2, 1150.78,
     544.38, 949.14, 1043.73, 758.28, 398.22, 662.56, 723.15, 468.72,
     366.52, 513.45, 703.74, 421.34, 961.38
    ]
    def ver_bebida():
        if len(produtos) == len(precos):
            for i in range(len(produtos)):#i.strip().upper()
                if 'BEB' in produtos[i].strip().upper():
                    print(f'A Bebida {produtos[i].strip().upper()} Custa R${precos[i]:.2f}')  
    def ver_suplemento():
        if len(produtos) == len(precos):
            for i in range(len(produtos)):#i.strip().upper()
                if 'TFA' in produtos[i].strip().upper():
                    print(f'O Suplemento {produtos[i].strip().upper()} Custa R${precos[i]:.2f}')
    menu = '1-Ver Bebidas\n2-Ver Suplementos\n3-Ver Ambos\n4-Sair\n5-Limpar a tela\n'
    while True:
        escolha = input(menu)
        match escolha:
            case '1':
                ver_bebida()  
            case '2':
                ver_suplemento()
            case '3':
                ver_bebida() 
                ver_suplemento()
            case '4':
                break
            case '5':
                co()
    ```
    

### Exercício:

**Exercício com `while` em Python - Nível Difícil:**

**Descrição:**

Desenvolva um programa que simule um jogo de adivinhação. O programa escolhe um número aleatório entre 1 e 100 (inclusive) e o jogador deve tentar adivinhar esse número. O programa fornece dicas ao jogador, indicando se o número digitado é maior ou menor que o número aleatório. O jogo continua até que o jogador acerte o número ou decida sair.

### Resolução:

```python
from random import randint
numeroadivinhar = randint(1,100)
chute = 101
continuar = ''
while continuar != 'n':
    while numeroadivinhar != chute:
        chute = int(input('qual número você acha que é? '))
        if chute > numeroadivinhar:
            print('O número que você chutou é alto demais')
        elif chute < numeroadivinhar:
            print('O número que você chutou é baixo demais')
    print('Você acertou miseravi')
    numeroadivinhar = randint(1,100)
    chute = 1
    continuar = input('desejar continuar? s/n')
```

# 🧱⚔️ **Nível 7 — Funções (Skills do Herói)**

## 📘 **Capítulo 18 — Funções (`def`)**

### 🧠Introdução - habilidades no RPG

imagine que seu heroi tem habilidades:

- ⚔ atacar()
- 🩹  curar()
- 🛡 defender()

voce nao quer reescrever o codigo toda vez entao criamos:

#### ⚔ Funções

### 📌 Definição

Uma função é um bloco de codigo reutilizavel

#### ⚙ Sintaxe

```python
def nome da funçao( ):
		#codigo
		
```

### 🎮 Exemplo RPG

```python
def atacar():
	print("O heroi atacou!")
```

### ▶Chamando a funçao

```python
atacar()
```

### 🧠Importante

Definir ≠ executar

so executa quando chama

### ⚔ return - Retorno da função

#### Definição

o **return** envia um valor de volta

#### 🎮 Exemplo RPG

```python
def dano():
	return 10
print(dano())
```

🧠 Interpretação

A função devolve o valor

voce pode usar depois

#### Exemplo melhor

```python
def somar(n1, n2):
		return n1 + n2

resultado = somar(10, 5)
print(resultado)
```

### **⚠️ Variáveis dentro da função**

#### Erro comum (seu exemplo)

```python
def cadastrar_produto():
		produto = input("nome: ")
		
cadastrar_produto()
print(produto) #erro
```

## 🧠 Por quê?

👉 A variável existe **só dentro da função**

## ✔️ Correto

```python
def cadastrar_produto():
	produto = input("Nome: ")
	return produto

prod = cadastrar_produto()
print(prod)
```

### ⚔️ Argumentos (Parâmetros)

#### 📌 Definição

São valores que a função recebe

#### 🎮 Exemplo RPG

```python
def atacar(dano)
		print("Ataque caousou {} de dano".format(dano))

atacar(50)
```

### ⚠️ Argumentos posicionais

#### 🎮 Exemplo

```python
def somar(n1, n2, n3):
		return n1 + n2 + n3
	
print(somar(10,20,30))
```

## 🧠 Importante

👉 Ordem importa!

### ⚔️ Argumentos padrão

#### 🎮 Exemplo RPG

```python
def atacar(dano=10):
	print(f"dano causado: {dano}")
	
atacar() #usa 10
atacar(50) #usa 50
```

### ⚔️ Argumentos nomeados (keyword)

#### 🎮 Exemplo

```python
def personagem(nome, classe):
		print(f"{nome} é um {classe}")
	
personagem(nome= "WaaRsk8", classe= "Guerreiro")
```

### 🧠 Função retornando múltiplos valores

---

#### 🎮 Exemplo RPG

```python
def status():
return "Arthas", 100

nome, vida = status()

print(nome)
print(vida)
```

#### 🧠 Interpretação

 Retorna uma **tupla**

### 🏆 Exemplo completo (adaptado para RPG)

### 🎮 Sistema de meta (seu exercício melhorado)

```python
def calculo_meta(meta,vendas):
bateram = []

for jogador in vendas:
		if vendas[jogador] >= meta:
			bateram.append(jogador)

percentual = len(bateram) / len(vendas)

return percentual, bateram

meta = 10000

vendas= {
"WaaRsk8": 15000,
"Arragorn": 27000,
"Draco": 9900
}

p, lista = calculo_meta(meta, vendas)

print(p)
print(lista)
```

# 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Ataque

Crie:

- função atacar()

## 🥈 Missão 2 — Soma

Crie:

- função que soma 2 números

## 🥇 Missão 3 — Sistema de dano

Crie:

- função com argumento dano

## 💎 Missão 4 — Sistema completo

Crie:

- função que retorna:
    - nome
    - vida

### ⚠️ Dicas do Mestre

- Função = reutilização
- Sempre prefira `return` ao invés de `print`
- Evite `input()` dentro da função
- Use argumentos

## 📘 **Capítulo 19 — Docstrings (Documentação da Função)**

## 🧠 Introdução

A **docstring** é um texto dentro da funçao que explica:

- o que ela faz
- quais parâmetros recebe
- o que retorn

É literalmente o **manual da sua função**

⚙ Sintaxe

```python
def minha_função():
	"""
	Descrição da função
	"""
```

#### 🎮 Exemplo RPG

```python

def atacar(dano):

"""
Realiza um ataque no inimigo.

Parametros:
dano (int): quantidade de dano causado

Retorno:
none
"""
print(f"Ataque causou {dano} de dano!")
```

#### 🧠 Interpretação

A docstring fica logo abaixo do def

usa 3 aspas (”””)

#### 📌 Exemplo com retorno

```python
def somar(n1, n2):
    """
    Soma dois números.

    Parâmetros:
    n1 (int): primeiro número
    n2 (int): segundo número

    Retorno:
    int: resultado da soma
    """
    return n1 + n2
```

### 🔍 Como visualizar a docstring

```python
print(somar.__doc__)
```

ou no Python interativo:

```python
help(somar)
```

#### 🧠 Boas práticas

✔ Seja claro e direto

✔ Explique parâmetros

✔ Explique retorno

✔ Use sempre em funções importantes

---

#### ⚠️ Erro comum

❌ Não documentar:

```python
def calc(x,y):
return x * y
```

✔ Melhor:

```python
def calc(x,y):
		"""
    Multiplica dois números.

    Parâmetros:
    x (int): primeiro valor
    y (int): segundo valor

    Retorno:
    int: resultado da multiplicação
    """
return x * y
```

### 🏰 Missões

## 🥉 Missão 1

Crie:

- função com docstring simples

## 🥈 Missão 2

Crie:

- função com parâmetros + docstring

## 🥇 Missão 3

Crie:

- função com retorno + docstring completa

## 💎 Missão 4

Crie:

- sistema RPG com funções documentadas

### Exercícios progressivos:

```python
Lista exercicios funcao:
1- Crie uma função que pergunte o nome de uma pessoa 
(input dentro da função) e printe uma mensagem: 
    "Feliz aniversário <pessoa>"
2- Utilizando como base a função do Ex.1, faça com
que ela se repita 3 vezes.
3- Utilizando como base a função do Ex.1, faça com 
que, ao invés de printar, ele retorne a mensagem.
Salve essa mensagem em uma variável do seu programa
e deixe todas as letras em maiúsculo antes de imprimir
4- utilizando while True, faça um menu de funções:
<1- Soma>,<2-Subtração>,<3-Multiplicação>,<4-Divisão>,
<5-Sair>; O usuário deve decidir o que fazer com base
neste menu. 
5 - Recrie, a partir do 2, todos os programas anteriores, 
agora sem qualquer print/input dentro das funções. 
6 - Crie uma variável <saldo>
Crie as seguintes funções bancárias:
Consultar saldo, sacar, depositar.
Desafio: Crie um sistema de contas (utilizando dicionários
ou listas), com as opções:
Transferência entre contas e limite de crédito pessoal,
além de todas as opções acima para cada conta origem e destino.
```

```python
Lista exercicios funcao:
1- Crie uma função que pergunte o nome de uma pessoa 
(input dentro da função) e printe uma mensagem: 
    "Feliz aniversário <pessoa>"
2- Utilizando como base a função do Ex.1, faça com
que ela se repita 3 vezes.
3- Utilizando como base a função do Ex.1, faça com 
que, ao invés de printar, ele retorne a mensagem.
Salve essa mensagem em uma variável do seu programa
e deixe todas as letras em maiúsculo antes de imprimir
4- utilizando while True, faça um menu de funções:
<1- Soma>,<2-Subtração>,<3-Multiplicação>,<4-Divisão>,
<5-Sair>; O usuário deve decidir o que fazer com base
neste menu. 
5 - Recrie, a partir do 2, todos os programas anteriores, 
agora sem qualquer print/input dentro das funções. 
6 - Crie uma variável <saldo>
Crie as seguintes funções bancárias:
Consultar saldo, sacar, depositar.
Desafio: Crie um sistema de contas (utilizando dicionários
ou listas), com as opções:
Transferência entre contas e limite de crédito pessoal,
além de todas as opções acima para cada conta origem e destino.
```

- Respostas:
    
    ```python
    #1
    def felizaniversario():
        nome = input('Informe seu nome')
        print('Feliz aniversário {}'.format(nome))
    felizaniversario()
    #2
    felizaniversario()
    felizaniversario()
    felizaniversario()
    #3
    def felizaniversario():
        nome = input('Informe seu nome')
        texto = 'Feliz aniversário {}'.format(nome)
        return texto
    textinho = felizaniversario()
    print(textinho.upper())
    #4
    def soma():
        resultado = n1+n2
        print(resultado)
    def subtracao():
        resultado = n1-n2
        print(resultado)
    def multiplicacao():
        resultado = n1/n2
        print(resultado)
    def divisao():
        resultado = n1*n2
        print(resultado)
    
    while True:
        n1,n2 = float(input('n1\n')),float(input('n2\n'))
        opcao = int(input('''Escolha 1 opção:
        <1- Soma>
        <2-Subtração>
        <3-Multiplicação>
        <4-Divisão>
        <5-Sair>
        '''))
        match opcao:
            case 1:
                soma()
            case 2:
                subtracao()
            case 3:
                multiplicacao()  
            case 4:
                divisao()
            case 5:
                break
    #6
    def consultar(saldo):
        return saldo
    def sacar(saldo,valor):
        return saldo - valor
    def depositar(saldo,valor):
        return saldo + valor
    menu = '1-Consultar\n2-Depositar\n3-Sacar\n'
    saldo = 500
    escolha = int(input(menu))
    match escolha:
        case 1:
            print(f'Novo saldo: R${:.2fconsultar(saldo)}')
        case 2:
            valor = float(input('Informe o valor: '))
            saldo = depositar(saldo,valor)
            print('Novo saldo: R${:.2f}'.format(saldo))
        case 3:
            valor = float(input('Informe o valor: '))
            saldo = sacar(saldo,valor)
            print('Novo saldo: R${:.2f}'.format(saldo))
    ```
    

### Exercícios:

### 1

- Crie uma função que pergunte o nome do aniversariante e print bom dia <nome>
- Utilizando essa mesma função, faça com que, ao invés de ela printar a 
mensagem, ela retorne a mensagem, salvando numa variável de texto e deixando
tudo em letras maiúsculas.
Desafio:
parte 1- Crie uma que repita 3 vezes a pergunta/resposta do parabéns
parte 2- Repita 3x a pergunta e printe só no final
parte 3- Repita 3x, salve em 3 variáveis diferentes e print tudo no programa 
principal.

```python

```

### Exercício: Vamos criar uma calculadora!

Crie quatro funções, uma parada cada operação básica!

Essas funções devem receber dois números de ponto flutuante como argumentos, retornar um resultado e imprimir, por exemplo, “o resultado da sua multiplicação é: “….

```python
def salarioliquido(salario,*impostos):
    return salario - sum(impostos)
Sliq = salarioliquido(11500,1500,900,4000,2000)
print(Sliq)
```

### Exercício:

Crie uma função que, dada uma lista de produtos qualquer, ela cadastre em listas já existentes as bebidas alcoólicas e os suplementos (BEB e TFA). Parte 2: Passar como argumento também o código da categoria.

```python
Lista: 
produtos = ['beb46275','TFA23962','TFA64715','TFA69555','TFA56743',
'BSA45510','TFA44968','CAR75448','CAR23596','CAR13490','BEB21365','BEB31623',
'BSA62419','BEB73344','TFA20079','BEB80694','BSA11769','BEB19495','TFA14792',
'TFA78043','BSA33484','BEB97471','BEB62362','TFA27311','TFA17715','BEB85146',
'BEB48898','BEB79496','CAR38417','TFA19947','TFA58799','CAR94811','BSA59251',
'BEB15385','BEB24213','BEB56262','BSA96915','CAR53454','BEB75073']

Preços:
[
1258.69, 917.65, 1050.26, 414.36, 904.9, 1077.77,
 640.14, 379.92, 1201.62, 1206.15, 1256.34, 729.27,
 1252.72, 432.89, 457.95, 1191.3, 421.77, 1165.32, 1040.62,
 781.12, 1059.19, 1232.68, 1112.44, 1265.35, 575.2, 1150.78,
 544.38, 949.14, 1043.73, 758.28, 398.22, 662.56, 723.15, 468.72,
 366.52, 513.45, 703.74, 421.34, 961.38
]
```

- Resposta
    
    ```python
    def ehalcoolico(bebida):
        bebida = bebida.upper()
        if 'BEB' in bebida:
            return True
        else:
            return False
    for produto in produtos:
        if ehalcoolico(produto):
            print('Enviar {} para setor de bebidas alcóolicas'.format(produto))
    #NOTE QUE AS BEBIDAS NÃO ESTÃO EM LETRA MAIÚSCULA, POIS ISSO SÓ ACONTECEU DENTRO DA FUNÇÃO
    ```
    
    ```python
    def ehalc(lista):
        for prod in lista:
            prod = prod.upper()
            if 'BEB' in prod:
                bibidas.append(prod)
    bibidas = []
    --
    ehalc(produtos)
    print(bibidas)
    ```
    

```python
#Criar um programa que cadastre em uma lista todos os produtos digitados pelo
#usuário
---
#transformar esse programa numa função chamada caditem que crie a mesma lista
---
#fazer com que este programa trate o texto inserido (strip, casefold, trocar
#espaços duplos por espaços simples)
def caditem():
    for i in range(99):
        produto = input('digite o produto: ')
        if produto != '':
            produtos.append(produto)
        else:
            break
```

### Ex

```python
def tratar(email):
    '''A minha funcion é a vergonha
    da pofisison'''
    if '@' in email:
        email = email.strip().casefold()
        return email
    else:
        print('digite o email corretamente')
---
print('Email tratado: {}'.format(tratar(input('Digite seu email'))))
```

### Desafio: Criando uma calculadora interativa:

```python
from IPython.display import clear_output as marcia
def soma(total,n):
    return total+n
def mult(total,n):
    if total == 0: 
        total = 1
    return total*n
total = 0
while True:
    escolha = int(input(menu))
    if escolha == 5: break
    marcia()
    match escolha:
        case 1:
            while True:
                try:
                    n = int(input('número:\n(enter para sair) '))
                    total = soma(total,n)
                    marcia()
                    print(f"O resultado é: {total}")
                except:
                    break
        case 2:
            while True:
                try:
                    n = int(input('número:\n(enter para sair) '))
                    total = mult(total,n)
                    marcia()
                    print(f"O resultado é: {total}")
                except:
                    marcia()
                    break   
        case 6:
            total = 0
```

- *Extra: Diferença entre usar a função com ou sem o parênteses -usá-la como objeto- e função recursiva:*
    
    ## A Diferença entre `nomedafunção()` e `nomedafunção` em Python
    
    **Em Python, a maneira como você chama uma função faz toda a diferença.**
    
    ### Chamando a função com parênteses: `nomedafunção()`
    
    - **Executa a função:** Ao adicionar os parênteses, você está explicitamente dizendo ao Python para executar a função.
    - **Passa argumentos:** Dentro dos parênteses, você pode passar os argumentos necessários para a função realizar seu trabalho.
    - **Retorna um valor:** Se a função tiver um valor de retorno, este será o resultado da expressão `nomedafunção()`.
    
    ```python
    def saudacao(nome):
        print(f"Olá, {nome}!")
    
    saudacao("Maria")  # Saída: Olá, Maria!
    ```
    
    ### Referenciando a função sem parênteses: `nomedafunção`
    
    - **Não executa a função:** Ao usar o nome da função sem parênteses, você está apenas referenciando a função em si.
    - **Pode ser atribuído a uma variável:** Você pode atribuir a função a uma variável para usá-la posteriormente.
    - **É um objeto:** Em Python, as funções são objetos de primeira classe, o que significa que você pode tratá-las como qualquer outro objeto (passar como argumento, retornar de outra função, etc.).
    
    ```python
    def saudacao(nome):
        print(f"Olá, {nome}!")
    
    minha_funcao = saudacao
    minha_funcao("João")  # Saída: Olá, João!
    ```
    
    Forma de chamadaO que acontece
    
    ```
    nomedafunção()
    ```
    
    A função é executada com os argumentos fornecidos.
    
    ```
    nomedafunção
    ```
    
    A função é referenciada como um objeto.
    
    **Quando usar cada forma:**
    
    - **`nomedafunção()`:** Quando você precisa executar a função e obter o resultado ou um efeito colateral (como imprimir algo na tela).
    - **`nomedafunção`:** Quando você precisa passar a função como argumento para outra função, atribuí-la a uma variável ou usá-la em outras operações que envolvam funções como objetos.
    
    **Exemplo de uso avançado:**
    
    Python
    
    ```python
    def aplicar_funcao(funcao, valor):
        resultado = funcao(valor)
        return resultado
    
    def dobro(x):
        return x * 2
    
    resultado = aplicar_funcao(dobro, 5)  # Passando a função dobro como argumento
    print(resultado)  # Saída: 10
    ```
    
    ### Função recursiva:
    
    Funções que chamam a si mesmas na definição, exemplo:
    
    ```python
    def fatorial(n):
        if n == 0:
            return 1
        else:
            return n * fatorial(n-1)
    ```
    

# 🧱📦 **Nível 8 — Tuplas (Itens Fixos do Sistema)**

## 📘 **Capítulo 20 — Tuplas (`tuple`)**

### 🧠 Introdução - A “coisa única”

“quando varias coisas precisam virar uma só, nasce uma tupla.”

### 🎮 Exemplo RPG

Imagine que voce quer guardar:

- nome
- vida
- mana

tudo junto em um unico valor

#### ⚙️ Exemplo básico

```python
personagem = ("WaaRsk8", 100, 50)

print(personagem)
print(type(personagem))

#Resultado:
# ("WaaRsk8", 100, 50)
# <class 'tuple'>
```

# 📌 Diferença importante

| Tipo | Símbolo |
| --- | --- |
| Lista | `[ ]` |
| Tupla | `( )` |
| Dicionarios | `{ }` |

### ⚠ Regra principal

🔒 **tuplas sao IMULTAVEIS**

Não podem ser alteradas depois de criadas

### ❌ Exemplo inválido

```python
personagem = ("WaaRsk8", 100)

personagem[1] = 200 # ERRO 💀
```

### 🧠 Criação automática (seu exemplo)

```python
a = 1, 2, 3

print(a)
print(type(a))

# Resultado:
#(1, 2, 3)
#<class 'tuple'>
```

Mesmo sem parênteses, virou tupla

## ⚔️ Unpacking (Desempacotar)

### 📌 Definição

Separar os valores de uma tupla em variaveis

### 🎮 Exemplos RPG

```python
personagem =  ("WaaRsk8", 100, 50)

nome, vida, mana = personagem

print(nome)
print(vida)
print(mana)

#🧠 Resultado
# WaaRsk8
# 100
# 50
```

### ⚠️ Regra do unpacking

Quantidade de variáveis = quantidade de valores

### ❌ Erro

```python
a,b= (1,2,3)# ERRO 💀
```

⚔ Tupla de 1 elemento (pegadinha)

### ❌ Errado

```python
a = (1)
print(type(a)) #int
```

### ✅Correto

```python
a = (1,)
print(type(a))  # tuple
```

## ⚔️ Tuplas no retorno de funções

### 🎮 Exemplo RPG

```python
def status():
		return "WaaRsk8", 100
	
nome, vida = status()

print(nome)
print(vida)
```

## 🧠 Interpretação

👉 Função retorna uma tupla automaticamente

# 🧠 Tuplas no `for`

### 🎮 Exemplo RPG

```python
dados = [
		("WaaRsk8", 100),
		("Arragorn", 80)
]

for nome, vida in dados:
		print(f"{nome} tem {vida} de vida")
```

### 🧩 Comparação com Lista

| Característica | Lista | Tupla |
| --- | --- | --- |
| Editável | ✅ | ❌ |
| Mais rápida | ❌ | ✅ |
| Segurança | ❌ | ✅ |

### 🏰 **Missões (Exercícios RPG)**

## 🥉 Missão 1 — Criar personagem

Crie:

```
("Arthas",100,50)
```

## 🥈 Missão 2 — Unpacking

Separe:

- nome
- vida
- mana

## 🥇 Missão 3 — Função com tupla

Crie função que retorna:

- nome + vida

## 💎 Missão 4 — Sistema completo

Crie:

- lista de tuplas (personagens)

👉 Mostre:

- nome e vida de cada um

### ⚠️ Dicas do Mestre

- Tupla = dados fixos
- Lista = dados que mudam
- Unpacking é MUITO usado
- Funções retornam tuplas naturalmente

# 🧱📚 **Nível 9 — Dicionários (Sistema de Atributos)**

## 📘 **Capítulo 21 — Dicionários (`dict`)**

### 🧠 Introdução - ficha do personagem

No RPG, um personagem não é so um valor:

- Nome
- Vida
- Mana
- Classe

Precisamos ligar **informação + valor**

para isso usamos:

**📚Dicionarios**

### 📌 Definição

Um dicionario guarda dados no formato:

**chave → valor**

#### ⚙ Sintaxe

```python
dicionario = {
			"chave": valor
	}
```

#### 🎮Exemplo RPG

```python
personagem = {
			"nome": "WaaRsk8",
			"vida": 100,
			"mana": 50
}
```

### 🔍 Acessando valores

## 🎮 Exemplo

```python
print(personagem["nome"])
print(personagem["vida"])

#📌 Resultado:

# WaaRsk8
# 100
```

## 🧠 Importante

👉 Você NÃO acessa por índice

👉 Você acessa pela **chave**

### ⚠️ Regras importantes

#### ❌ Não pode repetir chave

```python
dic= {
		"vida":100,
		"vida":200 #sobrescreve
}

#Resultado:
#{"vida": 200}
```

## ✔️ Valores podem repetir

```python
dic= {
		"item1":100,
		"item2":100
}
```

### **⚔️ Adicionando valores**

#### 🎮 Exemplo RPG

```python
personagem = {
			"nome": "WaaRsk8",
			"vida": 100
}

personagem["mana"] = 50

print(personagem)

#Resultado
#{"nome": "WaaRsk8", "vida": 100, "mana": 50}
```

### 🔄 Atualizando valores

#### 🎮 Exemplo RPG

```python
personagem["vida"] = 200

print(personagem)

#Resultado
#{"nome": "WaaRsk8", "vida": 200, "mana": 50}
```

## 🧠 Interpretação

- Se a chave existe → atualiza
- Se não existe → cria

### ⚔️ Percorrendo dicionários (`for`)

#### 🎮 Exemplo RPG

```python
personagem = {
		"nome": "WaaRsk8",
		"vida": 100,
		"mana": 50
}

for chave in personagem
		print(chave)
```

## 🎮Chave + valor

```python
for chave, valor in personagem.items():
		print(f"{chave}: {valor}")
		
		#Resultado:
		#Nome: WaaRsk8
		#vida: 100
		#nome: 50
```

## ⚔ Métodos importantes

### 📌 .keys()

```python
print(personagem.keys())

#mostrar chaves
```

### 📌 .values()

```python
print(personagem.values())

#mostrar os valores

```

### 📌 .items()

```python
print(personagem.items())

#mostra chave + valor
```

## ⚠ Erro comum

### ❌ Chave inexistente

```python
print(personagem["ouro"]) #erro 💀💀
```

✔ forma segura

```python
print(personagem.get("outo"))

#retorna None ao ivnes de erro

```

## 🧪 Tipos misturados (Avançado)

Você não precisa usar só texto ou número.

Um Dicionario pode ter qualquer tipo de valor:

```python
personagem = {
"nome": "WaaRsk8", #string
"Vida": 100, #int
"itens": ["espada", "poção"], #lista
"status": {"forca": 10, "defesa": 8} #dicionario
}
```

- lista dentro de dicionário
- dicionario dentro de dicionario
- Isso é muito usado em jogos

## ⚔ Métodos avançados de dicionario

Agora voce vai desbloquear habilidades de nivel mais alto:

🧹 **.clear() - Reset total**

```python
personagem.clear() #remove tudo
```

**📋 .copy() - Clonar personagem**

```python
copia = personagem.copy() #Evita bugs ao modificar original
```

🎯 **.get() - Acesso seguro**

```python
print(personagem.get("ouro")) #Não quebra o programa
```

🗑 **.pop() - Remove item**

```python
personagem.pop("mana") #remove e retorna valor
```

🎲 **.popitem() - Remove último**

```python
personagem.popitem()
```

⚙ **.upgrade() - Atualizar vários**

```python
personagem.update({"vida": 200, "mana": 80})
```

🧱 .**setdefault() - cria se nao existir**

```python
personagem.setdefault("ouro", 0) #muito usado em sistemas
```

🧬 **.fromkeys() - criar estrutura base**

```python
	chaves = ["vida", "mana", "stamina"]
	
	status = dict.fromkeys(chaves, 0)
	
	#criar tudo com valor padrão
```

⚔**percorrendo tudo**

```python
for chave, valor in personagem.items():
		print(f"{chave}: {valor}")
```

# 🎮 MISSÕES (EXERCÍCIOS)

## 🥉 Missão Bronze — Cadastro de personagem

Crie um dicionário com:

- nome
- classe
- vida
- mana

Depois mostre todos os dados

## 🥈 Missão Prata — Sistema de inventário

Crie um sistema onde:

- usuário adiciona item
- item vira chave
- quantidade vira valor

Ex:

```
{"poção":3}
```

## 🥇 Missão Ouro — Loja RPG

Crie um menu:

1 - Adicionar item

2 - Vender item

3 - Ver estoque

4 - Sair

## 💎 Missão Diamante — Sistema completo (NÍVEL PROFISSIONAL)

Crie um personagem com:

```
personagem= {
"nome":"WaaRsk8",
"status": {
"vida":100,
"mana":50
    },
"inventario": {
"poção":5
    }
}
```

### Regras:

- adicionar item
- remover item
- usar item
- atualizar status

## 👨‍🏫 Exercícios: For, while, dicionário, listas e funções.

## 1. Exercício funções

A partir de uma lista de preços, faça três funções:
Uma para tirar a média dos preços
Outra que encontre o item mais caro da lista
Outra que filtre os preços pares

```python
# Definindo uma função para calcular a média de uma lista de números
def calcular_media(lista):
    soma = 0
    for numero in lista:
        soma += numero
    return soma / len(lista)

# Definindo uma função para encontrar o maior número em uma lista
def encontrar_maior(lista):
    maior = lista[0]
    for numero in lista:
        if numero > maior:
            maior = numero
    return maior

# Definindo uma função para filtrar números pares em uma lista
def filtrar_pares(lista):
    pares = []
    for numero in lista:
        if numero % 2 == 0:
            pares.append(numero)
    return pares

# Exemplo de utilização das funções
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
media = calcular_media(numeros)
maior = encontrar_maior(numeros)
pares = filtrar_pares(numeros)

print("Lista de números:", numeros)
print("Média dos números:", media)
print("Maior número na lista:", maior)
print("Números pares na lista:", pares)
```

Agora imagine que cada loja está á uma determinada distância de sua casa.
Faça uma função que leia o preço e a distância, e a partir disso, descida qual a melhor loja, considerando distância e preço, para se comprar o produto.

```python
Km = [2,9,1,3]
Pr = [9,2,5,3]
Final = []
def km(lista,lista2):
	for i in range(len(lista)):
		med = (lista[i] + lista2[i])/2
		Final.append(med)
	return Final
print(km(Km,Pr))
#Aqui ele está retornando a média entre distância e preço.
```

Agora, utilizando os conceitos de dicionário, faça um código que retorne o nome da loja, ainda de acordo com a média de distância e preço.

dicionário:
Nomes = {mericans:[2,9], leroi:[9,2], senei:[1,5], uni[3,3]}

## 2. Contagem de palavras em uma frase

Você deve criar um programa em Python que conte a quantidade de vezes que cada palavra aparece em uma frase fornecida pelo usuário. Utilize um dicionário para armazenar as palavras e suas contagens. O programa deve solicitar ao usuário que digite uma frase e, em seguida, exibir a contagem de cada palavra presente na frase.

```python
def contar_palavras(frase):
    palavras = frase.split()
    contador = {}
    for palavra in palavras:
        if palavra in contador:
            contador[palavra] += 1
        else:
            contador[palavra] = 1
    return contador

frase = input("Digite uma frase: ")
resultado = contar_palavras(frase)
print("Contagem de palavras:")
for palavra, quantidade in resultado.items():
    print(f"{palavra}: {quantidade}")
```

## 3. Sistema de login com dicionário

Você precisa desenvolver um sistema de login em Python que utilize um dicionário para armazenar os nomes de usuário e suas respectivas senhas. O programa deve solicitar ao usuário que entre com seu nome de usuário e senha. Se as credenciais estiverem corretas, exiba a mensagem "Login bem-sucedido!". Caso contrário, exiba a mensagem "Nome de usuário ou senha incorretos. Tente novamente." e permita que o usuário tente novamente.

Extra: deixe que o usuário tenha 4 tentativas e bloqueie o acesso.

- Resolução:
    
    ```python
    usuarios = {'usuario1': 'senha1', 'usuario2': 'senha2', 'usuario3': 'senha3'}
    
    while True:
        usuario = input("Digite o nome de usuário: ")
        senha = input("Digite a senha: ")
        if usuario in usuarios and usuarios[usuario] == senha:
            print("Login bem-sucedido!")
            break
        else:
            print("Nome de usuário ou senha incorretos. Tente novamente.")
    ```
    

### Desafio: Sistema de Login

Sistema de login:
Crie um sistema onde o usuário terá que digitar o login x’e, caso este login não esteja no sistema, você deve informar usuário não cadastrado. Caso contrário peça a senha e, se estiver tudo correto, informe "Login efetuado com sucesso!". Caso contrário, senha incorreta '''em 3 tentativas o acesso
será bloqueado'''. Caso o login efetuado seja o do administrador, deve-se abrir um menu de opções, sendo:
1- Cadastro de novos usuários
2- Remoção de usuários
3- Imprimir lista de usuários
4- Troca de senha de admin #esta operação deve pedir uma confirmação da senha antiga e 2 vezes a nova senha para garantir que o administrador acertou sua nova senha.

- Resposta Parcial:
    
    ```python
    
    def cadastrar():
        login = input('Digite o novo login: ')
        if login not in lusers:
            senha = input('Digite a nova senha: ')
            lusers[login] = senha
        else:
            print('usuário já cadastrado')
    def remover():
        login = input('Digite o usuário: ')
        if login not in lusers:
            print('login não encontrado')
        else:
            lusers.pop(login)
            print('login removido com sucesso')
    def imprimir():
        print('Os usuários são:')
        for i in lusers:
            print(i,end =' ')
    def troca():
        senha = input('Digite sua senha antiga: ')
        if senha == ladmins['admin']:
            senha = input('Digite sua nova senha: ')
            if senha == input('Repita sua nova senha '):
                ladmins[login] = senha
    ladmins,lusers,tentativa  = {'admin':'123'} ,{'u1':'11','u2':'22'},3
            
    while True and tentativa >0:
        login = input('Login:\n')
        if login in ladmins:
            while True:
                senha = input('Senha: ')
                if senha == ladmins[login]:
                    while True:
                        menu = input('1-Cadastrar novo usuário\n2-Remover um usuário\n3-Imprimir lista de usuários\n4-Trocar senha\n5-Sair\n')
                        match menu:
                            case '1':
                                cadastrar()    
                            case '2':
                                remover()    
                            case '3':
                                imprimir()
                            case '4':
                                troca()
                            case '5':
                                break
                            case _:
                                print('Digite uma opção válida')
                else:
                    tentativa -=1
                    if tentativa > 0:
                        print('senha incorreta. tentativas:',tentativa)
                    else:
                        print('Acesso bloqueado')
                        break
        elif login in lusers:
            while True:
                senha = input('Senha:\n')
                if senha == lusers[login]:
                    print('login efetuado com sucesso.')
                    break
                else:
                    if tentativa <= 0:
                        print('Número de tentativas excedido.')
                        break
                    print('Digite novamente sua senha. Tentativas:',tentativa)
                    tentativa -=1
            break
        else:
            print('Usuário não encontrado')
    print('Obrigado por utilizar nosso programa.')
    ```
    
- Resposta
    
    ```python
    def adicionar():
        login = input('login: ')
        dusers[login] = input('Senha: ')
    def remover():
        login = input('login a remover: ')
        if dusers.get(login) == None:
            print('Usuário não encontrado')
        else:
            dusers.pop(login)
    def imprimir():
        print('A lista de usuários é: ')
        for i in dusers:
            print(i,end = ' ')    
    def troca(login):
        while True:
            if dadmins[login] == input('Digite a senha antiga'):
                senha = input('Nova Senha: ')
                if senha == input('Repita Nova Senha: '):
                    dadmins[login] = senha
                    print('Senha alterada com sucesso!')
                    break
                else:
                    print('Senhas diferentes')
            else:
                print('Senha incorreta')
    dadmins,dusers = {'admin':'123'},{'u1':'11','u2':'22'}
    tentativa,continuar = 3,True
    while continuar:
        login = input('Login: ')
        if login in dusers:
            while tentativa > 0 and continuar:
                if input('Senha: ') == dusers[login]:
                    print('\n\n****\nLogin efetuado com sucesso!!')
                    break
                else:
                    tentativa -=1
                    print('Novamente. Tentativas:',tentativa)
                    if tentativa <= 0:
                        continuar = False
                        break
                    
            break
        elif login in dadmins:
            while tentativa > 0 and continuar:
                if input('Senha: ') == dadmins[login]:
                    while continuar:
                        match int(input('1-Adicionar Usuário\n2-Remover Usuário\n3-Lista De Usuários\n4-Modificar Senha\n5-Sair\n')):
                            case 1:
                                adicionar()
                            case 2:
                                remover()
                            case 3:
                                imprimir()
                            case 4:
                                troca(login)
                            case 5:
                                continuar = False
                                break
                            case _:
                                print('Digite opção válida')
                else:
                    tentativa -=1
                    print('Novamente. Tentativas: {}'.format(tentativa))
                    if tentativa <= 0:
                        continuar = False
                        break
        else:
            break
    ```
    

## 4. Agenda de contatos

Elabore um programa em Python que simule uma agenda de contatos. Utilize um dicionário para armazenar os contatos, onde as chaves serão os nomes das pessoas e os valores serão os números de telefone. O programa deve oferecer as seguintes opções:

Adicionar um novo contato: solicite ao usuário que digite o nome e o número de telefone do novo contato e adicione-os à agenda.
Procurar um contato: permita que o usuário procure um contato pelo nome e exiba o número de telefone correspondente, se encontrado.
Sair: encerre o programa.
O programa deve rodar até o usuário querer parar.

- Resolução:
    
    ```python
    agenda = {}
    
    while True:
        print("\n1. Adicionar contato")
        print("2. Procurar contato")
        print("3. Sair")
        opcao = input("Escolha uma opção: ")
    
        if opcao == '1':
            nome = input("Digite o nome do contato: ")
            telefone = input("Digite o telefone do contato: ")
            agenda[nome] = telefone
            print("Contato adicionado com sucesso!")
        elif opcao == '2':
            nome = input("Digite o nome do contato que deseja procurar: ")
            if nome in agenda:
                print(f"Telefone de {nome}: {agenda[nome]}")
            else:
                print("Contato não encontrado.")
        elif opcao == '3':
            print("Saindo...")
            break
        else:
            print("Opção inválida. Tente novamente.")
    ```
    

## 5. Exercício de Python: Gerenciador de Estoque

Você foi contratado para desenvolver um sistema de gerenciamento de estoque para uma loja. O sistema deve permitir ao usuário realizar as seguintes operações:

Adicionar um novo item ao estoque, fornecendo o nome do item, quantidade e preço unitário.
Atualizar a quantidade de um item existente no estoque.
Verificar o valor total do estoque.
Sair do programa.
Desenvolva um programa em Python que utilize um dicionário para representar o estoque, onde as chaves são os nomes dos itens e os valores são dicionários contendo a quantidade e o preço unitário de cada item. O programa deve utilizar um loop while para permitir que o usuário execute as operações desejadas até optar por sair.

Ao final de cada operação, exiba uma mensagem de sucesso ou erro, conforme apropriado, e apresente um menu de opções para o usuário escolher a próxima ação.

```python
estoque = {
    'item1': {'quantidade': 100, 'preço': 10.99},
    'item2': {'quantidade': 50, 'preço': 5.99},
    'item3': {'quantidade': 200, 'preço': 20.50},
    'item4': {'quantidade': 75, 'preço': 8.25},
    'item5': {'quantidade': 150, 'preço': 15.75},
    'item6': {'quantidade': 80, 'preço': 6.99},
    'item7': {'quantidade': 120, 'preço': 12.49},
    'item8': {'quantidade': 90, 'preço': 9.99},
    'item9': {'quantidade': 180, 'preço': 18.25},
    'item10': {'quantidade': 60, 'preço': 7.50}
}
```

# 📘 **Capítulo 22 — Bibliotecas em Python**

### 🧠 Introdução — habilidades externas

No RPG, seu personagem pode aprender habilidades novas…

mas nem tudo precisa ser criado do zero.

as vezes voce usa:

- magia antiga 🧙‍♂️
- Artefatos raros 🧿
- Grimorios 📖

no python é igual.

Essas **“habilidades prontas”** são chamadas de **bibliotecas**

#### O que é uma biblioteca?

Uma biblioteca é um conjunto de:

- funções prontas
- ferramentas
- sistemas ja criados

Ou seja: voce não precisa reinventar a roda

#### 📚 Analogia

- Biblioteca = Caderno
- Função = Página

para usar uma função, voce precisa **abrir o caderno**

#### ⚙ Como importar uma biblioteca

```python
import random
```

Agora voce tem acesso aos poderes dessa biblioteca.

#### Usando funçoes da biblioteca

```python
import random

numero = random.randint(1, 10)
print(numero)
```

📌 **Explicação**

- random → biblioteca
- randint → função
- (1, 10) → intervalo

Gera numero aleatorio entre 1 e 10

⚠ **Regra importante**

Sempre usar:

```python
biblioteca.funcao()
```

✔ correto:

```python
random.randint(1, 10)
```

#### ⚔ Forma alternativa (nivel intermediario)

Você pode importa so uma função

```python
from random import randint

print(randint(1, 10))
```

Aqui voce NÃO precisa escrever **random**.

#### ⚠ Quando usar cada forma?

✔ **forma direta (mais pratica)**

```python
from random import randint
```

👉melhor quando usa muito a funçao

#### Exemplo RPG - Sistema de dano

```python
import random

dano = random.randint(5, 15)

print(f"⚔ Voce causou {dano} de dano!")
```

#### Exemplo RPG - Chance crítica

```python
import random

critico = random.randint(1, 100)

if critico ≤ 20:
	print("💥 Critico")
else:
	print("ataque normal")
```

### 🎮 MISSÕES (EXERCÍCIOS)

## 🥉 Missão Bronze — Gerador de número

Crie um programa que:

- gere um número aleatório de 1 a 100
- mostre na tela

---

## 🥈 Missão Prata — Dado RPG 🎲

Simule um dado:

```
1a6
```

---

## 🥇 Missão Ouro — Batalha aleatória

Crie um sistema onde:

- jogador causa dano aleatório
- inimigo também
- mostre quem causou mais dano

---

## 💎 Missão Diamante — Sistema de loot

Crie um sistema onde:

- ao derrotar inimigo
- jogador ganha item aleatório:

```
["espada","poção","ouro","armadura"]
```

### 🧠 Instalação de módulos — trazendo novos poderes

nem todas as biblioteca ja vem com o Python

👉 Algumas são como livros raros da guilda….

e voce precisa buscar elas fora antes de usar.

#### Analogia RPG

- Biblioteca → grimorio
- Modulo nao instalado  → magia bloqueada
- internet → emrcado magico
- pip → sistema de invocação

#### Quando isso acontece?

se voce tentar:

```python
import keyboard
```

e aparece erro:

👉 significa que o módulo **não está instalado**

### ⚔ Como instala modulos

#### 🥉 Metodo 1 - dereto no codigo (jupyter / notion / colab)

```python
!pip install nome_usuario
```

**Exemplo:**

```python
!pip install keyboard
```

👉 O ! indica que voce esta executando um comando do sistema

#### 🥈 Metodo 2 - terminal (modo profissional)

**Passo a passo:**

1. Anrir o menu iniciar
2. Digitar:
    
    ```python
    cmdd
    ```
    
    ou
    
    ```python
    Anaconda Prompt
    ```
    
3. Executar
    
    ```python
    pip install keyboard
    ```
    

#### Interpretação

Voce esta literalmente:

“baixando um poder novo pro seu personagem”

#### Regra importante

**Precisa de internet**

sem conexão → não instala

**Instala so uma vez**

depois de instalado:

```python
import keyboard
```

👉 Ja funciona normalmente

#### ⚔ Renomeando bibliotecas (alias)

você pode dar um “apelido” para a biblioteca:

```python
import keyboard as kb
```

👉 Agora usa assim:

```python
kb.write("Hello")
```

#### Tradução dos comandos

- import → importar
- as → como
- from → de

#### Importando partes especificas

```python
from random import randint
```

👉 Você pega só a função que quer

#### 🎮 Exemplo RPG - magia externa

```python
import rasndo as rd

numero = rd.randint(1, 6)

print(f"🎲 Dado rolado: {numero}")
```

### 🎮 MISSÕES (EXERCÍCIOS)

## 🥉 Missão Bronze — Instalação

- Instale um módulo (ex: `keyboard`)
- Importe ele no código

---

## 🥈 Missão Prata — Teste de módulo

Use:

```
importrandom
```

E gere:

- 3 números aleatórios

---

## 🥇 Missão Ouro — Sistema com alias

- importe `random` como `rd`
- use `rd.randint()`

---

## 💎 Missão Diamante — Módulo externo

- instale um módulo novo
- use ele em um pequeno sistema

### 🎲⚔️ **22.1 — Biblioteca Random (Sistema de Sorte)**

#### 🧠Introdução - sistema de sorte

No RPG. nem tudo é previsivel…

- ataques críticos 💥
- loot aleatorio 🎁
- dano variavel ⚔

👉Tudo isso depende da **sorte**

no python usamos: biblioteca **random**

#### ⚠ Importante (nivel avançado)

👉 O “aleatorio” não é 100% real

é chamado de:

**pseudoaleatorio**

Mas parea jogos e sistemas:

✔ funciona perfeitamente

#### ⚔ **randint() - número inteiro**

Gera um numero inteiro aleatorio:

```python
from random import randint

n = randint(1, 100)
print(n)
```

📌**Interpretação**

👉 Número entre 1 e 100 (inclui os dois)

**Exemplo RPG - dano**

```python
from random import randint

dano = randint(10, 20)

print(f"⚔ Dano causado: {dano}")
```

#### ⚔ uniform() - numero decimal

gera numero com casas decimais:

```python
from import random uniform

n = uniform('.8, 100)
print(n)
```

**🎮 Exemplo RPG - velocidade**

```python
velocidade = uniform(1.0, 2.5)

print(f"Velocidade: {velocidade:.2f}")
```

#### 🎒 choice() - escolha aleatoria

escolhe um item de uma lista:

```python
from random import choice

nomes = ["WaaRsk8", "Arragorn", "Draco", "Demon"]

nome_aleatorio = choice(nomes)

print(nome_aleatorio)
```

**🎮Exemplo RPG - loot**

```python
from random import choice

loot = ["espada", "poção", "ouro", "armadura"]

drop = choice(loot)

print("🎁 Voce encontrou: {drop}") 
```

#### ⚠ Erros comuns

❌**Esquecer import**

```python
randint(1, 10) #Erro
```

❌**Intervalo invertido**

```python
randint(100, 1) #erro
```

❌ Lista vazia no choice

```python
choice([]) #erro
```

### 🎮 MISSÕES

## 🥉 Bronze — Sorte simples

- gere número de 1 a 50

---

## 🥈 Prata — Dado RPG 🎲

- simule dado de 6 lados

---

## 🥇 Ouro — Sistema de loot

- lista de itens
- usar `choice`

---

## 💎 Diamante — Sistema completo

Crie:

- dano aleatório
- chance crítica
- drop aleatório

### 🕹️⚔️ **22.2 — Pygame (Motor do Jogo)**

#### 🧠 Introdução - criando seu proprio mundo

Até agora voce so controlava lógica…

Agora voce vai:

- criar telas 💻
- desenhar objetos 🎨
- contruir jogos 🎮

👉 para isso usamos:

**pygame 🕹**

#### 📦 O que é o Pygame?

uma biblioteca que permite

- criar jogos 2D
- desenhar formas
- usar imagens
- Capturar teclado e mouse

👉É o “motor do seu jogo”

#### ⚙ Instalação

```python
!pip install pygame
```

👉Só precisa rodas uma vez

#### ⚔️ Importações (versão PROFISSIONAL)

```python
importpygame
importsys
```

### ⚠️ Evite isso (má prática):

```python
frompygame.localsimport*
```

👉 Pode causar conflitos

👉 Use só quando souber exatamente o que está fazendo

#### ⚙  Inicialização do jogo

```python
pygame.init()
```

👉 Liga o “motor do jogo”

#### 💻 Criando a tela

```python
tela = pygame.display.set_mode((700, 600))
pygame.display.set_caption("Meu jogo")
```

📌**Explicação:**

- (700, 600) → largura e altura
- nome da janela

#### 🎨Desenhando formas

 **⚪ Circulo**

pygame.draw.circle(tela, (72,217,246), (310,110), 40)

📌 **Parametros:**

1. tela
2. cor (RGB)
3. posição (x, y)
4. raio

🟥 **Retângulo**

```python
pygame.draw.rect(tela, (10,110,10), (100,300,40,50))
```

📌**Parametros:**

1. tela
2. cor (RGB)
3. (x, y, largura, altura)

📏 **Linha**

```python
pygame.draw.line(tela, (255,255,255), (100, 100), (200, 200), 3)
```

📌**Parametros:**

1. tela
2. cor
3. ponto inicial
4. ponto final
5. espessura

 

#### 🔄Atualização a tela

```python
pygame.display.update()
```

👉Sem isso, nada aparece

#### ⚔️ Código base de qualquer jogo

```python
importpygame
importsys

pygame.init()

tela=pygame.display.set_mode((700,600))
pygame.display.set_caption("Meu Jogo")

whileTrue:
foreventoinpygame.event.get():
ifevento.type==pygame.QUIT:
pygame.quit()
sys.exit()

tela.fill((0,0,0))# limpa tela

pygame.draw.circle(tela, (72,217,246), (310,110),40)
pygame.draw.rect(tela, (10,110,10), (100,300,40,50))

pygame.display.update()
```

#### 🧠 Interpretação (IMPORTANTE)

Loop = coração do jogo ❤️

Ele:

- mantém janela aberta
- atualiza tudo
- captura eventos

#### 🎮 Exemplo RPG - HUD simples

```python
vida = 100

#dentro do loop
pygame.draw.rect(tela, (255, 0,0), (20,20,vida,20))
```

👉 Barra de vida

#### 🎮 MISSÕES

## 🥉 Bronze — Primeira tela

- criar janela
- desenhar um círculo

---

## 🥈 Prata — Formas

- desenhar:
    - círculo
    - retângulo
    - linha

---

## 🥇 Ouro — Interface

- fundo preto
- objetos coloridos
- título do jogo

---

## 💎 Diamante — Sistema base de jogo

- loop funcionando
- botão fechar
- múltiplos objetos
- atualização contínua
- 🔁⚔️ **Loop do Jogo (Coração do Sistema)**
    
    #### 🧠 Introdução — o tempo do jogo
    
    No RPG, o mundo não para…
    
    - inimigos se movem
    - animaçoes acontecem
    - ações do jogador sao lidas
    
    👉Isso só acontece porque existe um: **loop do jogo**
    
    📌 **O que é o loop?**
    
    É um ciclo infinito que:
    
    - mantem o jogo rodando
    - atualiza a tela
    - lê ações do jogador
    
    #### 🎮 Sistema de eventos (fila de ações)
    
    tudo que o jogador faz vira um:
    
    👉**evento**
    
    Exemplos:
    
    - clicar no  ❌
    - apertar tecla ⌨
    - mover mouse 🖱
    
    Esses eventos ficam em uma: **fila de eventos**
    
    #### ⚔ Lendo eventos
    
    ```python
    for event in pygame.event.get():
    ```
    
    👉 percorre todos os eventos
    
    #### ❌ Detectando saída (fechar jogo)
    
    ```python
    if event.type == pygame.QUIT:
    	    pygame.quit()
    	    sys.exit()
    ```
    
    #### ⚔️ Código Exemplo
    
    ```python
    import pygame
    import sys
    
    pygame.init()
    
    larg, alt = 640, 480
    tela = pygame.display.set_mode((larg, alt))
    pygame.display.set_caption("Meu Jogo")
    
    while True:
    
        # 🎮 EVENTOS
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
    
        # 🧹 LIMPA TELA
        tela.fill((0, 0, 0))
    
        # 🎨 DESENHO
        pygame.draw.rect(tela, (10,110,10), (200,300,40,50))
        pygame.draw.circle(tela, (10,110,10), (300,300), 15)
        pygame.draw.line(tela, (10,110,110), (100,100), (150,150), 3)
    
        # 🔄 UPDATE
        pygame.display.update()
    ```
    
    #### ⚠️ ERRO comum (IMPORTANTE)
    
    Se você não limpar a tela:
    
    ```python
    tela.fill((0,0,0))
    ```
    
    👉 os desenhos “grudam” na tela (efeito rastro)
    
    #### 🧠 Sistema de coordenadas
    
    ### 📌 Eixo X (normal)
    
    👉 cresce → direita
    
    ### 📌 Eixo Y (invertido)
    
    👉 cresce ↓ para baixo
    
    #### 🎮 Exemplo visual
    
    ```python
    (0,0)  → canto superior esquerdo
    
    X → direita
    Y ↓ baixo
    ```
    
    #### 🎮 Exemplo RPG — movimentação futura
    
    ```python
    x=100
    y=100
    
    # desenhar
    pygame.draw.circle(tela, (255,0,0), (x,y),10)
    ```
    
    👉 depois você altera x e y → personagem anda
    
    #### 🎮 MISSÕES
    
    #### 🥉 Bronze — Loop básico
    
    - criar loop
    - fechar com X
    
    ---
    
    #### 🥈 Prata — Eventos
    
    - detectar clique do mouse (extra)
    
    ---
    
    #### 🥇 Ouro — Tela viva
    
    - limpar tela
    - redesenhar objetos
    
    ---
    
    #### 💎 Diamante — Base de engine
    
    - loop funcionando
    - eventos
    - desenho
    - update
    
    #### ⚔ Estrutura base
    
    ```python
    while True:
    		#eventos
    		#logica
    		#desenho
    		#atualização
    	
    ```
    
    ⚠**Problema sem loop**
    
    Sem loop:
    
    👉 o jogo abre e fecha instantaneamente 💀
    
- 🎮⚔️ **Movimentação (Controle do Personagem)**
    
    #### 🧠 Introdução — dando vida ao personagem
    
    Até agora voce criou o mundo
    
    agora voce vai:
    
    👉Controlar o personagem
    
    No RPG isso significa:
    
    - andar 🚶‍♂️
    - explorar 🗺
    - fugir ou atacar ⚔
    
    #### ⚔ Movimento automatico
    
    podemos mover um objeto alterando sua posição
    
    ```python
    posx += 1
    posy+= 1
    ```
    
    👉Isso acontece a cada frame
    
    🎮 **Exemplo**
    
    ```python
    pygame.draw.rect(tela, (10, 10, 10), (posx, posy, 40, 50))
    
    posx += 1
    posy += 1
    ```
    
    #### ⏱ Controle de FPS
    
    ```python
    clock = pygame.time.clock()
    ```
    
    **dentro do loop:**
    
    ```python
    clock.tick(60) #limita o jogo a 60 FPS
    ```
    
    ⚔ Movimento com teclado
    
    ```python
    teclas = pygame.key.get_pressed()
    
    if teclas[pygame.k_a]:
    	x -=5
    if teclas[pygame.k_d]:
    	x+=5
    if teclas[pygame.k_w]:
    	y-=5
    if teclas[pygame.k_s]:
    	y += 5
    	
    ```
    
    ## 🧠 Regra importante
    
    👉 get_prossed() NÃO é evento
    
    👉 Ele é leitura contínua
    
    ✔ Por isso fica FORA do **for event**
    
    #### ⚔️ Sistema de limites (teleporte de borda)
    
    ```python
    if x > larg:
    	x = -largura_obj
    if x < -larg_obj:
    	x= larg
    if alt > alt:
    	y = -altura_obj
    if y < -altura_obj:
    	y = alt
    ```
    
    #### 🎮 Código COMPLETO
    
    ```python
    import pygame
    import sys 
    
    pygame.init()
    
    larg, alt = 800, 600
    tela = pygame.display.set_mode((larg, alt))
    pygame.display.set_caption("Movimentação")
    
    x, y = 100, 100
    largura, altura = 40, 50
    
    clock = pygame.time.clock()
    
    while True:
    
    	#🎮 Eventos
    	for event in pygame.event.get():
    		if event.type == pygame.QUIT:
    			pygame.quit()
    			sys.exit()
    			
    	#🎮 INPUT
    	teclas = pygame.key.get_pressed()
    	
    	if teclas[pygame.k_a]:
    		x -= 5
    	if teclas[pygame.k_d]:
    		x += 5
    	if teclas[pygame.k_w]:
    		y -= 5
    	if teclas[pygame.k_s]:
    		y += 5
    		
    	#🌍 LIMITES (loop de mapa)
    	if x > larg:
    		x = -largura
    	if < -largura:
    		x = larg
    	if y > alt:
    		y = -altura
    	if y < -altura:
    		y = alt
    		
    	# 🧹 LIMPAR
    	tela.fill((0, 0, 0))
    	
    	# 🎨 DESENHAR
    	pygame.draw.rect(tela, (30,210,210), (x, Y, largura, altura))
    	
    	#🔄 ATUALIZAR
    	pygame.display.update()
    	
    	# ⏱ FPS
    	clock.tick(60)
    ```
    
    ## 🧠Explicação avançada (diferencial)
    
    **FPS (Frames por segundo)**
    
    👉 Quantas vezes o jogo atualiza por segundo:
    
    - 30 FPS → meio travado.
    - 60 FPS → padrão
    - 120+ → ultrafluido
    
    ## 🎮 MISSÕES
    
    ---
    
    ## 🥉 Bronze — Movimento básico
    
    - mover com WASD
    
    ---
    
    ## 🥈 Prata — Limites
    
    - impedir sair da tela OU teleportar
    
    ---
    
    ## 🥇 Ouro — Velocidade
    
    - ajustar velocidade do personagem
    
    ---
    
    ## 💎 Diamante — Sistema de player
    
    Criar:
    
    - posição
    - velocidade
    - controle
    - limites
    - FPS controlado

### **💥⚔️ Capítulo 22.3 — Colisão e Física Básica**

#### 🧠 Introdução — interação entre objetos

Agora seu jogo começa a parecer um jogo REAL

Até aqui:

- objetos existem
- se movem

mas…

👉eles ainda atravessam tudo 💀

Presisamos criar

### 💥 COLISÃO

#### 🎮 O que é colisão?

Colisão é quando:

- player encosta no inimigo 👾
- Tiro acerta algo 🎯
- personagem pega item 🧪

---

### 📦 Sistema Rect

No Pygame, colisões normalmente usam:

```python
pygame.Rect()
```

👉 um retângulo invisível usado para:

- posição
- tamanho
- colisão

---

### ⚔ criando Retângulos

🎮Jogador

```python
player = pygame.React(100, 100, 50, 50)
```

#### 📌Estrutura

```python
(x, y, largura, altura)
```

---

### 👾 Inimigos

```python
inimigo = pygame.Rect(300, 200, 50, 50)
```

---

### 🎨Desenhando os Rects

```python
pygame.draw.rect(tela, (0,255,0), player)
pygame.draw.rect(tela, (255,0,0), inimigo)
```

---

### 💥 Detectando colisão

```python
if player.colliderect(inimigos):
	print("💥 Colisão")
```

---

### 🧠Interpretação

👉 colliderect() retorna:

- True → colidiu
- False → não colidiu

---

### 🎮Exemplo completo

```python
import pygame
import sys

pygame.init()
larg, alt = 800, 600

tela = pygame.display.set_mode((larg, alt))
pygame.display.set_caption("Sistema de Colisão")

Clock = pygame.time.clock()

player = pygame.Rect(100, 100, 50, 50)
inimigos = pygame.Rect(400, 300, 50, 50)

vel = 5

while True:
	# 🎮 Eventos
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			pygame.quit()
			sys.exit()
			
		# ⌨ INPUT
		teclas =  pygame.key.get_pressed()
		
		if teclas[pygame.k_a]:
			player.x -= vel
		
		if teclas[pygame.k_d]:
			player.x += vel
		
		if teclas[pygame.k_w]:
			player.y -= vel
			
		if teclas[pygame.k_s]:
			player.y += vel

			
			
			
			 
```

## 🐼 Pandas

[Pandas Senai.zip](Pandas_Senai.zip)

```python
#jogo adivinha completo 

#instale o !pip install customtkinter

import customtkinter as ctk
from random import randint
import threading
import time

# ── Tema ────────────────────────────────────────────────────────────────────
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# ── Paleta ──────────────────────────────────────────────────────────────────
COR_BG        = "#0d1117"
COR_PAINEL    = "#161b22"
COR_BORDA     = "#30363d"
COR_TEXTO     = "#c9d1d9"
COR_DIMMED    = "#8b949e"
COR_VERDE     = "#3fb950"
COR_AMARELO   = "#d29922"
COR_VERMELHO  = "#f85149"
COR_AZUL      = "#58a6ff"
COR_CIANO     = "#39d0d8"
COR_ENTRADA   = "#21262d"

MAX_TENT = 15

class JogoApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Adivinhe o Número — Jovem Padawan")
        self.geometry("560x720")
        self.resizable(False, False)
        self.configure(fg_color=COR_BG)

        # Estado
        self.num_secreto   = 0
        self.tentativa     = 0
        self.acerto        = False
        self.jogo_ativo    = False
        self.partidas      = 0
        self.vitorias      = 0
        self.melhor        = None

        self._build_ui()
        self._novo_jogo()

    # ── Construção da interface ──────────────────────────────────────────────
    def _build_ui(self):
        # ── Cabeçalho ──
        header = ctk.CTkFrame(self, fg_color=COR_PAINEL, corner_radius=12,
                               border_width=1, border_color=COR_BORDA)
        header.pack(fill="x", padx=16, pady=(16, 8))

        ctk.CTkLabel(header, text="🎯  ADIVINHE O NÚMERO",
                     font=ctk.CTkFont("Courier New", 18, "bold"),
                     text_color=COR_CIANO).pack(pady=(14, 2))
        ctk.CTkLabel(header, text="1  a  1000  ·  até 15 tentativas",
                     font=ctk.CTkFont("Courier New", 12),
                     text_color=COR_DIMMED).pack(pady=(0, 14))

        # ── Estatísticas ──
        stats_frame = ctk.CTkFrame(self, fg_color="transparent")
        stats_frame.pack(fill="x", padx=16, pady=4)
        stats_frame.columnconfigure((0, 1, 2), weight=1)

        self._stat_partidas = self._card_stat(stats_frame, "PARTIDAS", "0", 0)
        self._stat_vitorias = self._card_stat(stats_frame, "VITÓRIAS",  "0", 1)
        self._stat_melhor   = self._card_stat(stats_frame, "MELHOR",    "—", 2)

        # ── Barra de progresso ──
        prog_outer = ctk.CTkFrame(self, fg_color=COR_PAINEL, corner_radius=8,
                                  border_width=1, border_color=COR_BORDA)
        prog_outer.pack(fill="x", padx=16, pady=(8, 4))

        prog_header = ctk.CTkFrame(prog_outer, fg_color="transparent")
        prog_header.pack(fill="x", padx=12, pady=(8, 0))

        ctk.CTkLabel(prog_header, text="Tentativas",
                     font=ctk.CTkFont("Courier New", 11),
                     text_color=COR_DIMMED).pack(side="left")
        self.lbl_tentativas = ctk.CTkLabel(prog_header, text="0 / 15",
                     font=ctk.CTkFont("Courier New", 11, "bold"),
                     text_color=COR_TEXTO)
        self.lbl_tentativas.pack(side="right")

        self.progressbar = ctk.CTkProgressBar(prog_outer, height=10,
                                              corner_radius=5,
                                              fg_color=COR_ENTRADA,
                                              progress_color=COR_VERDE)
        self.progressbar.pack(fill="x", padx=12, pady=(4, 12))
        self.progressbar.set(0)

        # ── Terminal de mensagens ──
        term_frame = ctk.CTkFrame(self, fg_color=COR_PAINEL, corner_radius=12,
                                  border_width=1, border_color=COR_BORDA)
        term_frame.pack(fill="both", expand=True, padx=16, pady=4)

        # Barra decorativa do terminal
        barra = ctk.CTkFrame(term_frame, fg_color="#0d1117", corner_radius=0,
                             height=32)
        barra.pack(fill="x")
        barra.pack_propagate(False)

        dots = ctk.CTkFrame(barra, fg_color="transparent")
        dots.pack(side="left", padx=12, pady=8)
        for cor in ("#ff5f57", "#febc2e", "#28c840"):
            ctk.CTkFrame(dots, width=12, height=12, corner_radius=6,
                         fg_color=cor).pack(side="left", padx=3)
        ctk.CTkLabel(barra, text="jovem-padawan ~ adivinhe-o-numero",
                     font=ctk.CTkFont("Courier New", 11),
                     text_color=COR_DIMMED).pack(side="left", padx=4)

        self.textbox = ctk.CTkTextbox(term_frame, font=ctk.CTkFont("Courier New", 13),
                                       fg_color="#0d1117", text_color=COR_TEXTO,
                                       border_width=0, wrap="word",
                                       state="disabled")
        self.textbox.pack(fill="both", expand=True, padx=0, pady=0)

        # Tags de cor
        self.textbox.tag_config("green",  foreground=COR_VERDE)
        self.textbox.tag_config("yellow", foreground=COR_AMARELO)
        self.textbox.tag_config("red",    foreground=COR_VERMELHO)
        self.textbox.tag_config("blue",   foreground=COR_AZUL)
        self.textbox.tag_config("cyan",   foreground=COR_CIANO)
        self.textbox.tag_config("dim",    foreground=COR_DIMMED)
        self.textbox.tag_config("white",  foreground=COR_TEXTO)

        # ── Área de entrada ──
        entrada_frame = ctk.CTkFrame(self, fg_color=COR_PAINEL, corner_radius=12,
                                     border_width=1, border_color=COR_BORDA)
        entrada_frame.pack(fill="x", padx=16, pady=(4, 8))

        inner = ctk.CTkFrame(entrada_frame, fg_color="transparent")
        inner.pack(fill="x", padx=12, pady=12)

        ctk.CTkLabel(inner, text="$", font=ctk.CTkFont("Courier New", 16, "bold"),
                     text_color=COR_AZUL).pack(side="left", padx=(0, 8))

        self.entry = ctk.CTkEntry(inner, placeholder_text="Digite 1 – 1000...",
                                  font=ctk.CTkFont("Courier New", 14),
                                  fg_color=COR_ENTRADA, border_color=COR_BORDA,
                                  text_color=COR_TEXTO, height=38)
        self.entry.pack(side="left", fill="x", expand=True, padx=(0, 8))
        self.entry.bind("<Return>", lambda e: self._processar())

        self.btn_enviar = ctk.CTkButton(inner, text="Enviar", width=90, height=38,
                                         font=ctk.CTkFont(size=13, weight="bold"),
                                         fg_color="#238636", hover_color="#2ea043",
                                         command=self._processar)
        self.btn_enviar.pack(side="left")

        # ── Botão Novo Jogo ──
        self.btn_novo = ctk.CTkButton(self, text="↺  Jogar Novamente",
                                       font=ctk.CTkFont("Courier New", 13, "bold"),
                                       fg_color=COR_PAINEL, hover_color=COR_ENTRADA,
                                       border_width=1, border_color=COR_BORDA,
                                       text_color=COR_AZUL, height=40,
                                       command=self._novo_jogo, state="disabled")
        self.btn_novo.pack(fill="x", padx=16, pady=(0, 16))

    def _card_stat(self, parent, label, valor, col):
        frame = ctk.CTkFrame(parent, fg_color=COR_PAINEL, corner_radius=10,
                             border_width=1, border_color=COR_BORDA)
        frame.grid(row=0, column=col, padx=4, pady=0, sticky="ew")
        ctk.CTkLabel(frame, text=label, font=ctk.CTkFont(size=10, weight="bold"),
                     text_color=COR_DIMMED).pack(pady=(8, 0))
        lbl = ctk.CTkLabel(frame, text=valor,
                           font=ctk.CTkFont("Courier New", 22, "bold"),
                           text_color=COR_TEXTO)
        lbl.pack(pady=(0, 8))
        return lbl

    # ── Lógica do jogo ───────────────────────────────────────────────────────
    def _novo_jogo(self):
        self.num_secreto = randint(1, 1000)
        self.tentativa   = 0
        self.acerto      = False
        self.jogo_ativo  = True

        self.entry.configure(state="normal")
        self.entry.delete(0, "end")
        self.btn_enviar.configure(state="normal")
        self.btn_novo.configure(state="disabled")
        self._set_progress(0)
        self.lbl_tentativas.configure(text="0 / 15")

        self._limpar_terminal()
        self._println("╔══════════════════════════════════════════╗", "dim")
        self._println("║     ADIVINHE O NÚMERO  —  1 a 1000      ║", "cyan")
        self._println("║   Você tem 15 tentativas.  Boa sorte!   ║", "dim")
        self._println("╚══════════════════════════════════════════╝", "dim")
        self._println("")
        self._println("► Novo número gerado. Qual é ele?", "blue")
        self._println("")
        self.entry.focus()

    def _processar(self):
        if not self.jogo_ativo:
            return

        raw = self.entry.get().strip()
        if not raw.lstrip("-").isdigit():
            self._println("⚠  Digite apenas números inteiros.", "yellow")
            self.entry.delete(0, "end")
            return

        v = int(raw)
        if v < 1 or v > 1000:
            self._println("⚠  O número precisa estar entre 1 e 1000.", "yellow")
            self.entry.delete(0, "end")
            return

        self.tentativa += 1
        restam = MAX_TENT - self.tentativa
        progresso = self.tentativa / MAX_TENT

        self._set_progress(progresso)
        self.lbl_tentativas.configure(text=f"{self.tentativa} / {MAX_TENT}")
        self._println(f"[{self.tentativa:02d}/{MAX_TENT}]  Chute: {v}", "dim")

        if v == self.num_secreto:
            self._println("")
            self._println("✦  PARABÉNS, JOVEM PADAWAN!  ✦", "green")
            self._println(f"   O número era {self.num_secreto} e você acertou"
                          f" na tentativa {self.tentativa}!", "green")
            if self.tentativa <= 5:
                self._println("   Impressionante — você sentiu a Força!", "cyan")
            elif self.tentativa <= 10:
                self._println("   Muito bem! Digno de um Jedi.", "cyan")
            else:
                self._println("   Na última hora, mas valeu!", "cyan")
            self._println("")
            self._finalizar(ganhou=True)

        else:
            direcao = "▲  MAIOR" if v < self.num_secreto else "▼  MENOR"
            cor_dir = "blue" if v < self.num_secreto else "yellow"
            self._println(f"   Dica: o número é {direcao}", cor_dir)

            if restam > 0:
                aviso = "⚠  " if restam <= 3 else "   "
                self._println(f"{aviso}Restam {restam} tentativa{'s' if restam!=1 else ''}.",
                              "yellow" if restam <= 3 else "dim")
            else:
                self._println("")
                self._println("✗  TENTATIVAS ESGOTADAS!", "red")
                self._println(f"   O número secreto era: {self.num_secreto}", "red")
                self._println("   Treine mais, jovem padawan.", "dim")
                self._println("")
                self._finalizar(ganhou=False)

        self.entry.delete(0, "end")

    def _finalizar(self, ganhou: bool):
        self.jogo_ativo = False
        self.partidas += 1
        if ganhou:
            self.vitorias += 1
            if self.melhor is None or self.tentativa < self.melhor:
                self.melhor = self.tentativa

        self._stat_partidas.configure(text=str(self.partidas))
        self._stat_vitorias.configure(text=str(self.vitorias))
        self._stat_melhor.configure(text=str(self.melhor) if self.melhor else "—")

        self.entry.configure(state="disabled")
        self.btn_enviar.configure(state="disabled")
        self.btn_novo.configure(state="normal")

    # ── Helpers de UI ────────────────────────────────────────────────────────
    def _set_progress(self, valor: float):
        self.progressbar.set(valor)
        if valor < 0.5:
            cor = COR_VERDE
        elif valor < 0.8:
            cor = COR_AMARELO
        else:
            cor = COR_VERMELHO
        self.progressbar.configure(progress_color=cor)

    def _println(self, texto: str, tag: str = "white"):
        self.textbox.configure(state="normal")
        self.textbox.insert("end", texto + "\n", tag)
        self.textbox.see("end")
        self.textbox.configure(state="disabled")

    def _limpar_terminal(self):
        self.textbox.configure(state="normal")
        self.textbox.delete("1.0", "end")
        self.textbox.configure(state="disabled")

# ── Ponto de entrada ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    app = JogoApp()
    app.mainloop()
```

# Pandas 🐼

## O que é?

Pandas é uma biblioteca **open-source** (cosdigo aberto) da linguegekm de programação **Python**, projetada especificamente para a **manipulação e analise de dados** estruturados. Ela fornece estruturas de dados de alto desempenho e faceis de usar, sendo uma ferramenta essencial em areaca como ciencia de dados, machine learning e analise estatistica.

- **Estruturas de Dados Fundamentais:** O pandas introduz duas classes principais para lidar com dados:
    - **Series:** Um Array unidimensional rotulado que pode conter qualquer tipo de dado (como inteiros, strings ou objetos Python).
    - **DataFrame:** Uma estrutura bidimensional semelhante a uma tabela de banco de dados ou uma planilha (Excel), organiada em linhas e colunas.
- **Capacidades de Manipulação:** A biblioteca permite explorar, limpar, transformar e processar dados de forma rapida e expressiva. Isso inclui lidar com dados ausentes (NaN), remover duplicatas e realizar operações estatisticas.
- **Integração com formatos de arquivos:** O pandas possui suporte nativo para ler e escrever dados em diversos formatos, como **CSV, EXCEL, SQL, JSON e Parquet.**
- **Visualização de dados:** Ele oferece funcionalidades de plotagem integradas, utilizando o poder da biblioteca Matplotlib para criar graficos (como dispersão, barras e bloxplots) diretamente dos dados.
- **Análise de Séries Temporais:** Possui ferramentas robustas para trabalhar com datas, frequencias e dados indexados no tempo, o que é muiito comum em aplicaçoes financeiras.

## Instalação do pandas

A instalação do **pandas** pode ser realizada utilizando diferentes gerenciadores de pacotes. Os métodos mais comuns são o **conda**, utilizado principalmente em ambientes Anaconda ou Miniconda, e o **pip**, gerenciador padrão de pacotes do Python.

### Instalação via conda

Para ambientes gerenciados pelo **conda**, recomenda-se a utilização do canal **conda-forge**, que disponibiliza pacotes atualizados e compatíveis com diferentes plataformas.

Execute o seguinte comando no terminal:

```bash
conda install -c conda-forge pandas
```

### Instalação via pip

Caso esteja utilizando o **pip**, o pandas pode ser instalado diretamente a partir do **Python Package Index (PyPI)**.

Execute:

```bash
pip install pandas
```

Em alguns ambientes, especialmente quando existem múltiplas versões do Python instaladas, pode ser necessário utilizar o comando associado explicitamente ao Python 3:

```bash
python -m pip install pandas
```

### Instalações específicas

Para cenários que exigem maior controle sobre o ambiente, também é possível instalar uma **versão específica do pandas** ou realizar a instalação diretamente a partir do **código-fonte**.

Nesses casos, consulte a documentação oficial do pandas para obter os procedimentos e requisitos correspondentes à versão desejada.

# Apostila 2:

<aside>
🐍

- **Assunto**
- **Teoria (resumo + exemplos)**
- **Exercícios** (enunciado)
- **Respostas** (código + explicação)

[Logica de programação SENAI ](https://app.notion.com/p/Logica-de-programa-o-SENAI-35d290674c6781c9a66fdf6532eaf817?pvs=21)

</aside>

---

- Módulo 1: Introdução ao Python
    - Teoria
    
    Python é uma linguagem de programação muito popular, conhecida por ser fácil de ler e escrever. Ela é usada em diversas áreas, como desenvolvimento de sites, análise de dados, inteligência artificial e automação de tarefas.
    
    Para começar a programar em Python, você só precisa escrever comandos que o computador consiga entender. O comando mais básico e famoso é o `print()`, que serve para mostrar uma mensagem na tela.
    
    **Exemplo:**
    
    ```python
    **# imprime a frase Olá, Mundo!**
    print("Olá, Mundo!")
    
    Olá, Mundo!
    ```
    
    Quando o computador lê esse código, ele exibe a frase “Olá, Mundo!” na tela.
    
    ### Exercícios
    
    **Exercício 1: Sua primeira mensagem** 
    
    Escreva um código em Python que exiba a mensagem “Estou aprendendo Python!” na tela.
    
    **Resposta:**
    
    ```python
    **# O comando print() é usado para exibir informações na tela.**
    # O texto deve estar entre aspas (simples ou duplas) para que o Python entenda que é uma palavra/frase.
    print("Estou aprendendo Python!")
    
    Estou aprendendo Python!
    ```
    
    **Exercício 2: Apresentação pessoal**
    
    Escreva um código que exiba o seu nome em uma linha e a sua idade na linha seguinte.
    
    **Resposta:**
    
    ```python
    **# Podemos usar o comando print() várias vezes. Cada print() exibe o conteúdo em uma nova linha.**
    print("Meu nome é João.")
    print("Tenho 25 anos.")
    
    Meu nome é João.
    Tenho 25 anos.
    ```
    

---

- Módulo 2: Variáveis e Tipos de Dados
    - Teoria
    
    Variáveis são como “caixinhas” onde guardamos informações para usar mais tarde no nosso código. Cada caixinha tem um nome e um conteúdo.
    
    Em Python, não precisamos dizer que tipo de dado estamos guardando, a linguagem descobre sozinha. Os tipos mais comuns para iniciantes são:
    - **String (str):** Textos (sempre entre aspas). Ex: `"Maria"`
    - **Integer (int):** Números inteiros (sem casas decimais). Ex: `10`
    - **Float (float):** Números com casas decimais (usamos ponto em vez de vírgula). Ex: `1.75`
    - **Boolean (bool):** Verdadeiro (`True`) ou Falso (`False`).
    
    **Exemplo:**
    
    ```python
    **# Exemplo de Tipos comuns de varaiáveis.**
    nome = "Ana"      # Isso é uma String
    idade = 30        # Isso é um Integer
    altura = 1.65     # Isso é um Float
    estuda = True     # Isso é um Boolean
    ```
    
    ### Exercícios
    
    **Exercício 1: Criando variáveis**
    
    Crie uma variável chamada `cidade` e guarde o nome da sua cidade nela. Depois, exiba o valor dessa variável na tela.
    
    **Resposta:**
    
    ```python
    **# Criamos a variável 'cidade' e atribuímos o valor "São Paulo" a ela.**
    cidade = "São Paulo"
    
    **# Usamos o print() passando o nome da variável (sem aspas) para exibir o que está guardado nela.**
    print(cidade)
    
    São Paulo
    ```
    
    **Exercício 2: Tipos diferentes**
    
    Crie três variáveis: uma para o nome de um animal (texto), uma para a quantidade de patas (número inteiro) e uma para o peso dele (número com decimal). Exiba as três variáveis.
    
    **Resposta:**
    
    ```python
    **# Utilizando diferentes tipos de varáveis.**
    # Criando as variáveis com seus respectivos tipos de dados
    animal = "Cachorro"  # Tipo String (texto)
    patas = 4            # Tipo Integer (número inteiro)
    peso = 15.5          # Tipo Float (número decimal, note o uso do ponto)
    
    # Exibindo os valores
    print(animal)
    print(patas)
    print(peso)
    
    Cachorro
    4
    15.5
    ```
    

---

- Módulo 3: Strings (Textos)
    
    ### Teoria
    
    Strings são sequências de caracteres (letras, números, símbolos) usadas para representar textos. Em Python, podemos juntar (concatenar) strings, repetir e até formatar para colocar variáveis no meio do texto de forma fácil usando o `f-string`.
    
    Para usar uma `f-string`, basta colocar a letra `f` antes das aspas e colocar as variáveis entre chaves `{}`.
    
    **Exemplo:**
    
    ```python
    nome = "Gatti"
    idade = 51
    # Usando f-string para juntar texto e variáveis
    mensagem = f"Olá, meu nome é{nome} e eu tenho{idade} anos."
    print(mensagem)
    
    Olá, meu nome é Gatti e eu tenho 51 anos.
    ```
    
    ### Exercícios
    
    **Exercício 1: Juntando textos**
    
    Crie uma variável `primeiro_nome` e outra `sobrenome`. Junte as duas em uma terceira variável chamada `nome_completo` e exiba o resultado.
    
    **Resposta:**
    
    ```python
    primeiro_nome = "Mauricio"
    sobrenome = "Gatti"
    
    # Podemos juntar strings usando o sinal de +.
    # Adicionamos " " (um espaço em branco) no meio para os nomes não ficarem grudados.
    nome_completo = primeiro_nome + " " + sobrenome
    
    print(nome_completo)
    
    Mauricio Gatti
    ```
    
    **Exercício 2: Mensagem formatada**
    
    Crie variáveis para `filme_favorito` e `ano_lancamento`. Use uma `f-string` para exibir a frase: “Meu filme favorito é [filme] e ele foi lançado em [ano].”
    
    **Resposta:**
    
    ```python
    filme_favorito = "De volta para o futuro"
    ano_lancamento = 1985
    
    # O f antes das aspas permite que o Python substitua o que está entre {} pelo valor da variável.
    # Isso torna o código muito mais limpo e fácil de ler.
    frase = f"Meu filme favorito é{filme_favorito} e ele foi lançado em{ano_lancamento}."
    
    print(frase)
    
    Meu filme favorito é De volta para o futuro  e ele foi lançado em 1985.
    ```
    

---

- Módulo 4: Operadores Matemáticos
    
    ### Teoria
    
    O Python pode funcionar como uma calculadora poderosa. Os operadores matemáticos básicos são:
    - Adição: `+`
    - Subtração: `-`
    - Multiplicação: `*`
    - Divisão: `/` (sempre retorna um número decimal/float)
    - Divisão inteira: `//` (ignora as casas decimais)
    - Resto da divisão: `%` (mostra o que sobra de uma divisão)
    - Exponenciação (potência): `**`
    
    **Exemplo:**
    
    ```python
    soma = 10 + 5       # 15
    multiplica = 10 * 2 # 20
    potencia = 2 ** 3   # 8 (2 elevado a 3)
    ```
    
    ### Exercícios
    
    **Exercício 1: Calculadora simples**
    
    Crie duas variáveis com os números 15 e 4. Calcule e exiba a soma, a subtração e a multiplicação entre eles.
    
    **Resposta:**
    
    ```python
    numero1 = 15
    numero2 = 4
    
    # Realizando as operações matemáticas e guardando em novas variáveis
    soma = numero1 + numero2
    subtracao = numero1 - numero2
    multiplicacao = numero1 * numero2
    
    # Exibindo os resultados
    print(f"Soma:{soma}")
    print(f"Subtração:{subtracao}")
    print(f"Multiplicação:{multiplicacao}")
    ```
    
    **Exercício 2: Divisão de pizza**
    
    Você tem 8 pedaços de pizza e quer dividir igualmente entre 3 pessoas. Calcule quantos pedaços inteiros cada pessoa vai comer e quantos pedaços vão sobrar.
    
    **Resposta:**
    
    ```python
    pedacos = 8
    pessoas = 3
    
    **# A divisão inteira (//) nos diz quantos pedaços inteiros cada um recebe**
    pedacos_por_pessoa = pedacos // pessoas
    
    **# O resto da divisão (%) nos diz quanto sobra após a divisão igualitária**
    sobra = pedacos % pessoas
    
    print(f"Cada pessoa come {pedacos_por_pessoa} pedaços.")
    print(f"Sobram {sobra} pedaços na caixa.")
    
    Cada pessoa come 2 pedaços.
    Sobram 2 pedaços na caixa.
    ```
    

---

- Módulo 5: Condicionais (if, elif, else)
    
    ### Teoria
    
    Muitas vezes, queremos que o nosso programa tome decisões. Para isso, usamos as estruturas condicionais:
    - `if` (se): Executa um bloco de código se a condição for verdadeira.
    - `elif` (senão se): Testa uma nova condição se a anterior for falsa.
    - `else` (senão): Executa um bloco de código se todas as condições anteriores forem falsas.
    
    **Importante:** Em Python, o código que está dentro de uma condição precisa ter um espaço no começo da linha (chamamos isso de **indentação**).
    
    **Exemplo:**
    
    ```python
    idade = 18
    
    if idade >= 18:
        print("Você é maior de idade.")
    else:
        print("Você é menor de idade.")
        
        Você é maior de idade.
        **# Retorna a idade coforme a atribuição/ valor da variável**
    ```
    
    ### Exercícios
    
    **Exercício 1: Pode votar?**
    
    Crie uma variável `idade` com um valor numérico. Se a idade for 16 ou mais, exiba “Você já pode votar!”. Caso contrário, exiba “Você ainda não pode votar.”.
    
    **Resposta:**
    
    ```python
    idade = 15
    
    # O operador >= significa "maior ou igual a"
    if idade >= 16:
        # Este código só roda se a condição acima for True (Verdadeira)
        print("Você já pode votar!")
    else:
        # Este código roda se a condição do 'if' for False (Falsa)
        print("Você ainda não pode votar.")
        
        Você ainda não pode votar.
    ```
    
    **Exercício 2: Positivo, negativo ou zero**
    
    Crie uma variável `numero`. Verifique se o número é maior que zero (exiba “Positivo”), menor que zero (exiba “Negativo”) ou igual a zero (exiba “Zero”).
    
    **Resposta:**
    
    ```python
    numero = -5
    
    # Testamos a primeira condição
    if numero > 0:
        print("Positivo")
    # Se a primeira for falsa, testamos a segunda com elif
    elif numero < 0:
        print("Negativo")
    # Se nenhuma das anteriores for verdadeira, cai no else
    else:
        # O único caso restante é o número ser exatamente igual a zero
        print("Zero")
        
        Negativo
        **# A variável recebe -5, indicando a condição elif (Negativo)**
    ```
    

---

- Módulo 6: Loops (Laços de Repetição)
    
    ### Teoria
    
    Imagine que você precisa escrever “Bom dia” 100 vezes. Seria muito chato escrever 100 linhas de `print()`, certo? Para isso servem os loops (laços de repetição). Eles repetem um bloco de código várias vezes.
    
    Em Python, temos dois tipos principais:
    - **`for`**: Usado quando sabemos exatamente quantas vezes queremos repetir algo (ou quando queremos passar por todos os itens de uma lista).
    - **`while`**: Usado quando queremos repetir algo *enquanto* uma condição for verdadeira.
    
    **Exemplo com `for`:**
    
    ```python
    **# O range(5) cria uma sequência de números de 0 a 4 (5 vezes no total) gera uma sequência imutável.**
    for i in range(5):
        print("Bom dia!")
        
    Bom dia!
    Bom dia!
    Bom dia!
    Bom dia!
    Bom dia!
    ```
    
    **Exemplo com `while`:**
    
    ```python
    contador = 0
    while contador < 3:
        print("Contando...")
        contador = contador + 1 **# Precisamos aumentar o contador para não ficar em um loop infinito**
        
    Contando...
    Contando...
    Contando...
    ```
    
    ### Exercícios
    
    **Exercício 1: Contagem regressiva**
    
    Use um loop `for` para exibir os números de 5 até 1 (em ordem decrescente). Dica: a função `range()` pode receber três valores: início, fim e passo.
    
    **Resposta:**
    
    ```python
    **# range(5, 0, -1) significa: comece no 5, vá até o 0 (não inclui o 0) e diminua 1 a cada passo.
    # o -1 elimina o ultimo numero da lista, dessa forma de 5 até 0, o zero não entra na lista**
    for numero in range(5, 0, -1):
        print(numero)
    print("Fogo!")
    
    5
    4
    3
    2
    1
    Fogo!
    ```
    
    **Exercício 2: Tabuada do 7**
    
    Use um loop `while` para exibir a tabuada do 7 (de 7x1 até 7x10).
    
    **Resposta:**
    
    ```python
    multiplicador = 1
    
    **# O loop vai rodar enquanto o multiplicador for menor ou igual a 10**
    while multiplicador <= 10:
        resultado = 7 * multiplicador
        print(f"7 x{multiplicador} ={resultado}")
    
        **# Não podemos esquecer de aumentar o multiplicador, senão o loop nunca acaba!**
        multiplicador += 1 **# Isso é o mesmo que multiplicador = multiplicador + 1**
        
    7 x1 =7
    7 x2 =14
    7 x3 =21
    7 x4 =28
    7 x5 =35
    7 x6 =42
    7 x7 =49
    7 x8 =56
    7 x9 =63
    7 x10 =70
    ```
    

---

- Módulo 7: Listas
    
    ### Teoria
    
    Uma lista é uma variável que consegue guardar vários valores ao mesmo tempo. Pense nela como uma prateleira onde você pode colocar vários objetos em ordem.
    
    As listas são criadas usando colchetes `[]` e os itens são separados por vírgulas. Podemos acessar cada item pela sua posição (chamada de **índice**). Em Python, o primeiro item sempre está na posição **0**.
    
    **Exemplo:**
    
    ```python
    **# imprime o resultado (fruta) conforme o numero/sequencia onde maçã é 0, banana é 1 etc...**
    frutas = ["Maçã", "Banana", "Laranja"]
    print(frutas[0]) # Exibe "Maçã"
    print(frutas[1]) # Exibe "Banana"
    
    Maçã
    Banana
    ```
    
    ### Exercícios
    
    **Exercício 1: Lista de compras**
    
    Crie uma lista com 3 itens de supermercado. Adicione um quarto item à lista usando o comando correto e, em seguida, exiba a lista completa.
    
    **Resposta:**
    
    ```python
    **# Criando a lista inicial com 3 itens**
    compras = ["Arroz", "Feijão", "Macarrão"]
    
    **# O método .append() adiciona um novo item no final da lista**
    compras.append("Carne")
    
    **# Exibindo a lista completa**
    print(compras)
    
    ['Arroz', 'Feijão', 'Macarrão', 'Carne']
    ```
    
    **Exercício 2: Percorrendo uma lista**
    
    Crie uma lista com o nome de 3 amigos. Use um loop `for` para exibir uma mensagem de saudação personalizada para cada um deles.
    
    **Resposta:**
    
    ```python
    amigos = ["Pedro", "Ana", "Carlos"]
    
    **# O loop 'for' vai pegar cada item da lista 'amigos' e colocar na variável 'amigo'** 
    
    for amigo in amigos:
        # Para cada amigo, ele exibe essa mensagem
        print(f"Olá,{amigo}! Como você está?")
        
    Olá,Pedro! Como você está?
    Olá,Ana! Como você está?
    Olá,Carlos! Como você está?
    ```
    

---

- Módulo 8: Tuplas e Dicionários
    
    ### Teoria
    
    Além das listas, Python tem outras formas de guardar dados:
    
    **Tuplas:** São como listas, mas **não podem ser modificadas** depois de criadas (são imutáveis). Usamos parênteses `()` para criá-las.
    
    ```python
    #Tuplas são dados imutáveis.
    dias_semana = ("Segunda", "Terça", "Quarta")
    ```
    
    **Dicionários:** Guardam informações em pares de **chave** e **valor** (como um dicionário real, onde você procura uma palavra e acha o significado). Usamos chaves `{}`.
    
    ```python
    # Dicionániro sempre será colocado entre chaves.
    pessoa = {
        "nome": "João",
        "idade": 25,
        "cidade": "Rio de Janeiro"
    }
    print(pessoa["nome"]) # Exibe "João"
    ```
    
    ### Exercícios
    
    **Exercício 1: Coordenadas imutáveis**
    
    Crie uma tupla chamada `coordenadas` com dois números (representando latitude e longitude). Tente exibir apenas o segundo número da tupla.
    
    **Resposta:**
    
    ```python
    **# Tuplas são criadas com parênteses. Elas são ótimas para dados que não devem mudar.**
    coordenadas = (-23.5505, -46.6333)
    
    **# Assim como nas listas, acessamos os itens pelo índice. O segundo item está no índice 1.**
    print(f"A longitude é:{coordenadas[1]}")
    
    A longitude é:-46.6333
    ```
    
    **Exercício 2: Cadastro de aluno**
    
    Crie um dicionário chamado `aluno` com as chaves “nome”, “curso” e “nota”. Depois, exiba uma frase usando essas informações.
    
    **Resposta:**
    
    ```python
    **# Dicionários usam chaves {} e o formato "chave": "valor"**
    aluno = {
        "nome": "Amanda",
        "curso": "Python para Iniciantes",
        "nota": 9.5
    }
    
    **# Acessamos os valores colocando o nome da chave entre colchetes**
    frase = f"A aluna{aluno['nome']} tirou nota{aluno['nota']} no curso de{aluno['curso']}."
    print(frase)
    
    A aluna Amanda tirou nota 9.5 no curso de Python para Iniciantes .
    ```
    

---

- Módulo 9: Funções
    
    ### Teoria
    
    Se você tem um bloco de código que precisa usar várias vezes em partes diferentes do seu programa, você pode transformá-lo em uma **função**. Funções são como “mini-programas” dentro do seu programa principal.
    
    Para criar uma função em Python, usamos a palavra `def` (de *define*), damos um nome a ela e colocamos parênteses `()`.
    
    **Exemplo:**
    
    ```python
    **# Criando a função**
    def dar_boas_vindas():
        print("Bem-vindo ao sistema!")
    
    **# Usando (chamando) a função**
    dar_boas_vindas()
    
    Bem-vindo ao sistema!
    ```
    
    As funções também podem receber informações (chamadas de **parâmetros**) e devolver um resultado (usando a palavra `return`).
    
    ### Exercícios
    
    **Exercício 1: Função de saudação**
    
    Crie uma função chamada `saudacao` que receba um nome como parâmetro e exiba a mensagem “Olá, [nome]! Bom dia!”. Chame a função passando o seu nome.
    
    **Resposta:**
    
    ```python
    **# O 'nome' dentro dos parênteses é o parâmetro que a função espera receber**
    def saudacao(nome):
        print(f"Olá,{nome}! Bom dia!")
    
    # Chamando a função e passando o valor "Mauricio" para o parâmetro 'nome'
    saudacao("Mauricio")
    
    Olá,Mauricio! Bom dia!
    ```
    
    **Exercício 2: Função de soma**
    
    Crie uma função chamada `somar` que receba dois números, calcule a soma entre eles e **retorne** o resultado. Guarde o resultado em uma variável e exiba na tela.
    
    **Resposta:**
    
    ```python
    **# A função recebe dois parâmetros: a e b**
    def somar(a, b):
        resultado = a + b
        **# O return faz a função devolver o valor calculado para quem a chamou**
        return resultado
    
    **# Chamamos a função passando 10 e 5. O valor retornado (15) é guardado na variável 'total'**
    total = somar(10, 5)
    
    print(f"O total da soma é:{total}")
    
    O total da soma é:15
    ```
    

---

- Módulo 10: Tratamento de Erros
    
    ### Teoria
    
    Quando escrevemos código, é normal cometer erros. Às vezes, o erro não é de digitação, mas algo que acontece durante a execução do programa (como tentar dividir um número por zero ou pedir para o usuário digitar um número e ele digitar uma letra).
    
    Para evitar que o programa “quebre” e pare de funcionar, usamos os blocos `try` (tentar) e `except` (exceção). O Python tenta executar o código no `try`. Se der erro, ele pula para o `except` e continua rodando o programa normalmente.
    
    **Exemplo:**
    
    ```python
    try:
        resultado = 10 / 0
    except ZeroDivisionError:
        print("Erro: Não é possível dividir por zero!")
        
        Erro: Não é possível dividir por zero!
    ```
    
    ### Exercícios
    
    **Exercício 1: Divisão segura**
    
    Crie um programa que tente dividir 100 por uma variável `divisor`. Use `try` e `except` para exibir uma mensagem amigável caso o divisor seja zero.
    
    **Resposta:**
    
    ```python
    divisor = 0
    
    **# O bloco try tenta executar o código**
    try:
        resultado = 100 / divisor
        print(f"O resultado é{resultado}")
    **# Se ocorrer um erro de divisão por zero, o bloco except é acionado**
    except ZeroDivisionError:
        print("Ops! Você tentou dividir por zero. Isso não é permitido na matemática.")
        
        Ops! Você tentou dividir por zero. Isso não é permitido na matemática.
    ```
    
    **Exercício 2: Conversão de texto para número**
    
    Tente converter a string “abc” para um número inteiro usando a função `int()`. Use `try` e `except` para capturar o erro `ValueError` e exibir uma mensagem de aviso.
    
    **Resposta:**
    
    ```python
    texto = "abc"
    
    try:
        **# A função int() tenta transformar o texto em número inteiro**
        numero = int(texto)
        print(f"O número é{numero}")
    **# Se o texto não for um número válido, o Python lança um ValueError**
    except ValueError:
        print("Erro: O texto fornecido não contém apenas números válidos para conversão.")
        
        Erro: O texto fornecido não contém apenas números válidos para conversão.
    ```
    

---

- Módulo 11: Bibliotecas (Módulos)
    
    ### Teoria
    
    O Python vem com muitas ferramentas prontas para uso, mas elas não ficam todas carregadas na memória para não deixar o programa pesado. Essas ferramentas extras são chamadas de **bibliotecas** ou **módulos**.
    
    Para usar uma biblioteca, precisamos “importá-la” para o nosso código usando a palavra `import`. Uma das bibliotecas mais famosas é a `math`, que tem funções matemáticas avançadas, e a `random`, que serve para gerar números aleatórios.
    
    **Exemplo:**
    
    ```python
    import math
    **# Usando a função sqrt (raiz quadrada) da biblioteca math**
    raiz = math.sqrt(16)
    print(raiz) # Exibe 4.0
    
    4.0
    ```
    
    ### Exercícios
    
    **Exercício 1: Sorteio de números**
    
    Importe a biblioteca `random` e use a função `randint(1, 10)` para sortear um número entre 1 e 10. Exiba o número sorteado.
    
    **Resposta:**
    
    ```python
    **# Importando a biblioteca random, que já vem instalada no Python**
    import random
    
    **# A função randint(a, b) retorna um número inteiro aleatório entre 'a' e 'b' (incluindo ambos)**
    numero_sorteado = random.randint(1, 10)
    
    print(f"O número sorteado foi:{numero_sorteado}")
    
    O número sorteado foi:10
    ```
    
    **Exercício 2: Data e hora atual**
    
    Importe a biblioteca `datetime` e exiba a data e hora atuais do sistema.
    
    **Resposta:**
    
    ```python
    **# Importando a biblioteca datetime para trabalhar com datas e horas**
    import datetime
    
    **# Acessando a classe datetime dentro do módulo datetime e chamando o método now()**
    agora = datetime.datetime.now()
    
    print(f"Data e hora atuais:{agora}")
    ```
    

---

- Módulo 12: Programação Orientada a Objetos (POO)
    
    ### Teoria
    
    A Programação Orientada a Objetos (POO) é uma forma de organizar o código pensando no mundo real. Em vez de apenas escrever funções soltas, criamos **Classes** (que são como moldes ou plantas de uma casa) e **Objetos** (que são as casas construídas a partir desse molde).
    
    Uma classe pode ter **Atributos** (características, como cor, tamanho) e **Métodos** (ações, como andar, falar).
    
    **Exemplo:**
    
    ```python
    **#O programa cria um objeto Cachorro com nome "Rex" e raça "Poodle" e, em seguida, chama o método latir(), que imprime "Rex diz: Au au!" na tela.
    
    # Criando a classe**
    class Cachorro:
    		
        **# O método __init__ é chamado automaticamente quando criamos um novo objeto**
        # __init__ inicializa os atributos da instância (define o estado inicial)
        **# self representa a instância atual de uma classe, permitindo acessar atributos e         métodos específicos desse objeto.**
        def __init__(self, nome, raca):
            self.nome = nome # Atributo
            self.raca = raca # Atributo
    
        **# Método (ação)**
        def latir(self):
            print(f"{self.nome} diz: Au au!")
    
    **# Criando o objeto (a casa construída)**
    meu_cachorro = Cachorro("Rex", "Poodle")
    meu_cachorro.latir() # Exibe "Rex diz: Au au!"
    
    Rex diz: Au au!
    ```
    
    ### Exercícios
    
    **Exercício 1: Classe Carro**
    
    Crie uma classe chamada `Carro` com os atributos `marca` e `modelo`. Crie um método chamado `buzinar` que exiba “Bibi!”. Crie um objeto dessa classe e chame o método.
    
    **Resposta:**
    
    ```python
    **# O programa cria um objeto Carro com marca "Toyota" e modelo "Corolla" e, em seguida, chama o método buzinar(), que imprime "Bibi!" na tela.
    
    # Definindo a classe Carro**
    class Carro:
        **# O 'self' é obrigatório e representa o próprio objeto que está sendo criado**
        def __init__(self, marca, modelo):
            self.marca = marca
            self.modelo = modelo
    
        **# Definindo o método buzinar**
        def buzinar(self):
            print("Bibi!")
    
    **# Criando um objeto (instância) da classe Carro**
    meu_carro = Carro("Toyota", "Corolla")
    
    **# Chamando o método buzinar do objeto criado**
    meu_carro.buzinar()
    
    Bibi!
    ```
    
    **Exercício 2: Conta Bancária**
    
    Crie uma classe `ContaBancaria` com o atributo `saldo` (iniciando em 0). Crie um método `depositar` que receba um valor e adicione ao saldo. Crie um objeto, deposite 100 reais e exiba o saldo.
    
    **Resposta:**
    
    ```python
    **#O programa cria uma conta bancária com saldo inicial 0, realiza um depósito de 100 e, em seguida, exibe o saldo atualizado, que passa a ser R$100**.
    
    class ContaBancaria:
        def __init__(self):
            **# O saldo começa em 0 para todas as novas contas**
            self.saldo = 0
    
        **# O método depositar recebe o valor a ser adicionado**
        def depositar(self, valor):
            self.saldo += valor # Adiciona o valor ao saldo atual
            print(f"Depósito de R${valor} realizado com sucesso.")
    
    **# Criando a conta**
    minha_conta = ContaBancaria()
    
    **# Realizando o depósito**
    minha_conta.depositar(100)
    
    **# Exibindo o saldo atualizado**
    print(f"Saldo atual: R${minha_conta.saldo}")
    
    Depósito de R$100 realizado com sucesso.
    Saldo atual: R$100
    ```
    

---

- Módulo 13: Projeto Prático - pygame