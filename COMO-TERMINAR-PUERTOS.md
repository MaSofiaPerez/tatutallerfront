# Cómo Terminar Procesos que Usan Puertos en Windows

## Método 1: Ver Puertos en Uso

### Ver todos los puertos ocupados:

```powershell
netstat -ano
```

### Ver puerto específico (ejemplo: 3000):

```powershell
netstat -ano | findstr :3000
```

### Ver solo puertos TCP en escucha:

```powershell
netstat -ano | findstr LISTENING
```

## Método 2: Terminar Proceso Específico

### Paso 1: Encontrar el PID del proceso

```powershell
netstat -ano | findstr :3000
```

Resultado ejemplo:

```
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    1234
```

El PID es `1234`.

### Paso 2: Terminar el proceso por PID

```powershell
taskkill /PID 1234 /F
```

## Método 3: Terminar Múltiples Procesos de Node.js

### Terminar todos los procesos de Node.js:

```powershell
taskkill /IM node.exe /F
```

### Terminar todos los procesos de Java (Spring Boot):

```powershell
taskkill /IM java.exe /F
```

### Terminar todos los procesos de un puerto específico:

```powershell
# Para puerto 3000
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F

# Para puerto 8080 (Spring Boot)
for /f "tokens=5" %a in ('netstat -ano ^| findstr :8080') do taskkill /PID %a /F
```

## Método 4: Script PowerShell para Automatizar

### Crear archivo `kill-ports.ps1`:

```powershell
# Función para terminar proceso en puerto específico
function Kill-ProcessOnPort {
    param([int]$Port)

    $processes = netstat -ano | Select-String ":$Port" | ForEach-Object {
        $fields = $_ -split '\s+'
        $fields[4]
    }

    foreach($pid in $processes) {
        if($pid -match '^\d+$') {
            try {
                Stop-Process -Id $pid -Force
                Write-Host "Terminado proceso PID: $pid en puerto $Port" -ForegroundColor Green
            }
            catch {
                Write-Host "No se pudo terminar proceso PID: $pid" -ForegroundColor Red
            }
        }
    }
}

# Usar la función
Kill-ProcessOnPort -Port 3000
Kill-ProcessOnPort -Port 8080
```

### Ejecutar el script:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\kill-ports.ps1
```

## Método 5: Comandos Rápidos para Desarrollo

### Para tu proyecto específico:

#### Frontend (React - puerto 3000):

```powershell
# Buscar proceso en puerto 3000
netstat -ano | findstr :3000

# Terminar todos los Node.js
taskkill /IM node.exe /F
```

#### Backend (Spring Boot - puerto 8080):

```powershell
# Buscar proceso en puerto 8080
netstat -ano | findstr :8080

# Terminar todos los Java
taskkill /IM java.exe /F
```

#### Base de datos (MySQL - puerto 3306):

```powershell
# Buscar proceso en puerto 3306
netstat -ano | findstr :3306

# Terminar MySQL específico
taskkill /IM mysqld.exe /F
```

## Método 6: Reiniciar Servicios Específicos

### Reiniciar MySQL:

```powershell
# Como administrador
net stop mysql
net start mysql
```

### Reiniciar servicios de red:

```powershell
# Como administrador
netsh winsock reset
netsh int ip reset
```

## Precauciones ⚠️

1. **Usar `/F` con cuidado**: Fuerza el cierre, puede causar pérdida de datos
2. **Verificar antes de terminar**: Asegúrate que no sean procesos del sistema
3. **Guardar trabajo**: Siempre guarda tu trabajo antes de terminar procesos
4. **Administrador**: Algunos comandos requieren ejecutar PowerShell como administrador

## Comandos de Emergencia 🚨

### Si nada funciona, reiniciar stack de red:

```powershell
# Como administrador
ipconfig /release
ipconfig /renew
netsh winsock reset
netsh int ip reset
```

### Ver procesos que más recursos usan:

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
```

## Para tu Proyecto Específico

### Comando todo-en-uno para resetear desarrollo:

