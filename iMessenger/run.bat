@echo off
start http://localhost:8000/static/index.html

set ROOT_DIR=.

set LISTEN_ADDR=http://0.0.0.0:8000

mongoose.exe -d %ROOT_DIR% -l %LISTEN_ADDR%

timeout /t 3 >nul

pause