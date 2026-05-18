# AWS EC2 Deployment Guide

This project is designed for a simple, reliable EC2 deployment using Docker Compose:

- `web`: Nginx serving the built React app and proxying `/api` to Express.
- `api`: Node/Express application.
- `mongo`: MongoDB with a persistent Docker volume.

## 1. Launch EC2

Recommended instance for the assignment demo:

- Ubuntu 22.04 or 24.04 LTS
- `t3.small` or better
- Security group inbound rules: `22` from your IP, `80` from anywhere
- Add `443` if you configure HTTPS

## 2. Install Docker

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker
```

## 3. Upload Or Clone Project

```bash
git clone <repository-url> dsa-sheet-platform
cd dsa-sheet-platform
cp .env.example .env
```

Edit `.env`:

```bash
JWT_SECRET=<use-a-long-random-secret>
CLIENT_ORIGIN=http://<ec2-public-ip>
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

## 4. Start Services

```bash
docker compose up -d --build
docker compose run --rm api npm run seed
```

Open:

```text
http://<ec2-public-ip>
```

Demo login:

```text
student@example.com / Student@123
```

## 5. Useful Operations

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f web
docker compose down
```

## 6. HTTPS Option

For production, attach a domain to the EC2 public IP and use Certbot or a load balancer with TLS termination. Then update:

```bash
CLIENT_ORIGIN=https://<domain-name>
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
```
