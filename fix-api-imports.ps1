# Script para corrigir importações de api
$files = Get-ChildItem -Path "frontend/src/services" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Substituir importação de api
    $newContent = $content -replace 'import api from "@/lib/api"', 'import api from "../lib/api"'
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "All API imports fixed!"
