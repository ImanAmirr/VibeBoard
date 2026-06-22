# Vibe Board API

A FastAPI backend for saving, organizing, and revisiting inspiration, links, ideas, and resources through customizable vibe boards.

## Features

### Authentication & Authorization

* User signup and login
* JWT authentication
* Protected routes
* Role-Based Access Control (RBAC)
* Admin-only endpoints

### Boards

* Create, update, delete, and view boards
* Search boards by name
* Pagination support

### Items

* Save items to boards
* Create, update, delete, and view items
* Filter by vibe
* Search by title
* Pagination support

### Flashbacks

* Personalized flashback history
* Automatically generated from saved content

### Performance

* Redis caching for frequently accessed data
* Cache invalidation on updates
* Background processing with Redis Queue (RQ)

### File Handling

* File upload support
* File storage management

---

## Architecture

```text
Client
   │
   ▼
FastAPI Routes
   │
   ▼
Service Layer
   │
   ├── MongoDB
   ├── Redis Cache
   └── Redis Queue (RQ)
```

### Project Structure

```text
.
├── main.py
├── routes.py
├── services.py
├── auth.py
├── database.py
├── cache.py
├── redis_conn.py
├── task.py
└── storage.py
```

| File          | Responsibility        |
| ------------- | --------------------- |
| routes.py     | API endpoints         |
| services.py   | Business logic        |
| auth.py       | Authentication & RBAC |
| database.py   | MongoDB connection    |
| cache.py      | Redis caching         |
| redis_conn.py | Queue configuration   |
| task.py       | Background jobs       |
| storage.py    | File handling         |

---

## Tech Stack

* FastAPI
* MongoDB (PyMongo)
* Redis
* Redis Queue (RQ)
* Pydantic
* JWT (python-jose)
* Passlib (bcrypt)
* Pytest

---

## Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start Redis

```bash
redis-server
```

### Run Worker

```bash
rq worker
```

### Run API

```bash
uvicorn main:app --reload
```

---

## Security

* Password hashing with bcrypt
* JWT authentication
* Role-based access control
* Protected admin routes
* CORS support

---

## Database Collections

* Users
* Boards
* Items
* Flashbacks
