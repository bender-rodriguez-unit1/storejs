#!/bin/bash
set -e

# Optional target commit/ref to deploy. Defaults to the tip of main.
TARGET_REF="${1:-origin/main}"

# Locate the app checkout (path differs across droplet generations).
APP_DIR=""
for d in /opt/storejs /opt/app; do
  if [ -d "$d/.git" ]; then
    APP_DIR="$d"
    break
  fi
done

if [ -z "$APP_DIR" ]; then
  echo "Deploy FAILED - no git checkout found in /opt/storejs or /opt/app" >&2
  exit 1
fi

cd "$APP_DIR"
echo "Deploying in $APP_DIR"

echo "Fetching latest changes..."
git fetch origin main

echo "Checking out $TARGET_REF..."
git reset --hard "$TARGET_REF"

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
