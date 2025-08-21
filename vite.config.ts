import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    // Proxy apenas para desenvolvimento local
    ...(mode === 'development' && {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path
        }
      }
    })
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
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
    // Otimizações de build
    target: 'esnext',
    minify: 'esbuild',
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
        },
      },
    },
    // Otimizar para produção
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  // CSS optimizations
  css: {
    devSourcemap: mode === 'development',
  },
}));
