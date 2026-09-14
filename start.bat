@echo off
echo ===================================================
echo Inicializando a Plataforma UniStudy Hub...
echo ===================================================

:: Verifica se o Docker esta instalado
docker -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Erro: O Docker nao esta instalado ou nao esta em execucao.
    echo Por favor, instale o Docker Desktop (https://www.docker.com/products/docker-desktop)
    pause
    exit /b
)

echo.
echo [1/3] Subindo os servicos (Banco de Dados, Redis, Backend, Frontend)...
docker-compose up -d --build

echo.
echo Aguardando 10 segundos para o Banco de Dados iniciar corretamente...
timeout /t 10 /nobreak >nul

echo.
echo [2/3] Aplicando as migracoes do Banco de Dados...
docker-compose exec backend python manage.py makemigrations accounts community squads repository gamification chat
docker-compose exec backend python manage.py migrate

echo.
echo [3/3] Populando o Banco de Dados com os dados iniciais...
docker-compose exec backend python seed_data.py

echo.
echo ===================================================
echo TUDO PRONTO! SERVIDORES RODANDO:
echo.
echo Frontend (React): http://localhost:5173
echo Backend (Django API): http://localhost:8000
echo ===================================================
echo Aperte qualquer tecla para fechar este assistente.
pause >nul
