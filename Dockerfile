# ==================== ESTÁGIO 1: Frontend ====================
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --force
COPY frontend .
RUN npm run build

# ==================== ESTÁGIO 2: Backend ====================
FROM node:18-alpine as backend-builder
WORKDIR /app
COPY package*.json ./
COPY api/package*.json ./api/
COPY queues/package*.json ./queues/
COPY models/package*.json ./models/
COPY controllers/package*.json ./controllers/
RUN npm install mongoose@8.2.1 mongodb@5.9.0 bson@6.2.0 --save-exact --legacy-peer-deps
RUN npm ci --omit=dev --legacy-peer-deps
COPY . .

# ==================== ESTÁGIO 3: API ====================
FROM node:18-alpine as api-production
WORKDIR /app
COPY --from=backend-builder /app .
USER node
CMD ["node", "/app/api/index.js"]

# ==================== ESTÁGIO 4: Queue ====================
FROM node:18-alpine as queue-production
WORKDIR /app
COPY --from=backend-builder /app .
USER node
CMD ["node", "/app/queues/mainQueue.js"]

# ==================== ESTÁGIO 5: NGINX ====================
FROM nginx:alpine as nginx-production
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]