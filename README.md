# DSA Sheet Platform

A MERN web application for students preparing for coding interviews. Students can sign up, log in, browse a topic-wise DSA sheet, open learning resources, mark problems complete, and resume saved progress on the next login.

## Features

- Student sign up and secure login
- bcrypt password hashing
- JWT auth stored in an httpOnly cookie
- Topic-wise DSA chapters and problems
- YouTube, practice, and article links per problem
- Easy, Medium, and Hard difficulty badges
- Persisted per-user progress checkboxes
- Dashboard with overall, topic-wise, and difficulty-wise progress
- Docker Compose deployment for AWS EC2
- System design and database schema documentation

## Tech Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Docker Compose
- Nginx

## Local Setup

Install dependencies:

```bash
npm install --prefix client
npm install --prefix server
```

Create backend environment file:

```bash
cp server/.env.example server/.env
```

Start MongoDB locally, then seed the database:

```bash
npm run seed
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Demo account:

```text
student@example.com / Student@123
```

## Environment Variables

Backend variables are documented in [server/.env.example](server/.env.example).

Frontend local API override:

```bash
cp client/.env.example client/.env
```

The Vite dev server also proxies `/api` to `http://localhost:5001`, so `client/.env` is optional for local development.

## Scripts

```bash
npm run dev      # run client and server locally
npm run build    # build React app
npm run lint     # run client lint and server syntax checks
npm run seed     # seed topics, problems, and demo user
npm run start    # start Express API
```

## Docker And AWS

For EC2 deployment:

```bash
cp .env.example .env
docker compose up -d --build
docker compose run --rm api npm run seed
```

Detailed steps are in [docs/deployment.md](docs/deployment.md).

## Documentation

- [System Design](docs/system-design.md)
- [Database Schema](docs/database-schema.md)
- [API Design](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Demo Video Script](docs/demo-script.md)

## Assignment Checklist

- Login Page: implemented
- Signup Flow: implemented
- Structured DSA Sheet: implemented
- Topic-wise Chapters / Topics / Problems: implemented
- Learning Resources: implemented
- Difficulty Indicator: implemented
- Progress Tracker: implemented and persisted
- System Design Document: included
- Database Schema: included
- AWS Deployment Plan: included
- Demo Video Script: included
