# Comandos Rápidos para Desarrollo - TatuTaller

# Copiar y pegar directamente en PowerShell

# ========================================

# COMANDOS DE UNA LÍNEA PARA COPIAR/PEGAR

# ========================================

# 🚀 RESETEO COMPLETO TATUTALLLER (Ultra-rápido)

@('node','java','npm')|%{ps $_ -EA 0|kill -Force};@(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){kill -Id $c.OwningProcess -Force -EA 0}};ipconfig /flushdns>$null;echo '🎉 TatuTaller reseteado!'

# 🔍 VERIFICAR PUERTOS (Ver qué está ocupado)

@(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){$p=ps -Id $c.OwningProcess -EA 0;"Puerto $_`: $($p.ProcessName) (PID: $($p.Id))"}else{"Puerto $\_`: LIBRE"}}

# 🛑 SOLO TERMINAR NODE.JS

ps node -EA 0|kill -Force;echo '✅ Node.js terminado'

# 🛑 SOLO TERMINAR JAVA (Spring Boot)

ps java -EA 0|kill -Force;echo '✅ Java terminado'

# 🔌 LIBERAR SOLO PUERTO 3000 (Frontend)

$c=Get-NetTCPConnection -LocalPort 3000 -EA 0;if($c){kill -Id $c.OwningProcess -Force;echo '✅ Puerto 3000 libre'}else{echo '✅ Puerto 3000 ya estaba libre'}

# 🔌 LIBERAR SOLO PUERTO 8080 (Backend)

$c=Get-NetTCPConnection -LocalPort 8080 -EA 0;if($c){kill -Id $c.OwningProcess -Force;echo '✅ Puerto 8080 libre'}else{echo '✅ Puerto 8080 ya estaba libre'}

# ========================================

# COMANDOS PARA CMD/BATCH

# ========================================

# Terminar Node.js en CMD

taskkill /f /im node.exe & echo Node.js terminado

# Terminar Java en CMD

taskkill /f /im java.exe & echo Java terminado

# Reseteo completo en CMD

taskkill /f /im node.exe & taskkill /f /im java.exe & echo Procesos terminados

# ========================================

# ALIASES PARA AGREGAR AL PERFIL $PROFILE

# ========================================

# Agregar estas funciones a tu perfil de PowerShell:

# Abrir perfil: notepad $PROFILE

function tt-reset {
@('node','java','npm')|%{ps $_ -EA 0|kill -Force}
    @(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){kill -Id $c.OwningProcess -Force -EA 0}}
    ipconfig /flushdns>$null
Write-Host '🎉 TatuTaller reseteado!' -ForegroundColor Green
}

function tt-check {
@(3000,8080,3306)|%{
$c=Get-NetTCPConnection -LocalPort $_ -EA 0
        if($c) {
$p=ps -Id $c.OwningProcess -EA 0
            Write-Host "Puerto $_`: $($p.ProcessName) (PID: $($p.Id))" -ForegroundColor Yellow
} else {
Write-Host "Puerto $\_`: LIBRE" -ForegroundColor Green
}
}
}

function tt-ports { netstat -ano | findstr ":3000 :8080 :3306" }

function tt-frontend {
$c=Get-NetTCPConnection -LocalPort 3000 -EA 0
    if($c){kill -Id $c.OwningProcess -Force}
echo '🔌 Puerto 3000 liberado para frontend'
}

function tt-backend {
$c=Get-NetTCPConnection -LocalPort 8080 -EA 0
    if($c){kill -Id $c.OwningProcess -Force}
echo '🔌 Puerto 8080 liberado para backend'
}

# ========================================

# COMANDOS AVANZADOS

# ========================================

# Monitor en tiempo real (Ctrl+C para salir)

while($true){cls;echo "🔍 Monitor TatuTaller - $(Get-Date)";echo "="*40;@(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){$p=ps -Id $c.OwningProcess -EA 0;"Puerto $_`: $($p.ProcessName)"}else{"Puerto $\_`: LIBRE"}};sleep 2}

# Ver procesos ordenados por uso de CPU

ps|sort CPU -Desc|select -First 10 Name,CPU,WorkingSet|ft -Auto

# Ver todas las conexiones TCP activas

Get-NetTCPConnection|where State -eq Listen|select LocalAddress,LocalPort,@{n='Process';e={(ps -Id $\_.OwningProcess).ProcessName}}|sort LocalPort

# ========================================

# PARA USAR DESDE VS CODE TERMINAL

# ========================================

# Terminal integrado de VS Code - Comando rápido

Ctrl+` # Abrir terminal

# Luego pegar cualquiera de los comandos de arriba

# Tarea de VS Code (agregar a .vscode/tasks.json):

# {

# "label": "Reset TatuTaller",

# "type": "shell",

# "command": "powershell",

# "args": ["-Command", "@('node','java','npm')|%{ps $_ -EA 0|kill -Force}; echo 'Reseteo completo'"],

# "group": "build"

# }

# ========================================

# TROUBLESHOOTING

# ========================================

# Si los comandos no funcionan, ejecutar primero:

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Si aparece error de permisos:

# Ejecutar PowerShell como Administrador

# Para ver ayuda de un comando:

Get-Help Get-NetTCPConnection -Examples

# ========================================

# COMANDOS FAVORITOS PARA MEMORIZAR

# ========================================

# 1. Reseteo total ultra-rápido (copiar este):

@('node','java','npm')|%{ps $_ -EA 0|kill -Force};@(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){kill -Id $c.OwningProcess -Force -EA 0}};echo '🎉 Listo!'

# 2. Solo verificar puertos:

@(3000,8080,3306)|%{$c=Get-NetTCPConnection -LocalPort $_ -EA 0;if($c){"Puerto $_`: OCUPADO"}else{"Puerto $_`: libre"}}

# 3. Terminar solo Node.js:

ps node -EA 0|kill -Force

# 4. Terminar solo Java:

ps java -EA 0|kill -Force
