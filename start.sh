#!/bin/bash

# Define porta (Heroku ou padrão)
PORT=${PORT:-8080}
CONFIG_FILE="/app/nginx-custom.conf"

# Cria configuração NGINX dinâmica
cat > $CONFIG_FILE <<EOF
worker_processes auto;
events { worker_connections 1024; }

http {
    server {
        listen $PORT;
        server_name _;
        root /var/www/html;

        location / {
            try_files \$uri \$uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
    }
}
EOF

# Inicia serviços
echo "✅ NGINX na porta: $PORT"
nginx -c $CONFIG_FILE &

echo "🔄 Iniciando API Node.js"
node api/index.js &

echo "🔄 Iniciando Queues"
node queues/mainQueue.js &

# Mantém o container vivo
tail -f /dev/null