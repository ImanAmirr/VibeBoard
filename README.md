# Vibe Board API

A FastAPI-based backend application for saving, organizing, and revisiting inspiration, links, and ideas through customizable vibe boards.

---

## Features

### Authentication
- User signup
- User login
- JWT-based authentication
- Protected API routes

### Board Management
- Create boards
- View all boards
- View a single board
- Update boards
- Delete boards
- Search boards by name
- Pagination support

### Item Management
- Save items to boards
- View all items
- View a single item
- Update items
- Delete items
- Filter items by vibe
- Search items by title
- Pagination support

### Flashbacks
- Automatic flashback generation for recently updated items
- Background job runs periodically
- View flashback history

### Admin Role-Based Access Control (RBAC)

This project implements role-based access control to separate normal users and admin users.

#### Roles
- `user` → default role on signup
- `admin` → can access admin-only endpoints

#### JWT Token
Each login returns a JWT token containing:
- user id
- email
- role

This role is used to control access to protected routes.

---

### Admin Features

Admin-only endpoints are protected using:
- `verify_token` → validates JWT
- `admin_required` → checks role = admin

#### User Management (Admin Only)
- GET `/admin/users` → Get all users
- GET `/admin/users/{id}` → Get single user
- DELETE `/admin/users/{id}` → Delete user
- PUT `/admin/users/{id}/make-admin` → Promote user to admin
- PUT `/admin/users/{id}/make-user` → Demote admin to user

#### Board Management (Admin Only)
- GET `/admin/boards` → View all boards
- DELETE `/admin/boards/{id}` → Delete any board

---

## Service Layer Architecture

Business logic is separated into a service layer:

- `routes.py` → API layer (FastAPI endpoints)
- `services.py` → business logic
- `database.py` → MongoDB connection
- `auth.py` → authentication + authorization

This improves:
- code reusability
- readability
- scalability

---

## Security Features

- Password hashing using bcrypt
- JWT authentication
- Role-based access control (RBAC)
- Protected admin routes
- CORS middleware enabled

---

## Database

MongoDB integration using PyMongo with collections:
- Users
- Boards
- Items
- Flashbacks

---

## Tech Stack

- FastAPI
- MongoDB (PyMongo)
- Pydantic
- JWT (python-jose)
- Passlib (bcrypt)
- AsyncIO (background jobs)

---

## Running the Project

```bash
pip install -r requirements.txt
uvicorn main:app --reload
