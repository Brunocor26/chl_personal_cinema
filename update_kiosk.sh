#!/bin/bash

# ==============================================================================
# CINEMA DA CHLOÉ - Atualizador de Código Mágico 🚀
# ==============================================================================
# Corre este script no teu Debian Kiosk sempre que quiseres puxar o código
# mais recente do teu computador (via GitHub) e aplicar as mudanças na TV!
# ==============================================================================

echo "🔄 A iniciar a atualização do Cinema da Chloé..."
echo "----------------------------------------------------------------------"

# 1. Obter a diretoria base do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo "📥 1. A transferir as novidades do GitHub..."
git fetch origin
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Erro ao puxar o código do GitHub. Verifica a internet!"
    exit 1
fi

echo "----------------------------------------------------------------------"

echo "🎨 2. A reconstruir o Frontend (Interface Visual)..."
cd "$PROJECT_DIR/frontend" || exit 1

# Garante que temos as dependências mais recentes caso tenhas adicionado livrarias
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o Frontend."
    exit 1
fi

echo "----------------------------------------------------------------------"

echo "⚙️  3. A reconstruir o Backend (OCaml Server)..."
cd "$PROJECT_DIR/backend" || exit 1

# Carregar o ambiente Opam para ter a certeza que o Dune é encontrado
eval $(opam env)
dune build ./main.exe

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o Backend OCaml."
    exit 1
fi

echo "----------------------------------------------------------------------"

echo "♻️  4. A reiniciar os motores Mágicos..."
# Pede password porque o systemctl restart precisa de permissões sudo/root
sudo systemctl restart cinema-server.service

if [ $? -ne 0 ]; then
    echo "⚠️  Não foi possível reiniciar o serviço automaticamente (falta de password sudo)."
    echo "   Podes fazê-lo manualmente com: sudo systemctl restart cinema-server.service"
else
    echo "✅ Serviço reiniciado com sucesso!"
fi

echo "======================================================================"
echo "🎉 Atualização terminada! O Kiosk da Chloé já tem a nova versão."
echo "======================================================================"
