#!/bin/bash

# Deployment script for qoima.com.kz
# Run this on your server: ssh root@159.89.203.82

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Qoima Deployment ===${NC}"

# 1. Go to project directory
cd /root/qoima-ai-took-navigator || cd /home/qoima-ai-took-navigator || {
    echo -e "${RED}Project directory not found. Please specify the correct path.${NC}"
    exit 1
}

# 2. Pull latest code
echo -e "${GREEN}Pulling latest code...${NC}"
git pull origin master

# 3. Create certbot directories
echo -e "${GREEN}Creating certbot directories...${NC}"
mkdir -p ./certbot/www
mkdir -p ./certbot/conf

# 4. Check if SSL certificates exist
if [ ! -d "./certbot/conf/live/qoima.com.kz" ]; then
    echo -e "${YELLOW}SSL certificates not found. Setting up HTTP-only first...${NC}"

    # Create temporary nginx config without SSL
    cat > ./nginx/nginx-temp.conf << 'NGINXEOF'
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name qoima.com.kz admin.qoima.com.kz api.qoima.com.kz;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name api.qoima.com.kz;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINXEOF

    # Backup original and use temp
    cp ./nginx/nginx.conf ./nginx/nginx.conf.ssl
    cp ./nginx/nginx-temp.conf ./nginx/nginx.conf

    # Start services with HTTP only
    echo -e "${GREEN}Starting services (HTTP only)...${NC}"
    docker compose down || true
    docker compose up -d --build

    # Wait for nginx
    sleep 10

    # Get SSL certificates
    echo -e "${GREEN}Obtaining SSL certificates...${NC}"

    for domain in qoima.com.kz admin.qoima.com.kz api.qoima.com.kz; do
        echo -e "${YELLOW}Getting certificate for ${domain}...${NC}"
        docker compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email admin@qoima.com.kz \
            --agree-tos \
            --no-eff-email \
            -d "$domain" || echo -e "${RED}Failed for ${domain}, continuing...${NC}"
    done

    # Restore SSL nginx config
    cp ./nginx/nginx.conf.ssl ./nginx/nginx.conf
    rm -f ./nginx/nginx-temp.conf ./nginx/nginx.conf.ssl
fi

# 5. Rebuild and restart all services
echo -e "${GREEN}Rebuilding and restarting services...${NC}"
docker compose down
docker compose up -d --build

# 6. Wait and check status
sleep 10
echo -e "${GREEN}=== Service Status ===${NC}"
docker compose ps

# 7. Check nginx logs for errors
echo -e "${GREEN}=== Nginx Logs ===${NC}"
docker logs qoima-ai-tools-nginx --tail 20

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo "Your sites should be accessible at:"
echo "  - https://qoima.com.kz"
echo "  - https://admin.qoima.com.kz"
echo "  - https://api.qoima.com.kz"
