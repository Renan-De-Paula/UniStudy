@echo off
echo ===================================================
echo Inicializando a Plataforma UniStudy Hub NATIVAMENTE...
echo ===================================================

echo.
echo [1/3] Preparando o Frontend (Instalando dependencias do Node)...
cd frontend
start /b cmd /c "npm install --legacy-peer-deps && npm run dev"
cd ..

echo.
echo [2/3] Preparando o Backend e Banco de Dados (SQLite)...
cd backend
:: Cria o ambiente virtual e instala dependencias se ainda nao existir
if not exist venv (
    echo Criando Ambiente Virtual Python...
    python -m venv venv
)
call venv\Scripts\activate
echo Instalando bibliotecas necessarias...
pip install -r requirements.txt >nul 2>&1

echo.
echo Aplicando migracoes no banco SQLite local...
python manage.py makemigrations accounts community squads repository gamification chat
python manage.py migrate

echo.
echo [3/3] Populando o Banco SQLite com dados iniciais...
python seed_data.py

echo.
echo Iniciando Servidor Backend (ASGI)...
start /b cmd /c "python manage.py runserver 8000"
cd ..

echo.
echo ===================================================
echo TUDO PRONTO! SERVIDORES NATIVOS RODANDO:
echo.
echo Frontend (React): http://localhost:5173
echo Backend (Django API): http://localhost:8000
echo ===================================================
echo Para parar os servidores, feche as janelas do terminal que foram abertas.
pause >nul
