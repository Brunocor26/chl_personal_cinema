# Guia de Instalação: Debian Minimal (Kiosk Mode) para o Cinema da Chloé

Este guia explica como preparar de raiz um PC com Debian Minimal para rodar **apenas** o projeto "Cinema da Chloé".

---

## 1. Instalar o Debian Minimal

1. Faz o download do **Debian Network Installer (netinst)**.
2. Durante a instalação, quando chegar à secção **"Software selection"** (Seleção de Software), **DESMARCA TUDO** exceto:
   - `SSH server` (recomendado para gerires a máquina remotamente)
   - `Standard system utilities`
   > *Nota: Não instales o "Debian desktop environment" nem GNOME/KDE. Queremos o sistema o mais leve possível.*

---

## 2. Instalar as Dependências Gráficas Básicas e do Projeto

Faz login como `root` no novo sistema (ou acede via SSH) e instala o essencial:

```bash
apt update && apt upgrade -y

# Instalar Servidor Gráfico (Xorg) e Browser (Chromium)
apt install -y xserver-xorg x11-xserver-utils xinit chromium unclutter

# Instalar Git e dependências para compilar (apenas se fores compilar na própria máquina)
apt install -y git curl build-essential wget
```

Se preferires copiar os ficheiros já compilados do teu computador para o Debian via Pen USB ou SSH, não precisas de instalar o OCaml nem o Node.js no Debian Minimal! (Esta é a via recomendada: compila tudo no teu PC e passa só a pasta `frontend/dist` e o binário `main.exe`).

> **Se passares do teu computador**, garante que ao compilar o OCaml crias um binário estático ou passas a pasta do projeto e compilas lá (neste caso tens que instalar opam e ocaml).

---

## 2.1. Como Aceder via SSH ao teu Debian Minimal

O SSH permite-te controlar o Debian Minimal a partir do teu computador principal sem teres de ligar lá um teclado. Como selecionaste o "SSH Server" durante a instalação, já deve estar ativo.

**No PC Debian Minimal (Apenas uma vez, para ver o IP):**
1. Liga o computador Debian Minimal ao teu router (via cabo de rede Ethernet preferencialmente).
2. Escreve `ip a` ou `hostname -I` no ecrã preto.
3. Toma nota do IP (algo como `192.168.1.105` ou `192.168.0.22`).

**No teu computador de trabalho atual:**
Abre um terminal normal e executa:
```bash
ssh chloe@192.168.x.x
```
*(Substitui `chloe` pelo nome de utilizador que criaste e o IP pelo IP que notaste)*

* Se for a primeira vez que te conetas, ele vai perguntar: _"Are you sure you want to continue connecting (yes/no)?"_ Escreve `yes`.
* De seguida vai pedir-te a password do utilizador. A partir daqui, estás a controlar o Debian remotamente!

Podes usar o comando `scp` (Secure Copy) ou o FileZilla (usando sftp://) para arrastar a tua pasta `chl_personal_cinema` do teu PC para a diretoria `/home/chloe/` do Debian, sem te levantares da cadeira.

---

## 3. Configurar o Utilizador para Arranque Automático

Vamos assumir que criaste um utilizador chamado `chloe` durante a instalação.

Entra no perfil do utilizador:
```bash
su - chloe
```

### Criar o Script de Arranque do Kiosk (`.xinitrc`)
Cria o ficheiro `~/.xinitrc` com o seguinte conteúdo:

```bash
#!/bin/bash
# Desligar a gestão de energia e screensaver (não queremos que o ecrã adormeça!)
xset s off
xset s noblank
xset -dpms

# Esconder o rato após uns segundos de inatividade
unclutter &

# Executar o Chromium em ecrã inteiro (Kiosk) sem barras e sem erros de crash
exec chromium --no-sandbox \
  --window-position=0,0 \
  --kiosk \
  --disable-infobars \
  --disable-session-crashed-bubble \
  "http://localhost:8080"
```
*(Torna-o executável: `chmod +x ~/.xinitrc`)*

### Fazer o Linux iniciar o ambiente gráfico automaticamente (`.bash_profile`)
Queremos que sempre que a `chloe` faça login, o ecrã inicie a interface Kiosk que criámos acima. Adiciona o seguinte no fundo do ficheiro `~/.bash_profile` (ou `~/.profile`):

```bash
if [[ -z $DISPLAY ]] && [[ $(tty) = /dev/tty1 ]]; then
    startx
fi
```

### Fazer Auto-Login no Debian (para não pedir password)
Volta temporariamente ao super-utilizador (root):
```bash
su - root
systemctl edit getty@tty1.service
```

No editor que aparece, insere as seguintes linhas:
```ini
[Service]
ExecStart=
ExecStart=-/sbin/agetty -a chloe --noclear %I $TERM
```
Grava e sai. No próximo reinício, o utilizador `chloe` entrará sozinho e arrancará o ecrã do Kiosk (que ficará à espera do servidor de filmes)!

---

## 4. Configurar o Serviço de Filmes (Systemd)

Passa a pasta do teu projeto (ou faz `git clone`) para dentro de `/home/chloe/chl_personal_cinema`.
(Assegura-te que o `main.exe` já está lá dentro construído ou constrói-o).

Como `root`, cria o serviço:
```bash
nano /etc/systemd/system/cinema-server.service
```

```ini
[Unit]
Description=Servidor Backend Cinema da Chloe (OCaml)
After=network.target

[Service]
Type=simple
User=chloe
WorkingDirectory=/home/chloe/chl_personal_cinema/backend
# Se for construído com dune:
# ExecStart=/home/chloe/.opam/default/bin/dune exec ./main.exe
# Se for o executável direto:
ExecStart=/home/chloe/chl_personal_cinema/backend/_build/default/bin/main.exe
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Ativa o serviço para arrancar com o computador:
```bash
systemctl enable cinema-server.service
systemctl start cinema-server.service
```

---

## 🎉 Pronto!
Na próxima vez que o computador for ligado:
1. Vai saltar o ecrã de login do tty1 e entrar com o utilizador `chloe`.
2. O servidor de filmes OCaml já vai estar a rodar em fundo (`localhost:8080`).
3. O script inicia o servidor gráfico `Xorg` que abre o `Chromium` em modo quiosque diretamente no ecrã do frontend.
4. O frontend carregado tem o seu `.css` e `/media/...` tudo perfeitamente carregado por causa dos *caminhos relativos* que foram adicionados ao teu código.
