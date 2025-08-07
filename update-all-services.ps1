# Script para atualizar TODOS os arquivos de serviço
$files = Get-ChildItem -Path "frontend/src/services" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    # Pular o arquivo api.ts que acabamos de criar
    if ($file.Name -eq "api.ts") {
        Write-Host "Skipped: $($file.Name) (api.ts)"
        continue
    }
    
    $content = Get-Content $file.FullName -Raw
    
    # Substituir TODAS as importações de api
    $newContent = $content -replace 'import api from "@/lib/api"', 'import api from "./api"'
    $newContent = $newContent -replace 'import api from "@/lib/api";', 'import api from "./api";'
    $newContent = $newContent -replace 'import api from "../lib/api"', 'import api from "./api"'
    $newContent = $newContent -replace 'import api from "../lib/api";', 'import api from "./api";'
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "ALL SERVICE FILES UPDATED!"
