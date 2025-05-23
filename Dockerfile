# Usa uma imagem base oficial do Node.js para construir o app
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install 

# Copia o restante do app
COPY . .

# Constrói a aplicação Next.js para produção
RUN npm run build

# Base menor para o ambiente de produção
FROM node:20-alpine AS runner

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários da etapa de construção
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta que o app Next.js usa
EXPOSE 3000

# Comando para iniciar o app Next.js
CMD ["npm", "start"]
