$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$runtime = Join-Path $projectRoot 'tools\node-v22.16.0-win-x64\node.exe'
if (-not (Test-Path -LiteralPath $runtime)) { $runtime = (Get-Command node -ErrorAction Stop).Source }
$serverScript = Join-Path $projectRoot 'tools\server.mjs'
$url = 'http://127.0.0.1:4173'
$ready = $false
try { $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; $ready = $response.Content -match 'OPS ImAn' } catch {}
if (-not $ready) {
    Start-Process -FilePath $runtime -ArgumentList ('"' + $serverScript + '"') -WorkingDirectory $projectRoot -WindowStyle Hidden
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        Start-Sleep -Milliseconds 250
        try { $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; if ($response.Content -match 'OPS ImAn') { $ready = $true; break } } catch {}
    }
}
if (-not $ready) { throw 'Pelayan tidak dapat dimulakan. Semak penggunaan port 4173.' }
Start-Process $url
