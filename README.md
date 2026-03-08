# 🎬 Cinema da Chloé

Este é o projeto do **Cinema Pessoal da Chloé**, uma aplicação web desenhada para rodar em modo local e ser manuseada por uma criança.
O objetivo principal é permitir que a Chloé pegue num bloco de notas/caderno físico (o seu "Menu de Filmes"), faça o scan do QR Code correspondente a um filme usando um leitor físico, e que o filme comece a tocar automaticamente na tela de forma "mágica", tal como uma ida ao cinema!

---

## 🛠 Arquitetura Atual

O **Cinema da Chloé** utiliza uma framework web moderna focada apenas em performance local:

- **Frontend Web (React + Vite)**: Interface "Netflix-Pink" super fluida construída com ReactJS a correr no browser (ideal para um Chromium Kiosk-mode). Tem transições suaves, apresentação do perfil, e um carrossel de filmes com as respetivas capas! A aplicação "ouve" teclados (neste caso, as leituras dos QR Codes físicos).
- **Backend Servidor (OCaml + Dream)**: Um servidor extremamente rápido construído com a linguagem funcional OCaml. A sua única e fulcral missão é disponibilizar as pastas `media/movies/` (e os posters) à rede local para que o frontend React carregue quase instantaneamente e sem stutters, além de devolver a `movielist` atual de forma dinâmica.

---

## 🚀 Como Executar

### Pré-Requisitos
1. **Node.js e npm** (Para arrancar o React)
2. **OCaml e OPAM** com a biblioteca `dream` instalada.
3. Um browser local (Chrome/Firefox/Edge)

### 1. Iniciar o Servidor de Filmes Automático (Backend)
Vai à diretoria `backend/` e corre as compilações do Dune:
```bash
cd backend
dune exec ./main.exe
```
**(O servidor ficará disponível em `http://localhost:8080`)**

### 2. Iniciar o Ecrã de Cinema (Frontend)
Num outro terminal, vai à diretoria `frontend/` e arranca o Vite:
```bash
cd frontend
npm install # se for a primeira vez
npm run dev
```
**(O design animado com o carrossel abrirá em `http://localhost:5173`)**

### 3. Leitor de QR Code (Hardware)
* Leitores de QR codes físicos conectam-se por USB e operam como "teclados virtuais" (HID).
* No FrontEnd React há um Event Listener (`window.addEventListener('keydown')`) de propósito concebido que intercepta a escrita desses números/strings.
* Colocando o Browser em ecrã inteiro (exemplo `chromium --kiosk "http://localhost:5173"` num ecrã táctil), o leitor de QR vai disparar as teclas que farão começar automagicamente o filme selecionado da base de dados do OCaml!
