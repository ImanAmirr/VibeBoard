# Vibe Board API

A FastAPI-based backend application for saving, organizing, and revisiting inspiration, links, and ideas through customizable vibe boards.

## Features

### Authentication

* User signup
* User login
* JWT-based authentication
* Protected API routes

### Board Management

* Create boards
* View all boards
* View a single board
* Update boards
* Delete boards
* Search boards by name
* Pagination support

### Item Management

* Save items to boards
* View all items
* View a single item
* Update items
* Delete items
* Filter items by vibe
* Search items by title
* Pagination support

### Flashbacks

* Automatic flashback generation for recently updated items
* Background job runs periodically
* View flashback history

### Database

* MongoDB integration using PyMongo
* Separate collections for:

  * Users
  * Boards
  * Items
  * Flashbacks

## Tech Stack

* FastAPI
* MongoDB
* PyMongo
* Pydantic
* JWT Authentication
* Passlib (bcrypt)
* Python AsyncIO

## Running the Project

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints

### Auth

* POST /signup
* POST /login

### Boards

* POST /boards
* GET /boards
* GET /boards/{id}
* PUT /boards/{id}
* DELETE /boards/{id}

### Items

* POST /items
* GET /items
* GET /items/{id}
* PUT /items/{id}
* DELETE /items/{id}

### Flashbacks

* GET /flashbacks

## Status

Current version uploaded for review and further development.
