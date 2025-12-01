#!/bin/bash

echo "=== UPDATE SYSTEM ==="
sudo yum update -y

echo "=== INSTALL NODEJS 18 ==="
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

echo "=== INSTALL PM2 ==="
sudo npm install -g pm2

# ---------------------------
# BACKEND
# ---------------------------
echo "=== START BACKEND ==="
cd /home/ec2-user/mini-ci-cd-project/Backend

npm install

# Stop if exists
pm2 stop backend || true

# Start backend
pm2 start server.js --name backend

echo "Backend running..."

# ---------------------------
# FRONTEND
# ---------------------------
echo "=== START FRONTEND ==="
cd /home/ec2-user/mini-ci-cd-project/frontend

npm install

# Build frontend
npm run build

# Install serve only once
sudo npm install -g serve

# Stop if exists
pm2 stop frontend || true

# Start frontend build on port 3000
pm2 start "serve -s build -l 3000" --name frontend

echo "Frontend running..."

# ---------------------------
# PM2 AUTOSTART
# ---------------------------
echo "=== ENABLE PM2 STARTUP ==="
pm2 save
pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "=== ALL DONE! ==="
echo "Backend: running on its port"
echo "Frontend: http://52.71.4.237:3000"

