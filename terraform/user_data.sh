#!/bin/bash

set -e

exec > >(tee /var/log/cloudprofile-user-data.log | logger -t cloudprofile-user-data -s 2>/dev/console) 2>&1

echo "=== CloudProfile EC2 bootstrap started ==="

# Update system
apt-get update -y

# Install required packages
apt-get install -y \
  curl \
  ca-certificates \
  gnupg

# --------------------------------------------------
# Docker
# --------------------------------------------------

install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y

apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

systemctl enable docker
systemctl start docker

# --------------------------------------------------
# k3s
# --------------------------------------------------

curl -sfL https://get.k3s.io | sh -

# Wait until k3s is ready
until systemctl is-active --quiet k3s; do
  echo "Waiting for k3s..."
  sleep 5
done

# --------------------------------------------------
# kubectl configuration
# --------------------------------------------------

mkdir -p /home/ubuntu/.kube

cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config

chown -R ubuntu:ubuntu /home/ubuntu/.kube

chmod 600 /home/ubuntu/.kube/config

echo "=== CloudProfile EC2 bootstrap completed ==="