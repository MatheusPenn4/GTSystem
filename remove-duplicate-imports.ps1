# Script para remover importações duplicadas de cn
$files = Get-ChildItem -Path "frontend/src/components/ui" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remover importações de cn
    $newContent = $content -replace 'import \{ cn \} from "\.\.\./\.\.\./\.\.\./lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "\.\.\./\.\.\./lib/utils"', ''
    $newContent = $newContent -replace 'import \{ cn \} from "@/lib/utils"', ''
    
    # Remover linhas vazias duplicadas
    $newContent = $newContent -replace '\n\n\n', "`n`n"
    
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Cleaned: $($file.Name)"
}

Write-Host "All duplicate imports removed!"
