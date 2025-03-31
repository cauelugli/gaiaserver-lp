#!/bin/bash

# Substitui a porta no nginx.conf
sed -i "s/\$HEROKU_PORT/$PORT/g" /app/nginx.conf

# Inicia NGINX
nginx -c /app/nginx.conf &

# Inicia a API Node.js
node api/index.js &

# Inicia as filas
node queues/mainQueue.js &

# Mantém o container vivo e exibe logs
tail -f /app/api/logs/*.log 2>/dev/null || tail -f /dev/null