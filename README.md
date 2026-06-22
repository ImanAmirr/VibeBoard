# Vibe Board API

A FastAPI-based backend application for saving, organizing, and revisiting inspiration, links, ideas, and resources through customizable vibe boards.

---

## Features

### Authentication

* User signup
* User login
* JWT-based authentication
* Protected API routes

---

### Board Management

* Create boards
* View all boards
* View a single board
* Update boards
* Delete boards
* Search boards by name
* Pagination support

---

### Item Management

* Save items to boards
* View all items
* View a single item
* Update items
* Delete items
* Filter items by vibe
* Search items by title
* Pagination support

---

### Flashbacks

* Automatic flashback generation for saved content
* View flashback history
* Personalized flashbacks per user

---

### Background Job Queue

The application uses **Redis Queue (RQ)** to process long-running tasks asynchronously.

#### Features

* Background item processing
* Background board processing
* Faster API response times
* Redis-backed task queue
* Non-blocking request handling

#### Workflow

1. User creates a board or item
2. Data is stored in MongoDB
3. A job is pushed to Redis
4. API returns immediately
5. Worker processes the job in the background

#### Tasks

* `process_item()`
* `process_board()`

#### Benefits

* Improved performance
* Better scalability
* Reduced API latency
* Separation of request handling and heavy processing

---

### Caching

Redis caching is implemented to reduce database queries and improve API performance.

#### Cached Resources

* Individual items
* Item listings
* Individual boards
* Board listings
* Flashbacks

#### Cache Strategy

* Cache-aside pattern
* Read from cache first
* Fallback to MongoDB on cache miss
* Automatic cache invalidation on create, update, and delete operations

#### Benefits

* Faster response times
* Reduced database load
* Improved scalability

---

### File Handling

* File upload support
* File storage management
* File path generation and retrieval

---

### Admin Role-Based Access Control (RBAC)

This project implements role-based access control to separate normal users and administrators.

#### Roles

* `user` → default role assigned on signup
* `admin` → access to admin-only endpoints

#### JWT Token

Each login returns a JWT token containing:

* User ID
* Email
* Role

The role is used to authorize access to protected resources.

---

### Admin Features

Admin-only endpoints are protected using:

* `verify_token()` → validates JWT tokens
* `admin_required()` → verifies admin role

#### User Management (Admin Only)

* GET `/admin/users` → Get all users
* GET `/admin/users/{id}` → Get a single user
* DELETE `/admin/users/{id}` → Delete a user
* PUT `/admin/users/{id}/make-admin` → Promote a user to admin
* PUT `/admin/users/{id}/make-user` → Demote an admin to user

#### Board Management (Admin Only)

* GET `/admin/boards` → View all boards
* DELETE `/admin/boards/{id}` → Delete any board

---

## Service Layer Architecture

Business logic is separated into dedicated layers.

### Structure

```text
project/
│
├── main.py
├── routes.py
├── services.py
├── auth.py
├── database.py
├── cache.py
├── redis_conn.py
├── task.py
├── storage.py
└── models.py
```

### Responsibilities

* `routes.py` → API endpoints
* `services.py` → business logic
* `database.py` → MongoDB connection
* `auth.py` → authentication and authorization
* `cache.py` → Redis caching
* `redis_conn.py` → Redis queue configuration
* `task.py` → background jobs
* `storage.py` → file handling

### Benefits

* Improved maintainability
* Better code organization
* Easier testing
* Higher scalability
* Clear separation of concerns

---

## Security Features

* Password hashing using bcrypt
* JWT authentication
* Role-based access control (RBAC)
* Protected admin routes
* User-specific data isolation
* CORS middleware support

---

## Database

MongoDB integration using PyMongo.

### Collections

* Users
* Boards
* Items
* Flashbacks

---

## Tech Stack

### Backend

* FastAPI
* Python
* Pydantic

### Database

* MongoDB
* PyMongo

### Authentication & Security

* JWT (`python-jose`)
* Passlib (`bcrypt`)

### Caching & Queues

* Redis
* Redis Queue (RQ)

### File Handling

* Local file storage

### Testing

* Pytest
* FastAPI TestClient
* HTTPX

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd vibe-board-api
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Project

Start the FastAPI application:

```bash
uvicorn main:app --reload
```

---

## Running Redis

Ensure Redis is running before starting the application.

Example:

```bash
redis-server
```

---

## Running the Worker

Start an RQ worker to process background jobs:

```bash
rq worker
```

---

## Testing

Install testing dependencies:

```bash
pip install pytest httpx
```

Run tests:

```bash
pytest
```

---

## API Capabilities Summary

### Authentication

* Signup
* Login
* JWT Authentication

### Boards

* Create
* Read
* Update
* Delete
* Search
* Pagination

### Items

* Create
* Read
* Update
* Delete
* Search
* Filter by vibe
* Pagination

### Flashbacks

* View flashbacks
* Cached retrieval

### Admin

* User management
* Role management
* Global board management

### Infrastructure

* Redis caching
* Redis Queue background jobs
* File uploads
* Service layer architecture
* MongoDB persistence