```powershell
# Terminar frontend y backend
taskkill /IM node.exe /F 2>$null
taskkill /IM java.exe /F 2>$null

# Verificar que los puertos están libres
netstat -ano | findstr ":3000 :8080 :3306"

Write-Host "Puertos liberados. Puedes reiniciar tu aplicación." -ForegroundColor Green
```

Guarda este comando en un archivo `.bat` o `.ps1` para uso rápido.

## Métodos Modernos y Eficientes 🚀

### Script PowerShell Avanzado para Desarrollo

Crea `reset-dev.ps1`:

```powershell
# Script avanzado para resetear entorno de desarrollo
param(
    [int[]]$Ports = @(3000, 3001, 5000, 5173, 8080, 8000, 9000),
    [switch]$KillAll,
    [switch]$Verbose
)

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Stop-ProcessByPort {
    param([int]$Port, [bool]$ShowDetails = $false)

    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

        if ($connections) {
            Write-ColorOutput "🔍 Liberando puerto $Port..." "Yellow"

            foreach ($connection in $connections) {
                $processId = $connection.OwningProcess
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

                if ($process) {
                    if ($ShowDetails) {
                        Write-ColorOutput "  📋 Proceso: $($process.ProcessName) (PID: $processId)" "Cyan"
                        Write-ColorOutput "  🕒 Iniciado: $($process.StartTime)" "Gray"
                    }

                    try {
                        Stop-Process -Id $processId -Force -ErrorAction Stop
                        Write-ColorOutput "  ✅ Terminado: $($process.ProcessName)" "Green"
                    }
                    catch {
                        Write-ColorOutput "  ❌ Error terminando proceso $processId" "Red"
                    }
                }
            }
        } else {
            if ($ShowDetails) {
                Write-ColorOutput "✅ Puerto $Port libre" "Green"
            }
        }
    }
    catch {
        Write-ColorOutput "❌ Error verificando puerto $Port" "Red"
    }
}

function Stop-DevelopmentProcesses {
    $devProcesses = @("node", "npm", "yarn", "pnpm", "vite", "webpack-dev-server", "java")

    Write-ColorOutput "`n🔄 Terminando procesos de desarrollo..." "Cyan"

    foreach ($processName in $devProcesses) {
        $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($processes) {
            Write-ColorOutput "🎯 Terminando procesos de $processName..." "Yellow"
            foreach ($proc in $processes) {
                try {
                    Stop-Process -Id $proc.Id -Force -ErrorAction Stop
                    Write-ColorOutput "  ✅ $processName (PID: $($proc.Id))" "Green"
                }
                catch {
                    Write-ColorOutput "  ❌ No se pudo terminar $processName (PID: $($proc.Id))" "Red"
                }
            }
        }
    }
}

# Ejecutar script
Write-ColorOutput "🚀 Iniciando limpieza del entorno de desarrollo..." "Magenta"
Write-ColorOutput "📅 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Gray"

if ($KillAll) {
    Stop-DevelopmentProcesses
}

Write-ColorOutput "`n🔌 Verificando puertos..." "Cyan"
foreach ($port in $Ports) {
    Stop-ProcessByPort -Port $port -ShowDetails $Verbose
}

Write-ColorOutput "`n🧹 Limpieza DNS..." "Cyan"
try {
    ipconfig /flushdns | Out-Null
    Write-ColorOutput "✅ Cache DNS limpiado" "Green"
}
catch {
    Write-ColorOutput "❌ Error limpiando DNS" "Red"
}

