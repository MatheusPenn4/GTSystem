FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Imagem final
FROM node:18-alpine AS runner

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos compilados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Expor porta
EXPOSE 3000

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/status || exit 1

# Comando de inicialização
CMD ["node", "dist/index.js"] 