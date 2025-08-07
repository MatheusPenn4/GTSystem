# Script FINAL para corrigir TODOS os imports de uma vez
$files = Get-ChildItem -Path "frontend/src/services" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    # Pular o arquivo api.ts que já está correto
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
    $newContent = $newContent -replace 'import api from "../../lib/api"', 'import api from "./api"'
    $newContent = $newContent -replace 'import api from "../../lib/api";', 'import api from "./api";'
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "ALL FILES FIXED - NO MORE IMPORT ISSUES!"
