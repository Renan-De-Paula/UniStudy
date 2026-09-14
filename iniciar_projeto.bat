@echo off
echo ===================================================
echo Inicializando a Plataforma UniStudy Hub com MySQL...
echo ===================================================

echo.
echo [1/4] Tentando iniciar o servico MySQL do Windows...
echo (Nota: Talvez seja necessario rodar este script como Administrador se o servico estiver parado)
net start mysql80 >nul 2>&1
if %errorlevel% neq 0 (
    net start mysql >nul 2>&1
)
echo Assumindo que o MySQL (3306) esta disponivel. Se houver falha de conexao, abra o Workbench ou inicie o servico do MySQL manualmente.

echo.
echo [2/4] Preparando o Frontend (Instalando dependencias do Node)...
cd frontend
:: Inicia o frontend em uma nova janela para poder debugar facilmente
start "UniStudy - Frontend" cmd /k "npm install --legacy-peer-deps && npm run dev"
cd ..

echo.
echo [3/4] Preparando o Backend (Python/Django)...
cd backend
if not exist venv (
    echo Criando Ambiente Virtual Python...
    python -m venv venv
)
call venv\Scripts\activate
echo Instalando bibliotecas necessarias...
pip install -r requirements.txt >nul 2>&1
:: Garante que dotenv e pymysql estao instalados para funcionar o MySQL
pip install python-dotenv pymysql >nul 2>&1

echo.
echo Aplicando migracoes no banco MySQL local (unistudy_db)...
:: O banco de dados unistudy_db precisa existir no MySQL. 
:: Se nao existir, este comando mostrara erro no console do backend.
python manage.py migrate

echo.
echo [4/4] Iniciando Servidor Backend (Django API)...
:: Inicia o backend em uma nova janela
start "UniStudy - Backend" cmd /k "python manage.py runserver 8000"
cd ..

echo.
echo ===================================================
echo TUDO PRONTO! SERVIDORES NATIVOS INICIADOS:
echo.
echo Frontend (React): http://localhost:5173
echo Backend (Django API): http://localhost:8000
echo ===================================================
echo Para parar a aplicacao, feche as duas janelas pretas do Frontend e Backend que foram abertas.
pause >nul
