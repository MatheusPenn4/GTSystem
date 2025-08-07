# Script para corrigir TODOS os arquivos de serviço
$files = Get-ChildItem -Path "frontend/src/services" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Substituir TODAS as importações de api
    $newContent = $content -replace 'import api from "@/lib/api"', 'import api from "../lib/api"'
    $newContent = $newContent -replace 'import api from "@/lib/api";', 'import api from "../lib/api";'
    $newContent = $newContent -replace 'import api from "@/lib/api"', 'import api from "../lib/api"'
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "ALL SERVICE FILES FIXED!"
