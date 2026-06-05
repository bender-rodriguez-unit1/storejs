#!/bin/bash
set -e

cd /opt/storejs

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm install --production

echo "Restarting service..."
systemctl restart storejs

echo "Waiting for startup..."
sleep 3

# Health check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/puppies)
if [ "$HTTP_STATUS" = "200" ]; then
  echo "Deploy successful - storejs is healthy (HTTP $HTTP_STATUS)"
  exit 0
else
  echo "Deploy FAILED - health check returned HTTP $HTTP_STATUS"
  exit 1
fi
