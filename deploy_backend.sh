#!/bin/bash

set -e

REPO_DIR="/root/DripDoggy"
BACKEND="backend"
APP_PROPS="$BACKEND/src/main/resources/application.properties"
SERVICE_NAME="dripdoggy"

cd "$REPO_DIR"

echo "===== Checkout Vinaykv ====="
git checkout Vinaykv
git pull origin Vinaykv

echo "===== Checkout main ====="
git checkout main
git pull origin main

echo "===== Backup application.properties ====="
cp "$APP_PROPS" /tmp/application.properties

echo "===== Copy backend from Vinaykv ====="
git checkout Vinaykv -- "$BACKEND"

echo "===== Restore application.properties ====="
cp /tmp/application.properties "$APP_PROPS"

echo "===== Stage changes ====="
git add "$BACKEND"

if git diff --cached --quiet; then
    echo "No backend changes found."
    exit 0
fi

git commit -m "Sync backend from Vinaykv (preserve application.properties)"
git push origin main

echo "===== Build ====="
cd "$REPO_DIR/$BACKEND"
mvn clean package -DskipTests

echo "===== Restart Service ====="
sudo systemctl restart "$SERVICE_NAME"

echo "===== Deployment Successful ====="
