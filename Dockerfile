FROM node:18 as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM node:18 as production

WORKDIR /app
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY package*.json ./
RUN npm install --production

COPY api ./api
COPY queues ./queues

# Configuração combinada para rodar todos os processos
CMD ["sh", "-c", "node queues/index.js & node api/index.js & npm run dev --prefix frontend"]