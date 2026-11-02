@echo off
title UniStudy Hub - Inicializador
echo ===================================================
echo Inicializando a Plataforma UniStudy Hub
echo ===================================================

echo.
echo [1/3] Verificando ambiente do Backend (Django API)...
cd backend
if not exist venv (
    echo Criando Ambiente Virtual Python...
    python -m venv venv
    call venv\Scripts\activate
    set AUTOBAHN_USE_NVX=0
    echo Instalando dependencias do Python...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)
set AUTOBAHN_USE_NVX=0
python manage.py migrate --noinput
cd ..

echo.
echo [2/3] Iniciando o Backend (Django API) na porta 8001...
start "UniStudy - Backend (Porta 8001)" cmd /k "title UniStudy Backend && cd backend && venv\Scripts\activate && python manage.py runserver 8001"

echo.
echo [3/3] Iniciando o Frontend (React/Vite) na porta 5173...
cd frontend
if not exist node_modules (
    echo Instalando dependencias do React (primeira execucao)...
    start "UniStudy - Frontend (Porta 5173)" cmd /k "title UniStudy Frontend && cd frontend && npm install --legacy-peer-deps && npm run dev"
) else (
    start "UniStudy - Frontend (Porta 5173)" cmd /k "title UniStudy Frontend && cd frontend && npm run dev"
)
cd ..

echo.
echo ===================================================
echo TUDO PRONTO! SERVIDORES INICIADOS COM SUCESSO:
echo.
echo Frontend (React):   http://localhost:5173
echo Backend (API):      http://localhost:8001/api/
echo Django Admin:       http://localhost:8001/admin/
echo ===================================================
echo Abrindo seu navegador automaticamente em 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo Pressione qualquer tecla para fechar este inicializador
echo (as duas janelas pretas dos servidores continuarao rodando).
pause >nul
