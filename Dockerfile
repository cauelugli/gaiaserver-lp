# ==================== ESTÁGIO 1: Build do Frontend ====================
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --force
COPY frontend .
RUN npm run build

# ==================== ESTÁGIO 2: Build Completo ====================
FROM node:18-alpine as backend-builder
WORKDIR /app

# Copia todos os arquivos necessários
COPY package*.json ./
COPY api/package*.json ./api/
COPY queues/package*.json ./queues/
COPY models/package*.json ./models/
COPY controllers/package*.json ./controllers/

RUN npm install --prefix api && npm install --prefix queues && npm install --prefix models && npm install --prefix controllers

# Copia todo o código fonte
COPY . .

# ==================== ESTÁGIO 3: Imagem da API ====================
FROM node:18-alpine as api-production
WORKDIR /app

COPY --from=backend-builder /app/api ./api
COPY --from=backend-builder /app/models ./models
COPY --from=backend-builder /app/controllers ./controllers
COPY --from=backend-builder /app/uploads ./uploads
COPY --from=backend-builder /app/queues ./queues 
ENV NODE_ENV=production
CMD ["node", "/app/api/index.js"]

# ==================== ESTÁGIO 4: Imagem do Queue ====================
FROM node:18-alpine as queue-production
WORKDIR /app

COPY --from=backend-builder /app/queues ./queues
COPY --from=backend-builder /app/models ./models
COPY --from=backend-builder /app/controllers ./controllers

ENV NODE_ENV=production
CMD ["node", "/app/queues/mainQueue.js"]

# ==================== ESTÁGIO 5: Imagem do Nginx (Frontend) ====================
FROM nginx:alpine as nginx-production

# Copia os arquivos buildados do frontend
RUN chmod -R 755 /usr/share/nginx/html && chown -R nginx:nginx /usr/share/nginx/html
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY --from=backend-builder /app/uploads /usr/share/nginx/html/static
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]