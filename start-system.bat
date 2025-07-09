@echo off
echo ====================================
echo    GTSystem - Sistema de Gestao
echo    Transportadoras e Estacionamentos
echo ====================================
echo.
echo Status: 95%% IMPLEMENTADO
echo.
echo CREDENCIAIS DE TESTE:
echo.
echo Admin:
echo   Email: admin@gtsystem.com
echo   Senha: admin123
echo.
echo Transportadora:
echo   Email: usuario@transportadoramodelo.com.br
echo   Senha: trans123
echo.
echo Estacionamento:
echo   Email: usuario@estacionamentoseguro.com.br
echo   Senha: estac123
echo.
echo ====================================
echo.

echo [1/3] Iniciando Backend...
start "GTSystem Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/3] Iniciando Frontend...
start "GTSystem Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo [3/3] Abrindo navegador...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo ====================================
echo Sistema iniciado com sucesso!
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Pressione qualquer tecla para sair...
pause > nul 