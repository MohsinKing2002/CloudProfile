#!/bin/bash

set -eu
BLUE="\033[34m"
GREEN="\033[32m"
NC="\033[0m"

# ========= 1. Pull latest code ===============
echo -e "${BLUE}[ INFO ]: Pulling latest code ${NC}"
git pull origin master

# ========= 2. Docker Operations ===============
echo -e "${BLUE}[ INFO ]: Building docker image ${NC}"
docker build -t clodprofile-backend .

echo -e "${BLUE}[ INFO ]: Logging into ECR ${NC}"
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/t3q3s6c7

echo -e "${BLUE}[ INFO ]: Tagging docker image ${NC}"
docker tag clodprofile-backend:latest public.ecr.aws/t3q3s6c7/clodprofile-backend:latest

echo -e "${BLUE}[ INFO ]: Pushing docker image ${NC}"
docker push public.ecr.aws/t3q3s6c7/clodprofile-backend:latest

# ========= 3. rollout and restart deployment ===============
echo -e "${GREEN}[ INFO ]: Restarting k8s deployment ${NC}"
kubectl rollout restart deployment cloudprofile-backend-service
