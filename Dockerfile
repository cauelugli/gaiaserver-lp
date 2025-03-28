# Estágio 1: Frontend
FROM node:18 as frontend-builder

WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm install --force
RUN npm run build

# Estágio 2: Backend
FROM node:18 as backend-builder

WORKDIR /app
COPY api/package.json api/package-lock.json ./
RUN npm install --force
COPY api .

# Estágio final:
FROM node:18
WORKDIR /app
    
# Copia tudo (incluindo node_modules se necessário)
COPY --from=frontend-builder /app/frontend ./frontend
COPY --from=backend-builder /app ./api
    
# Copia o resto
COPY controllers ./controllers
COPY models ./models
COPY queues ./queues
COPY .env.docker ./.env
    
EXPOSE 3000 5002 5173
    
CMD ["sh", "-c", "cd /app/frontend && npm run dev & cd /app/api && node index.js "]