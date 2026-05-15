# 🌱 Rhizome: A Rota do Sistema

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FramerMotion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**Rhizome** é um jogo digital de dedução social e educação ambiental crítica projetado para ser jogado presencialmente com um único dispositivo (estilo *pass-and-play*). O aplicativo atua como o mestre da partida, gerenciando identidades, o baralho de projetos, o tempo de plenária e a pontuação, funcionando 100% offline através da tecnologia PWA.

---

## 🎯 Objetivo do Jogo

O jogo é um embate político e ideológico entre duas facções que dividem a mesma mesa. O objetivo de ambas as facções é ser a primeira a **aprovar 5 cartas (projetos) do seu alinhamento**.

### 👥 As Facções
* **A Comunidade (Maioria):** Representam os cidadãos, ativistas e trabalhadores. Eles jogam "no escuro", não sabem quem são os seus aliados e precisam usar a dedução para aprovar 5 projetos do tipo `COMUNIDADE`.
* **O Lobby / O Sistema (Minoria Infiltrada):** Representam interesses corporativos e a elite econômica. Eles jogam com vantagem: abrem os olhos no início do jogo e sabem exatamente quem são os outros Lobbystas. Precisam manipular os debates e mentir para aprovar 5 projetos do tipo `LOBBY`.

---

## 📖 Como Jogar (Dinâmica da Rodada)

Rhizome é jogado em sucessivas rodadas compostas pelas seguintes fases:

1. **Seleção de Governo:** O app indica quem é o **Líder** da rodada. O Líder deve escolher verbalmente um **Conselheiro** entre os outros jogadores.
2. **Votação Pública:** Todos os jogadores debatem se confiam nessa dupla. O Líder insere no app se a mesa aprovou ou rejeitou o governo.
3. **O Caos:** Se a mesa rejeitar 3 governos consecutivos (termômetro do caos), a sociedade entra em colapso. O app saca a carta do topo do baralho e a aprova automaticamente, sem chance de defesa! Se o caos não acontecer, o governo segue para a fase legislativa.
4. **Fase Legislativa (O Pulo do Gato):**
   * O **Líder** recebe 3 cartas secretas do app. Ele deve remover 1 e passar o celular para o Conselheiro com as 2 restantes.
   * O **Conselheiro** recebe as 2 cartas do Líder, remove 1 e aprova a carta final.
5. **Plenária:** Um cronômetro entra em cena para o tempo de defesa. O Líder e o Conselheiro precisam justificar para a mesa por que aquela carta foi aprovada (e se alguém mentiu sobre as cartas que recebeu).
6. **Pontuação:** O app revela a carta para todos, processa o ponto para a Comunidade ou para o Lobby, e passa a coroa para o próximo Líder.

---

## ⚠️ Regras Gerais e Faixa Etária

* **Número de Jogadores:** 5 a 10 jogadores. (O app balanceia automaticamente a quantidade de Lobbystas dependendo do número de pessoas na mesa).
* **Faixa Etária Recomendada:** **14+ anos.** O jogo exige capacidade de argumentação, blefe e lida com temas densos do mundo real (ex: gentrificação, agronegócio, cooperativas, concessões ambientais).
* **O Celular:** O dispositivo deve sempre ser passado virado para baixo. É estritamente proibido mostrar a tela do seu celular para outro jogador durante as fases secretas.

---

## 🗄️ O Banco de Dados (Cartas)

Toda a base de conhecimento e as leis do jogo derivam do arquivo `src/database/cards_data.json`.
Ele contém **500 cartas exclusivas** que abordam tensões reais do Brasil e do mundo. O baralho é embaralhado a cada nova partida utilizando o algoritmo *Fisher-Yates*.

Cada carta (projeto) possui a seguinte estrutura:
```json
{
  "id": "c001",
  "title": "Corredores Agroecológicos Populares",
  "description": "Criação de redes agroecológicas geridas por cooperativas camponesas para abastecimento...",
  "type": "COMUNIDADE", // Define se a carta dá ponto para a Comunidade ou para o Lobby
  "categorie": "Agricultura",
  "region": "Nordeste"
}

```

---

## 💻 Tecnologias e Arquitetura

O projeto foi construído focando em performance de animação, imersão visual e capacidade *Offline-First*:

* **Frontend:** React + TypeScript (via Vite)
* **Estilização:** Tailwind CSS
* **Animações e Física:** Framer Motion (Física de arraste 3D nas cartas e transições de tela).
* **PWA (Progressive Web App):** Configurado via `vite-plugin-pwa` utilizando a estratégia *CacheFirst* do Workbox para garantir que imagens pesadas e fontes nativas abram instantaneamente em locais sem sinal de internet.
* **CI/CD:** GitHub Actions (Guardião da Master e Testes de Build Automatizados).

---

## 🛠️ Como rodar o projeto localmente

Siga as instruções abaixo para contribuir ou testar o jogo em sua máquina:

1. **Clone o repositório**
```bash
git clone https://github.com/rhianpablo11/rhizome_root_of_system.git

```


2. **Acesse a pasta da aplicação**
```bash
cd rhizome_root_of_system/rhizome_app

```


3. **Instale as dependências**
```bash
npm install

```


4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev

```


5. O aplicativo estará rodando em `http://localhost:5173`. Para simular a experiência real do jogo, recomenda-se abrir o *DevTools* do navegador e utilizar a visualização responsiva para Mobile.

---

**Desenvolvido com ☕, código e reflexão crítica.** 🌿
