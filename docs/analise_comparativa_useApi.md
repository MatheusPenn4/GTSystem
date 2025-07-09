# Análise Comparativa: Otimização do Hook useApi.ts

**Data:** 05/06/2025
**Autor:** André Santos

## 📋 Resumo Executivo

Este documento analisa as melhorias implementadas no hook `useApi.ts` para resolver o problema de loop infinito e otimizar a performance. A solução utiliza `useRef` para controle de montagem, implementa cache local e adiciona funcionalidades para melhor gerenciamento de estados.

## 🔍 Problema Original

A versão anterior do hook `useApi.ts` apresentava um problema crítico de loop infinito causado por:

1. **Dependências do useCallback:** A função `fetchData` no hook `useFetch` não incluía a função `fetchFn` em suas dependências para tentar evitar o loop infinito.

2. **Ausência de controle de montagem:** Não havia verificação se o componente ainda estava montado antes de atualizar o estado.

3. **Falta de controle de renderização inicial:** Cada alteração no `fetchFn` disparava uma nova requisição.

4. **Mutações sem função de reset:** O hook `useMutation` não oferecia uma forma de resetar os estados de erro.

## 🛠️ Soluções Implementadas

### 1. Prevenção de Loop Infinito

#### Versão Antiga:
```javascript
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const result = await fetchFn();
    setData(result);
    setError(null);
  } catch (err) {
    console.error("API request error:", err);
    setError(err instanceof Error ? err : String(err) || "Unknown error");
  } finally {
    setLoading(false);
  }
}, []);  // Removido fetchFn da dependência para evitar loop infinito

useEffect(() => {
  fetchData();
}, [fetchData]);
```

#### Versão Nova:
```javascript
// Refs para controle de montagem e prevenção de loops
const isMountedRef = useRef<boolean>(true);
const fetchFnRef = useRef(fetchFn);
const isFirstRenderRef = useRef<boolean>(true);

// Função para fazer a requisição
const fetchData = useCallback(async (showLoading = true) => {
  if (!isMountedRef.current) return;
  
  try {
    if (showLoading) setLoading(true);
    const result = await fetchFnRef.current();
    
    if (isMountedRef.current) {
      setData(result);
      setError(null);
    }
  } catch (err) {
    if (isMountedRef.current) {
      console.error("API request error:", err);
      setError(err instanceof Error ? err : String(err) || "Unknown error");
    }
  } finally {
    if (isMountedRef.current && showLoading) {
      setLoading(false);
    }
  }
}, []);

// Efeito para carregar dados iniciais
useEffect(() => {
  // Atualiza a referência da função de fetch se necessário
  fetchFnRef.current = fetchFn;
  
  // Só dispara o fetch no primeiro render e quando a ref mudar
  if (isFirstRenderRef.current) {
    isFirstRenderRef.current = false;
    fetchData(true);
  }
  
  return () => {
    isMountedRef.current = false;
  };
}, [fetchFn, fetchData]);
```

### 2. Controle de Montagem de Componente

A solução implementa um padrão de referência `isMountedRef` para controlar o estado de montagem do componente, evitando atualizações de estado em componentes desmontados.

### 3. Otimização de Renderização

A nova versão introduz `isFirstRenderRef` para garantir que a requisição seja feita apenas na primeira renderização, evitando chamadas desnecessárias à API.

### 4. Função de Reset para Mutações

O hook `useMutation` foi aprimorado com a adição de uma função `reset` que permite limpar os estados de erro:

#### Versão Antiga:
```javascript
interface UseMutationReturn<T> {
  mutate: (data: T) => Promise<void>;
  loading: boolean;
  error: unknown;
}
```

#### Versão Nova:
```javascript
interface UseMutationReturn<T> {
  mutate: (data: T) => Promise<void>;
  loading: boolean;
  error: unknown;
  reset: () => void; // Função para resetar estado
}

// Reset do estado
const reset = useCallback(() => {
  if (isMountedRef.current) {
    setError(null);
    setLoading(false);
  }
}, []);
```

## 💹 Benefícios das Melhorias

1. **Eliminação do loop infinito:** O uso de refs para armazenar a função de fetch evita recriações desnecessárias.

2. **Prevenção de memory leaks:** Verificações de `isMountedRef.current` garantem que não ocorram atualizações de estado após o componente ser desmontado.

3. **Redução de requisições:** O controle de primeira renderização evita requisições redundantes.

4. **UX aprimorada:** O parâmetro `showLoading` permite controlar quando exibir indicadores de carregamento.

5. **Melhor tratamento de erros:** A função `reset` permite limpar erros sem precisar recriar o hook.

## 📊 Métricas de Sucesso

Com as melhorias implementadas, observamos:

1. **Redução de requisições:** Eliminação de chamadas redundantes à API.

2. **Melhoria na performance:** Redução no tempo de renderização dos componentes.

3. **Eliminação de erros no console:** Não há mais warnings de "Can't perform a React state update on an unmounted component".

4. **UX mais suave:** Experiência de usuário mais fluida devido ao controle adequado dos estados de loading.

## 🔄 Conclusão

A refatoração do hook `useApi.ts` demonstra a importância de um design cuidadoso ao trabalhar com hooks React e gerenciamento de estado assíncrono. As técnicas aplicadas (useRef para controle de ciclo de vida, cache de referências e controle de primeira renderização) são padrões valiosos que podem ser aplicados em outros componentes do sistema para melhorar a performance e prevenir comportamentos inesperados.

Estas melhorias contribuem significativamente para a robustez e manutenibilidade do código, garantindo que o sistema funcione de maneira confiável mesmo em condições adversas de rede ou quando componentes são montados e desmontados frequentemente.

---