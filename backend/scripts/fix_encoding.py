import os
from pathlib import Path

def fix_file_encoding(file_path):
    """
    Corrige problemas de codificação em arquivos
    """
    try:
        # Tentar várias codificações
        encodings = ['utf-8', 'latin1', 'cp1252']
        content = None
        
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    content = f.read()
                break  # Se conseguimos ler o arquivo, sair do loop
            except UnicodeDecodeError:
                continue
        
        if content is None:
            print(f"Não foi possível decodificar o arquivo: {file_path}")
            return False
        
        # Escrever o arquivo com codificação UTF-8
        with open(file_path, 'w', encoding='utf-8') as f:
            # Substituir caracteres problemáticos
            content = content.replace('ç', 'c')
            content = content.replace('ã', 'a')
            content = content.replace('õ', 'o')
            content = content.replace('á', 'a')
            content = content.replace('é', 'e')
            content = content.replace('í', 'i')
            content = content.replace('ó', 'o')
            content = content.replace('ú', 'u')
            content = content.replace('ê', 'e')
            content = content.replace('ô', 'o')
            content = content.replace('â', 'a')
            f.write(content)
        
        print(f"Arquivo corrigido: {file_path}")
        return True
    except Exception as e:
        print(f"Erro ao corrigir arquivo {file_path}: {str(e)}")
        return False

def fix_project_encoding():
    """
    Corrige a codificação de todos os arquivos Python do projeto
    """
    base_dir = Path(__file__).resolve().parent.parent
    
    # Arquivos a serem verificados
    files_to_check = [
        base_dir / "parkingmgr" / "settings" / "base.py",
        base_dir / "parkingmgr" / "settings" / "__init__.py",
    ]
    
    # Verificar arquivos específicos
    for file_path in files_to_check:
        if file_path.exists():
            fix_file_encoding(file_path)
    
    print("Arquivos de configuração corrigidos!")

if __name__ == "__main__":
    fix_project_encoding()
