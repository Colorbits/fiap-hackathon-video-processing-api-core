FROM node:20-alpine3.20 as builder

# Criando diretório base da aplicação para o build
WORKDIR /usr/src/app

# Copiando arquivos do projeto para gerar distribuição
COPY package*.json ./

# Instalando dependências do projeto
RUN npm ci

# Copiando o restante dos arquivos
COPY . .

# Compilar o projeto
RUN npm run build

# Imagem final
FROM node:20-alpine3.20

# Instalação do FFmpeg
RUN apk add --no-cache ffmpeg

# Instalando curl para usar comando de health check.
RUN apk add curl

# Criando diretório base da aplicação
WORKDIR /usr/src/app

# Copiar arquivos de build e dependências de produção
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Criar diretórios necessários para arquivos
RUN mkdir -p /usr/src/app/files/videos /usr/src/app/files/images

# Porta da aplicação
EXPOSE 3000

# Comando para executar a aplicação
CMD [ "node", "dist/main.js" ]
