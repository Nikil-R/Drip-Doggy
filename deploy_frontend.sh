#!/bin/bash

set -e

REPO_DIR="/root/DripDoggy"
FRONTEND="frontend"
NGINX_DIR="/var/www/dripdoggy"

cd "$REPO_DIR"

echo "===== Checkout Nikil ====="
git checkout nikil
git pull origin nikil

echo "===== Checkout main ====="
git checkout main
git pull origin main

echo "===== Copy frontend from Nikil ====="
git checkout nikil -- "$FRONTEND"

echo "===== Stage changes ====="
git add "$FRONTEND"

if git diff --cached --quiet; then
    echo "No frontend changes found."
    exit 0
fi

git commit -m "Sync frontend from Nikil"
git push origin main

echo "===== Build Frontend ====="
cd "$REPO_DIR/$FRONTEND"

npm install
npm run build

echo "===== Deploy Frontend ====="
sudo rm -rf "$NGINX_DIR"/*
sudo cp -r dist/* "$NGINX_DIR"/

echo "===== Reload Nginx ====="
sudo systemctl reload nginx

echo "===== Frontend Deployment Successful ====="
