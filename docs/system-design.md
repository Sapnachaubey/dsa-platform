# System Design Document

## Goal

Build a DSA Sheet web application where students can sign up, log in, browse topic-wise problems, access learning resources, mark problems as complete, and resume progress after logging in again.

The design assumes 10k-50k active users with moderate read traffic and frequent small progress updates.

## High Level Architecture

The application is split into a React client, an Express API, and MongoDB. Nginx serves the production frontend build and forwards API traffic to the backend.

![High level architecture](assets/high-level-architecture.svg)

### Component Responsibilities

- React handles routing, authentication screens, dashboard rendering, sheet browsing, filters, and optimistic progress updates.
- Express owns authentication, request validation, topic/problem APIs, progress updates, and error handling.
- MongoDB stores users, seeded DSA content, and per-user progress records.
- Nginx serves static assets and reverse-proxies `/api` requests to the backend container.

## Request Flow

1. Student opens the deployed URL.
2. Nginx serves the React single-page application.
3. React calls `/api/auth/login` or `/api/auth/register`.
4. Express validates input, checks MongoDB, hashes or compares passwords, and sets a JWT in an httpOnly cookie.
5. Protected API requests pass through auth middleware.
6. React renders the DSA sheet using `/api/topics?includeProblems=true`.
7. Checkbox updates call `/api/progress/:problemId`, which upserts a per-user progress record.

## Authentication Mechanism

- Passwords are hashed with bcrypt before storage.
- JWT contains the `userId` and is signed using `JWT_SECRET`.
- Token is stored in an httpOnly cookie named `dsa_sheet_token`.
- API middleware validates the token and loads the user for protected routes.
- Logout clears the auth cookie.

This keeps the frontend from manually storing sensitive tokens in local storage.

## Progress Tracking Data Flow

Progress is saved per user and per problem. The frontend updates the local UI after the API confirms that MongoDB has stored the change.

![Progress tracking data flow](assets/progress-tracking-flow.svg)

This flow keeps progress isolated by authenticated user, so two students can complete the same problem independently.

## Scalability Considerations

For 10k-50k active users:

- Static React assets can be cached by Nginx or moved to S3/CloudFront.
- Express API can run multiple replicas behind an AWS Application Load Balancer.
- JWT auth is stateless, so API replicas do not need shared session storage.
- MongoDB indexes support login, ordered topic/problem reads, and user progress lookups.
- Progress writes are small upserts keyed by `{ userId, problemId }`, which scales well.
- MongoDB Atlas or DocumentDB can replace the local Mongo container for managed backups, scaling, and monitoring.
- Rate limiting is applied to auth routes to reduce brute-force risk.

## Deployment View

The current deployment target is a single EC2 instance running Docker Compose. This keeps the setup easy to review while still separating web, API, and database responsibilities.

![Deployment view](assets/deployment-view.svg)

## Trade-offs

- Docker Compose on EC2 keeps deployment straightforward and easy to reproduce.
- Managed MongoDB would be better for production reliability, but local MongoDB keeps the deployment simple.
- Cookie-based JWT improves browser security compared with local storage.
- Topic/problem content is seeded from code for repeatability; an admin panel can be added later if content must be edited frequently.
