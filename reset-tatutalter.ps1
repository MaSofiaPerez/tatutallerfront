# Script específico para resetear TatuTaller
Write-Host "🎨 Reseteando TatuTaller..." -ForegroundColor Magenta
Write-Host "📅 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

# 1. Terminar procesos de desarrollo
Write-Host "`n🔄 Terminando procesos..." -ForegroundColor Cyan
@('node', 'java', 'npm', 'yarn') | ForEach-Object {
    $procs = Get-Process -Name $_ -ErrorAction SilentlyContinue
    if ($procs) {
        $procs | Stop-Process -Force
        Write-Host "✅ Terminado: $_" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  $_ no estaba ejecutándose" -ForegroundColor Gray
    }
}

# 2. Liberar puertos específicos del proyecto
Write-Host "`n🔌 Liberando puertos..." -ForegroundColor Cyan
$projectPorts = @{
    3000 = "Frontend React"
    8080 = "Backend Spring Boot"
    3306 = "MySQL Database"
    5173 = "Vite Dev Server"
    9000 = "Additional Services"
}

$projectPorts.GetEnumerator() | ForEach-Object {
    $port = $_.Key
    $description = $_.Value
    
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        try {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "🔌 Liberado puerto $port ($description)" -ForegroundColor Yellow
        }
        catch {
            Write-Host "❌ Error liberando puerto $port" -ForegroundColor Red
        }
    } else {
        Write-Host "✅ Puerto $port libre ($description)" -ForegroundColor Green
    }
}

# 3. Verificar que los puertos están realmente libres
Write-Host "`n🔍 Verificación final..." -ForegroundColor Cyan
$allFree = $true
@(3000, 8080, 3306) | ForEach-Object {
    $conn = Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "⚠️  Puerto $_ aún ocupado" -ForegroundColor Red
        $allFree = $false
    }
}

if ($allFree) {
    Write-Host "✅ Todos los puertos están libres" -ForegroundColor Green
}

# 4. Limpiar cache DNS
Write-Host "`n🧹 Limpiando cache..." -ForegroundColor Cyan
try {
    ipconfig /flushdns | Out-Null
    Write-Host "✅ Cache DNS limpiado" -ForegroundColor Green
} catch {
    Write-Host "❌ Error limpiando DNS" -ForegroundColor Red
}

# 5. Mostrar resumen
Write-Host "`n================================================================" -ForegroundColor Magenta
Write-Host "                    🎉 ¡TATUTALLLER LISTO!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Ahora puedes ejecutar:" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (React):" -ForegroundColor Cyan
Write-Host "  cd TatuTallerFRONT && npm start" -ForegroundColor White
Write-Host ""
Write-Host "Backend (Spring Boot):" -ForegroundColor Cyan
Write-Host "  cd TatuTallerBACK && mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Base de datos:" -ForegroundColor Cyan
Write-Host "  Asegúrate de que MySQL esté corriendo" -ForegroundColor White
Write-Host ""

# 6. Opciones adicionales
$choice = Read-Host "¿Quieres abrir las carpetas del proyecto? (s/n)"
if ($choice -eq 's' -or $choice -eq 'S') {
    try {
        $frontendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
        $backendPath = $frontendPath -replace 'FRONT$', 'BACK'
        
        if (Test-Path $frontendPath) {
            Start-Process "explorer.exe" -ArgumentList $frontendPath
        }
        if (Test-Path $backendPath) {
            Start-Process "explorer.exe" -ArgumentList $backendPath
        }
        Write-Host "📁 Carpetas abiertas!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error abriendo carpetas" -ForegroundColor Red
    }
}

Write-Host "`n🚀 ¡Feliz desarrollo!" -ForegroundColor Magenta
