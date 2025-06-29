@echo off
title Reseteo Entorno Desarrollo - TatuTaller
color 0A

echo.
echo ================================================================
echo                    RESETEO ENTORNO DESARROLLO                    
echo                         TatuTaller                            
echo ================================================================
echo.

echo [1/4] Terminando procesos Node.js...
taskkill /f /im node.exe 2>nul
if %errorlevel%==0 (
    echo ✓ Node.js terminado
) else (
    echo ✓ Node.js no estaba ejecutandose
)

echo.
echo [2/4] Terminando procesos Java...
taskkill /f /im java.exe 2>nul
if %errorlevel%==0 (
    echo ✓ Java terminado
) else (
    echo ✓ Java no estaba ejecutandose
)

echo.
echo [3/4] Verificando puertos...
for %%p in (3000 8080 3306) do (
    echo Verificando puerto %%p...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :%%p 2^>nul') do (
        taskkill /pid %%i /f 2>nul
    )
)

echo.
echo [4/4] Limpiando cache DNS...
ipconfig /flushdns >nul 2>&1

echo.
echo ================================================================
echo                        ✓ COMPLETADO                           
echo ================================================================
echo.
echo Tu entorno esta listo para desarrollo!
echo.
echo Puedes iniciar:
echo - Frontend: npm start
echo - Backend:  mvn spring-boot:run
echo.
pause
