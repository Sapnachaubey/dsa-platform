# API Design

Base URL:

```text
/api
```

All protected routes require the `dsa_sheet_token` httpOnly cookie created during login or signup.

## Auth

### POST `/auth/register`

Creates a student account and starts a session. The UI exposes this flow as Sign Up.

Request:

```json
{
  "name": "Demo Student",
  "email": "student@example.com",
  "password": "Student@123"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Demo Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

### POST `/auth/login`

Authenticates a student and sets the auth cookie.

Request:

```json
{
  "email": "student@example.com",
  "password": "Student@123"
}
```

### POST `/auth/logout`

Clears the auth cookie.

### GET `/auth/me`

Returns the logged-in user.

## DSA Sheet

### GET `/topics?includeProblems=true`

Returns ordered topics with ordered problems and the current user's completion state.

Response shape:

```json
{
  "topics": [
    {
      "id": "topic_id",
      "title": "Arrays",
      "slug": "arrays",
      "description": "Core array patterns...",
      "order": 1,
      "progress": {
        "completed": 2,
        "total": 5,
        "percentage": 40
      },
      "problems": [
        {
          "id": "problem_id",
          "title": "Two Sum",
          "difficulty": "Easy",
          "completed": true,
          "resources": {
            "youtube": "https://www.youtube.com/...",
            "practice": "https://leetcode.com/problems/two-sum/",
            "article": "https://neetcode.io/solutions/two-sum"
          }
        }
      ]
    }
  ]
}
```

## Progress

### GET `/progress`

Returns completed progress records for the logged-in user.

### PUT `/progress/:problemId`

Creates or updates checkbox state for a problem.

Request:

```json
{
  "completed": true
}
```

Response:

```json
{
  "progress": {
    "userId": "user_id",
    "problemId": "problem_id",
    "completed": true,
    "completedAt": "2026-05-18T09:00:00.000Z"
  }
}
```

## Dashboard

### GET `/dashboard`

Returns overall, topic-wise, and difficulty-wise progress.

Response shape:

```json
{
  "summary": {
    "completed": 10,
    "total": 40,
    "percentage": 25
  },
  "topicStats": [],
  "difficultyStats": []
}
```

## Error Shape

Validation and server errors return a consistent shape:

```json
{
  "message": "Validation failed",
  "issues": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```
