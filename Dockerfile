# ==================== ESTÁGIO 1: Build do Frontend (Vite) ====================
FROM node:18 as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# ==================== ESTÁGIO 2: Build do Backend (Node.js + Queues) ====================
FROM node:18 as backend-builder
WORKDIR /app

# Instala API
COPY api/package*.json ./api/
RUN npm install --prefix api
COPY api ./api

# Instala Queues
COPY queues/package*.json ./queues/
RUN npm install --prefix queues
COPY queues ./queues

# Instala Models (se existir package.json)
COPY models/package*.json ./models/
RUN if [ -f "models/package.json" ]; then npm install --prefix models; fi

# Copia arquivos do projeto
COPY controllers ./controllers
COPY models ./models
COPY uploads ./uploads

# ==================== ESTÁGIO 3: Imagem Final (Node.js + NGINX) ====================
FROM node:18 as production

# 1. Instala NGINX e remove configuração padrão
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -f /etc/nginx/conf.d/default.conf

# 2. Configura NGINX
COPY --from=frontend-builder /app/frontend/dist /var/www/html
COPY nginx.conf /etc/nginx/conf.d/app.conf

# 3. Configura permissões do NGINX
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# 4. Copia o backend
WORKDIR /app
COPY --from=backend-builder /app .

# 5. Instala dependências de produção
RUN npm install --production --prefix api && \
    npm install --production --prefix queues && \
    if [ -f "models/package.json" ]; then npm install --production --prefix models; fi

ARG MONGO_URL
ENV MONGO_URL=${MONGO_URL}

# 6. Portas expostas (comentários removidos após EXPOSE)
EXPOSE 80
EXPOSE 3000

# 7. Comando de inicialização otimizado
CMD ["sh", "-c", "nginx -g 'daemon off;' & node api/index.js & node queues/mainQueue.js"]