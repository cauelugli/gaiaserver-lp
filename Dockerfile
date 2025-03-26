# Estágio 1: Frontend Builder
FROM node:18 as frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copia frontend e pastas compartilhadas que ele precisa
COPY frontend .
COPY controllers /app/controllers
COPY models /app/models

RUN npm run build

# Estágio 2: Backend Builder
FROM node:18 as backend-builder

WORKDIR /app

# Copia especificamente a pasta api e arquivos raiz
COPY api ./api
COPY package.json package-lock.json ./
COPY controllers ./controllers
COPY models ./models
COPY queues ./queues
COPY websocket ./websocket

RUN npm install

# Estágio Final
FROM node:18

WORKDIR /app

# Copia o backend
COPY --from=backend-builder /app .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Garante que a pasta uploads existe
RUN mkdir -p ./uploads

EXPOSE 3000 5002

CMD ["npm", "start"]