# Instruções para Execução do GTSystem

Este documento contém as instruções para executar o GTSystem corretamente no ambiente Windows.

## Pré-requisitos

- Node.js (versão 18+)
- PowerShell
- Python 3.8+ (para o backend)
- Git (opcional, para clonar o repositório)

## Inicialização do Sistema com Backend Real

O sistema está configurado para usar dados reais do backend. Para iniciar o sistema completo:

1. Abra o PowerShell
2. Navegue até a pasta raiz do projeto
3. Execute o script de inicialização do sistema completo:

```powershell
.\start_system.ps1
```

Este script irá:
- Iniciar o backend Python em uma janela PowerShell separada
- Iniciar o frontend em outra janela PowerShell separada
- Configurar o sistema para usar dados reais

## Inicializando Apenas o Frontend

Para iniciar apenas o frontend (que se conectará ao backend real):

```powershell
.\start_frontend.ps1
```

Este script irá:
- Navegar até a pasta do frontend
- Iniciar o servidor de desenvolvimento com `npm run dev`
- Configurar automaticamente para usar dados reais do backend

## Inicializando Apenas o Backend

Se precisar iniciar apenas o backend:

1. Abra o PowerShell
2. Navegue até a pasta raiz do projeto
3. Execute os comandos:

```powershell
cd backend
python start_server.py
```

## Problemas Comuns

### Erro com o comando &&

No PowerShell do Windows, o operador && não funciona como em sistemas Unix. Por isso, 
criamos scripts específicos para o PowerShell que executam os comandos em sequência.

### Erro de Conexão com Backend

Se você encontrar erros de conexão com o backend:

1. Verifique se o backend está rodando na porta 8000
2. Certifique-se de que não há problemas de CORS
3. Verifique o console do navegador para detalhes do erro

### Backend não Inicia

Se o backend não iniciar corretamente:

1. Verifique se todas as dependências estão instaladas:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```
2. Verifique os logs na pasta `backend/logs`

### Limpeza do Sistema

Para limpar o estado do sistema e começar novamente:

1. Pare todos os servidores em execução (Ctrl+C nas janelas do PowerShell)
2. Abra o navegador e limpe os dados do site (incluindo localStorage)
3. Reinicie o sistema usando os scripts fornecidos

## Navegação Rápida

- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard
- **Admin**: http://localhost:5173/admin/dashboard
- **Estacionamento**: http://localhost:5173/parking/dashboard
- **Transportadora**: http://localhost:5173/company/dashboard
- **Motorista**: http://localhost:5173/driver/dashboard 