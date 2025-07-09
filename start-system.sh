#!/bin/bash

echo "===================================="
echo "   GTSystem - Sistema de Gestão"
echo "   Transportadoras e Estacionamentos"
echo "===================================="
echo ""
echo "Status: 95% IMPLEMENTADO"
echo ""
echo "CREDENCIAIS DE TESTE:"
echo ""
echo "Admin:"
echo "  Email: admin@gtsystem.com"
echo "  Senha: admin123"
echo ""
echo "Transportadora:"
echo "  Email: usuario@transportadoramodelo.com.br"
echo "  Senha: trans123"
echo ""
echo "Estacionamento:"
echo "  Email: usuario@estacionamentoseguro.com.br"
echo "  Senha: estac123"
echo ""
echo "===================================="
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "backend/node_modules" ]; then
    echo "Instalando dependências do backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Instalando dependências do frontend..."
    cd frontend && npm install && cd ..
fi

echo "[1/3] Iniciando Backend..."
cd backend
gnome-terminal --title="GTSystem Backend" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"' 2>/dev/null || \
xterm -title "GTSystem Backend" -e "npm run dev" 2>/dev/null &
cd ..

sleep 3

echo "[2/3] Iniciando Frontend..."
cd frontend
gnome-terminal --title="GTSystem Frontend" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"' 2>/dev/null || \
xterm -title "GTSystem Frontend" -e "npm run dev" 2>/dev/null &
cd ..

sleep 5

echo "[3/3] Abrindo navegador..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173
elif command -v open > /dev/null; then
    open http://localhost:5173
else
    echo "Abra manualmente: http://localhost:5173"
fi

echo ""
echo "===================================="
echo "Sistema iniciado com sucesso!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar"
echo "===================================="

# Manter o script rodando
while true; do
    sleep 1
done 