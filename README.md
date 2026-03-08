# 🎬 Cinema da Chloé

Este é o projeto do **Cinema Pessoal da Chloé**, uma aplicação web desenhada para rodar em modo local e ser manuseada por uma criança.
O objetivo principal é permitir que a Chloé pegue num bloco de notas/caderno físico (o seu "Menu de Filmes"), faça o scan do QR Code correspondente a um filme usando um leitor físico, e que o filme comece a tocar automaticamente na tela de forma "mágica", tal como uma ida ao cinema!

---

## 🛠 Arquitetura Atual

- **Frontend Kiosk (Python + Pygame)**: Interface nativa levíssima em ecra inteiro (`kiosk/main.py`). Renderiza um ecrã escuro e elegante em loop ("Cinema da Chloé") onde a animação e processamento consome muito menos RAM (< 50 MB) do que o Chrome/Web. Este Kiosk aguarda à escuta dos sinais de leitura do QR Code físicos ou teclas.
- **Reprodutor de Vídeo (MPV)**: A aplicação Python chama diretamente o motor levíssimo `mpv` a nível de sistema em Fullscreen e com aceleração gráfica ativada localmente (`mpv --fs file.mp4`).

---

## 🚀 Como Executar

### Pré-Requisitos
- Sistema OS, ex: Debian/Linux/Ubuntu
- `mpv` media player
- `python3` e `pygame`

Instalação de pacotes recomendada (Debian 12):
```bash
sudo apt install python3-pygame mpv
# Ou via pip num ambiente virtual
pip install pygame
```

Inicia a aplicação via:
```bash
python3 kiosk/main.py
```

### 1. Sistema Operativo base e Kiosk Mode
* **OS**: Debian 12 (Bookworm) versão Minimal. Ecrã via X11 ou TTY Framebuffer.

### 2. Leitor de QR Code (Hardware)
* Leitores de QR codes físicos conectam-se por USB e operam como "teclados virtuais" (HID).
* Quando o leitor fotografa o código de barras/QR, ele digita a string e submete um parágrafo (`Enter`).
* O Event Loop do **Pygame** mapeia essas sequencias (ou atalhos de botões únicos) às películas dentro da subpasta de media. Sendo um aplicativo focado exclusivamente nisso, jamais ocorrerá perdas de focus sem depender de interfaces externas.
