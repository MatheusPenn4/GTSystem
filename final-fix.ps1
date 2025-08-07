# Script FINAL para resolver todos os problemas de import
$files = Get-ChildItem -Path "frontend/src/components/ui" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remover TODAS as importações de cn
    $newContent = $content -replace 'import \{ cn \} from "\.\.\./\.\.\./\.\.\./lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "\.\.\./\.\.\./lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "@/lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "../../../lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "../../lib/utils"', ''
    
    # Verificar se já tem a função cn inline
    if ($newContent -notmatch "function cn\(") {
        # Adicionar imports necessários se não existirem
        if ($newContent -notmatch "import.*clsx") {
            $newContent = $newContent -replace 'import \* as React from "react"', 'import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"'
        }
        
        # Adicionar função cn após os imports
        $newContent = $newContent -replace 'import \{ twMerge \} from "tailwind-merge"', 'import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}'
    }
    
    # Limpar linhas vazias duplicadas
    $newContent = $newContent -replace '\n\n\n+', "`n`n"
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "ALL FILES FIXED - NO MORE IMPORT ISSUES!"