Write-ColorOutput "`n🎉 Limpieza completada! Tu entorno está listo." "Green"
```

### Comandos de Una Línea Ultra-Rápidos

#### Para React/Frontend:

```powershell
# Terminar y verificar puerto 3000
(Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force); if(!(Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue)){"✅ Puerto 3000 libre"}else{"❌ Puerto 3000 ocupado"}
```

#### Para Spring Boot/Backend:

```powershell
# Terminar y verificar puerto 8080
(Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force); if(!(Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue)){"✅ Puerto 8080 libre"}else{"❌ Puerto 8080 ocupado"}
```

#### Reseteo completo en una línea:

```powershell
@('node','java','npm') | ForEach{Get-Process -Name $_ -ErrorAction SilentlyContinue | Stop-Process -Force}; @(3000,8080,3306) | ForEach{$p=Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue; if($p){Stop-Process -Id $p.OwningProcess -Force}}; "🎉 Reseteo completo"
```

## Archivo Batch Automático 📁

Crea `reset-dev.bat`:

```batch
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
```

## Troubleshooting Avanzado 🔧

### Verificar qué aplicación usa un puerto:

```powershell
function Get-PortInfo {
    param([int]$Port)

    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connection) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        return [PSCustomObject]@{
            Port = $Port
            PID = $connection.OwningProcess
            ProcessName = $process.ProcessName
            StartTime = $process.StartTime
            Status = $connection.State
        }
    }
    return $null
}

# Uso:
Get-PortInfo -Port 3000
```

### Monitor de puertos en tiempo real:

```powershell
# Monitorear puertos cada 2 segundos
while ($true) {
    Clear-Host
    Write-Host "🔍 Monitor de Puertos - $(Get-Date)" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan

    @(3000, 8080, 3306) | ForEach-Object {
        $info = Get-PortInfo -Port $_
        if ($info) {
            Write-Host "Puerto $_`: $($info.ProcessName) (PID: $($info.PID))" -ForegroundColor Yellow
        } else {
            Write-Host "Puerto $_`: LIBRE" -ForegroundColor Green
        }
    }

    Write-Host "`nPresiona Ctrl+C para salir" -ForegroundColor Gray
    Start-Sleep 2
}
```

## Integración con VS Code ⚙️

### Crear tarea en VS Code (.vscode/tasks.json):

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Reset Development Environment",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "@('node','java','npm') | ForEach{Get-Process -Name $_ -ErrorAction SilentlyContinue | Stop-Process -Force}; Write-Host 'Entorno reseteado!' -ForegroundColor Green"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    }
  ]
}
```

## Alias PowerShell para Desarrollo 💻

Agrega a tu perfil de PowerShell (`$PROFILE`):

```powershell
# Aliases para desarrollo
function Reset-DevEnv {
    @('node','java','npm') | ForEach{Get-Process -Name $_ -ErrorAction SilentlyContinue | Stop-Process -Force}
    Write-Host "🎉 Entorno reseteado!" -ForegroundColor Green
}

function Check-Ports {
    @(3000,8080,3306) | ForEach{
        $p=Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue
        if($p) {"Puerto $_`: OCUPADO"} else {"Puerto $_`: libre"}
    }
}

# Usar como:
# Reset-DevEnv
# Check-Ports
```

## Comandos Específicos para TatuTaller 🎯

### Reseteo completo del proyecto:

```powershell
# Guardar como reset-tatutalter.ps1
Write-Host "🎨 Reseteando TatuTaller..." -ForegroundColor Magenta

# 1. Terminar procesos
@('node', 'java', 'npm') | ForEach-Object {
    $procs = Get-Process -Name $_ -ErrorAction SilentlyContinue
    if ($procs) {
        $procs | Stop-Process -Force
        Write-Host "✅ Terminado: $_" -ForegroundColor Green
    }
}

# 2. Liberar puertos específicos
@(3000, 8080, 3306) | ForEach-Object {
    $conn = Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "🔌 Liberado puerto: $_" -ForegroundColor Yellow
    }
}

# 3. Limpiar cache
ipconfig /flushdns | Out-Null
Write-Host "🧹 Cache DNS limpiado" -ForegroundColor Cyan

Write-Host "`n🎉 ¡TatuTaller listo para desarrollo!" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar:" -ForegroundColor White
Write-Host "  Frontend: npm start" -ForegroundColor Cyan
Write-Host "  Backend:  mvn spring-boot:run" -ForegroundColor Cyan
```

### Para uso diario rápido:

```powershell
# Comando de una línea para TatuTaller
powershell -Command "@('node','java','npm')|%{ps $_ -EA 0|kill -Force};@(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){kill -Id $c.OwningProcess -Force -EA 0}};ipconfig /flushdns>$null;echo '🎉 TatuTaller reseteado!'"
```
