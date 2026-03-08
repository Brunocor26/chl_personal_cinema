#!/bin/bash

# ==============================================================================
# Este script envia automaticamente qualquer filme ou poster novo que adiciones 
# à tua pasta local `backend/media` diretamente para o Debian Kiosk usando a rede.
#
# Uso: ./sync_media.sh [IP_DO_DEBIAN]
# ==============================================================================

# Definições Padrão
REMOTE_USER="bruno"
DEFAULT_IP="192.168.1.210"

# O diretório onde este script está localizado (raiz do teu projeto)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEDIA_DIR="$PROJECT_DIR/backend/media/"

# Verifica se passaste um IP diferente como argumento
TARGET_IP=${1:-$DEFAULT_IP}
REMOTE_DEST="$REMOTE_USER@$TARGET_IP:/home/bruno/chl_personal_cinema/backend/media/"

echo "🎬 Iniciando sincronização mágica para o Cinema da Chloé ($TARGET_IP)..."
echo "----------------------------------------------------------------------"

# Verifica se o diretório de media local existe
if [ ! -d "$MEDIA_DIR" ]; then
    echo "❌ Erro: Não encontrei a pasta de media local em $MEDIA_DIR!"
    exit 1
fi

# Verifica se o rsync está instalado localmente
if ! command -v rsync &> /dev/null; then
    echo "❌ Erro: O comando 'rsync' não está instalado no teu PC."
    echo "   Podes instalá-arlo rodando: sudo apt install rsync"
    exit 1
fi

echo "📦 Sincronizando Filmes e Posters..."
echo "   Origem : $MEDIA_DIR"
echo "   Destino: $REMOTE_DEST"
echo "----------------------------------------------------------------------"

# Executa o rsync
# -a: archive mode (preserva permissões, datas, envia pastas recursivamente)
# -v: verbose (mostra o que está a ser copiado)
# -z: compressão ligada (envia mais rápido pequenos ficheiros por Wi-Fi)
# --progress: mostra a barra de progresso para os vídeos pesados
# --delete: SE apagares um filme no teu PC local, ele será apagado no Debian também!
rsync -avz --progress --delete "$MEDIA_DIR" "$REMOTE_DEST"

# ==============================================================================
# Tratamento Final
# ==============================================================================
if [ $? -eq 0 ]; then
    echo "----------------------------------------------------------------------"
    echo "✅ Sincronização Concluída com Sucesso!"
    echo "   A Chloé já tem os novos filmes disponíveis no catálogo mágico."
else
    echo "----------------------------------------------------------------------"
    echo "❌ Ocorreu um erro durante a sincronização."
    echo "   Verifica se o IP $TARGET_IP está correto e o PC destino está ligado."
fi
