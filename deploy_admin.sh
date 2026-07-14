#!/bin/bash

set -e

REPO_DIR="/root/DripDoggy"
ADMIN="Admin"
NGINX_DIR="/var/www/dripdoggy-admin"

cd "$REPO_DIR"

echo "===== Checkout Nikil ====="
git checkout nikil
git pull origin nikil

echo "===== Checkout main ====="
git checkout main
git pull origin main

echo "===== Copy admin from Nikil ====="
git checkout nikil -- "$ADMIN"

echo "===== Stage changes ====="
git add "$ADMIN"

if git diff --cached --quiet; then
    echo "No admin changes found."
    exit 0
fi

echo "===== Commit ====="
git commit -m "Sync admin from Nikil"

echo "===== Push ====="
git push origin main

echo "===== Build Admin ====="
cd "$REPO_DIR/$ADMIN"

npm install
npm run build

echo "===== Deploy Admin ====="
sudo mkdir -p "$NGINX_DIR"
sudo rm -rf "$NGINX_DIR"/*
sudo cp -r dist/* "$NGINX_DIR"/

echo "===== Reload Nginx ====="
sudo systemctl reload nginx

echo "===== Admin Deployment Successful ====="
