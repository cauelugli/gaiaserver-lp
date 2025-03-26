# Estágio 1: Construir o frontend
FROM node:18 as frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
# Vite normalmente gera para 'dist'
RUN npm run build  

# Estágio 2: Construir o backend
FROM node:18 as backend-builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

# Estágio final para a API
FROM node:18 as backend
WORKDIR /app
COPY --from=backend-builder /app .
# API e WebSocket
EXPOSE 3000 5002  
# Ou comando específico para sua aplicação
CMD ["npm", "start"] 

# Estágio final para o Frontend (dev)
FROM node:18 as frontend
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend .
EXPOSE 5173
# Apenas para desenvolvimento
CMD ["npm", "run", "dev"]  