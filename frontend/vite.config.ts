import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: mode === 'development' ? "::" : "localhost",
    port: 5173,
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    } : undefined
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Otimizações de performance baseadas no Vite 5.1+
  optimizeDeps: {
    // Melhora a velocidade de inicialização em desenvolvimento
    holdUntilCrawlEnd: false,
    // Pre-bundling de dependências comuns para melhor performance
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zod',
      'react-hook-form',
      '@hookform/resolvers/zod',
    ],
  },
  build: {
    // Otimizações de build para produção
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    // Melhor chunking para cache
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para melhor cache
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers'],
          'ui-vendor': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'radix-vendor': Object.keys(require('./package.json').dependencies).filter(key => key.startsWith('@radix-ui')),
        },
      },
    },
    // Otimizar para produção
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  // CSS optimizations
  css: {
    devSourcemap: mode === 'development',
    postcss: {
      plugins: [],
    },
  },
  // Definir variáveis de ambiente
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'import.meta.env.VITE_API_URL': JSON.stringify(
      mode === 'production' 
        ? 'https://api.gtsystem.com.br' 
        : 'http://localhost:3000'
    ),
  },
}));
