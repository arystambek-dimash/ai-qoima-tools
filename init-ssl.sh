#!/bin/bash

# SSL Certificate Initialization Script for qoima.com.kz
# Run this script ONCE on your server to obtain initial SSL certificates

set -e

# Configuration
DOMAINS=("qoima.com.kz" "api.qoima.com.kz")
EMAIL="your-email@example.com"  # Replace with your email
STAGING=0  # Set to 1 for testing (to avoid rate limits)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== SSL Certificate Initialization ===${NC}"

# Check if running as root or with docker permissions
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to Docker. Make sure Docker is running and you have permissions.${NC}"
    exit 1
fi

# Create certbot directories
echo -e "${GREEN}Creating certbot directories...${NC}"
mkdir -p ./certbot/www
mkdir -p ./certbot/conf

# Create temporary nginx config without SSL (for initial certificate issuance)
echo -e "${GREEN}Creating temporary nginx config for certificate issuance...${NC}"
cat > ./nginx/nginx-init.conf << 'EOF'
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

    access_log  /var/log/nginx/access.log;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name qoima.com.kz api.qoima.com.kz;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'SSL initialization in progress...';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Backup original nginx.conf
cp ./nginx/nginx.conf ./nginx/nginx.conf.backup

# Use temporary config
cp ./nginx/nginx-init.conf ./nginx/nginx.conf

# Start nginx with temporary config
echo -e "${GREEN}Starting nginx for certificate issuance...${NC}"
docker compose up -d nginx

# Wait for nginx to be ready
echo -e "${YELLOW}Waiting for nginx to be ready...${NC}"
sleep 5

# Set staging flag if needed
STAGING_FLAG=""
if [ $STAGING -eq 1 ]; then
    STAGING_FLAG="--staging"
    echo -e "${YELLOW}Using Let's Encrypt STAGING environment (for testing)${NC}"
fi

# Request certificates for each domain
for DOMAIN in "${DOMAINS[@]}"; do
    echo -e "${GREEN}Requesting certificate for ${DOMAIN}...${NC}"

    docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        $STAGING_FLAG \
        -d "$DOMAIN"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Certificate obtained for ${DOMAIN}${NC}"
    else
        echo -e "${RED}Failed to obtain certificate for ${DOMAIN}${NC}"
    fi
done

# Restore original nginx.conf with SSL
echo -e "${GREEN}Restoring production nginx config with SSL...${NC}"
cp ./nginx/nginx.conf.backup ./nginx/nginx.conf

# Reload nginx with SSL config
echo -e "${GREEN}Reloading nginx with SSL configuration...${NC}"
docker compose up -d nginx
docker compose exec nginx nginx -s reload

# Cleanup
rm -f ./nginx/nginx-init.conf
rm -f ./nginx/nginx.conf.backup

echo ""
echo -e "${GREEN}=== SSL Setup Complete ===${NC}"
echo ""
echo "Your sites should now be accessible via HTTPS:"
echo "  - https://qoima.com.kz"
echo "  - https://api.qoima.com.kz"
echo ""
echo -e "${YELLOW}Important: Set up automatic renewal by adding this to your crontab:${NC}"
echo "0 0 * * * cd $(pwd) && docker compose run --rm certbot renew && docker compose exec nginx nginx -s reload"
