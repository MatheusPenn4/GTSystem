# Script para corrigir imports do @/lib/utils
$files = Get-ChildItem -Path "frontend/src/components/ui" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'import \{ cn \} from "@/lib/utils"', 'import { cn } from "../../lib/utils"'
    Set-Content $file.FullName $newContent -NoNewline
    Write-Host "Fixed: $($file.Name)"
}

Write-Host "All imports fixed!"
