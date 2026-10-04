@echo off
echo ===================================================
echo Inicializando a Plataforma UniStudy Hub
echo ===================================================

echo.
echo [1/3] Verificando ambiente e instalando dependencias do Backend...
cd backend
if not exist venv (
    echo Criando Ambiente Virtual Python...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1
python manage.py migrate
cd ..

echo.
echo [2/3] Iniciando o Backend (Django API) na porta 8001...
:: Mudamos a porta para 8001 porque a 8000 ja esta ocupada por outro projeto seu ("Concursos .TI")
start "UniStudy - Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver 8001"

echo.
echo [3/3] Iniciando o Frontend (React) na porta 5173...
start "UniStudy - Frontend" cmd /k "cd frontend && npm install --legacy-peer-deps && npm run dev"

echo.
echo ===================================================
echo TUDO PRONTO! SERVIDORES NATIVOS INICIADOS:
echo.
echo Frontend (React): http://localhost:5173
echo Backend (Django API): http://localhost:8001
echo ===================================================
echo OBS: As janelas do servidor foram abertas separadamente.
echo Para parar o sistema, feche as duas janelas pretas do Prompt.
pause >nul
