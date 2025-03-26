# Estágio 1: Frontend
FROM node:18 as frontend-builder

WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Estágio 2: API
FROM node:18 as api-builder

WORKDIR /app/api
COPY api/package.json api/package-lock.json ./
RUN npm install
COPY api .

# Estágio 3: WebSocket
FROM node:18 as websocket-builder

WORKDIR /app/websocket
COPY websocket/package.json websocket/package-lock.json ./
RUN npm install
# Copia o .env.docker como .env (100% garantido)
COPY .env.docker .env
COPY websocket .

# Estágio Final
FROM node:18 as final
WORKDIR /app
# Garante que o .env exista (copia do websocket-builder)
COPY --from=websocket-builder /app/websocket/.env .

COPY --from=api-builder /app/api ./api
COPY --from=websocket-builder /app/websocket ./websocket
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY controllers ./controllers
COPY models ./models
COPY queues ./queues

EXPOSE 3000 5002
CMD ["node", "api/index.js"]