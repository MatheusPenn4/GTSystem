# Validação de Permissões no GTSystem

Este documento descreve as ferramentas e processos para validar e manter a consistência do sistema de permissões no GTSystem.

## Ferramentas de Validação

O sistema inclui várias ferramentas para validar permissões:

1. **Script de Validação de Permissões** - Analisa o código-fonte para identificar todas as permissões usadas e detectar possíveis inconsistências
2. **Testes Unitários** - Valida o funcionamento dos hooks e componentes de permissão
3. **Testes de Integração** - Valida o fluxo completo do sistema de permissões

## Script de Validação de Permissões

O script `validatePermissions.ts` analisa todo o código-fonte do frontend para:

- Identificar todas as permissões únicas usadas no sistema
- Agrupar as permissões por arquivo, componente e tipo
- Detectar possíveis inconsistências, como:
  - Permissões usadas apenas uma vez (potenciais erros de digitação)
  - Permissões com nomes muito similares (possíveis duplicações)

### Executando a Validação

Para executar a validação de permissões:

```bash
# Via npm
npm run validate:permissions

# Ou via script batch no Windows
.\validate_permissions.bat
```

### Relatórios Gerados

O script gera dois relatórios na pasta `frontend/reports/`:

1. `permissions-usage-report.json` - Relatório detalhado em formato JSON
2. `permissions-usage-summary.md` - Resumo em formato Markdown

## Boas Práticas para Permissões

Para manter a consistência do sistema de permissões:

1. **Nomenclatura Padronizada** - Use o formato `verbo_substantivo_contexto` para nomear permissões:
   - `view_admin_dashboard`
   - `edit_user_profile`
   - `delete_parking_spot`

2. **Reutilização** - Reutilize permissões existentes sempre que possível, em vez de criar novas
   
3. **Agrupamento** - Agrupe permissões logicamente por funcionalidade:
   - `view_*` para visualizações
   - `edit_*` para edições
   - `delete_*` para exclusões

4. **Documentação** - Documente todas as permissões criadas

5. **Validação Regular** - Execute o script de validação regularmente, especialmente após adicionar novas funcionalidades

## Verificação de Permissões no Backend

Para garantir a consistência entre o frontend e o backend:

1. Execute o script de verificação do backend para mapear as permissões definidas no backend:

```bash
cd backend/scripts
.\check_permissions.bat
```

2. Compare as permissões do backend com as do frontend usando o relatório gerado

## Resolução de Problemas Comuns

### Inconsistências de Permissão

Se o script detectar permissões com nomes similares:

1. Verifique se são realmente permissões diferentes
2. Padronize os nomes se forem a mesma permissão
3. Documente a diferença se forem permissões distintas

### Permissões Não Encontradas

Se uma permissão do backend não for encontrada no frontend (ou vice-versa):

1. Verifique se a permissão ainda é necessária
2. Adicione a permissão ao código se for necessária
3. Remova a permissão do código se não for mais necessária

## Manutenção Contínua

A manutenção do sistema de permissões deve ser um processo contínuo:

1. Execute a validação antes de cada release
2. Audite as permissões periodicamente
3. Mantenha a documentação atualizada
4. Verifique a cobertura de testes para as permissões 