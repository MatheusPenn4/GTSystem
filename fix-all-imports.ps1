# Script para adicionar a função cn diretamente em todos os arquivos
$files = Get-ChildItem -Path "frontend/src/components/ui" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Verificar se já tem a função cn
    if ($content -match "function cn\(") {
        Write-Host "Skipped (already has cn): $($file.Name)"
        continue
    }
    
    # Adicionar imports necessários
    $newContent = $content -replace 'import \* as React from "react"', 'import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"'
    
    # Adicionar função cn após os imports
    $newContent = $newContent -replace 'import \{ cn \} from "\.\.\./\.\.\./\.\.\./lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "\.\.\./\.\.\./lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "@/lib/utils"', ''
    
    # Adicionar função cn após os imports
    $newContent = $newContent -replace 'import \{ twMerge \} from "tailwind-merge"', 'import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}'
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "All files updated with inline cn function!"
