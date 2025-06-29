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
Write-ColorOutput "Uso: .\reset-dev.ps1 [-KillAll] [-Verbose] [-Ports 3000,8080]" "Gray"
