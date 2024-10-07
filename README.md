
# Blogster - Backend
## Live Link:-
```bash
https://blogster-backend.onrender.com
```
## Overview

This is the backend for **Blogster**, a RESTful API built with **Express.js** and **Prisma ORM**, backed by a **PostgreSQL** database. The backend provides user authentication, blog management, commenting, and likes functionality.

### Key Features

-   **User Authentication**: Signup and login with JWT-based authentication.
-   **Password Validation**: Passwords are validated during signup to include at least 6 characters, one capital letter, one special character, and one numeric digit.
-   **Blog Management**: Create, read, and manage blogs with pagination and sorting.
-   **Search Functionality**: Search blogs by title or content.
-   **Likes and Comments**: Users can like and comment on blogs. Likes and comments are updated in real-time.
-   **Related Posts API**: Fetch related posts based on recent activity.

## Getting Started

### Prerequisites

-   Node.js (v14 or above)
-   PostgreSQL
-   npm (v6 or above)

### Installation

1.  Clone the repository:
    
    ```bash
    git clone https://github.com/Shrike0p/Blogster-Backend
    ```
    
2.  Navigate to the backend directory:
    
    ```bash
    cd backend
    ``` 
    
3.  Install dependencies:
    
    ```bash
    npm install
    ``` 
    
4.  Set up the PostgreSQL database:
    
    -   Ensure PostgreSQL is installed and running on your system.
    -   Create a new database for the project.
5.  Configure environment variables by creating a `.env` file at the root of the project and add the following:
    
    ```bash
    DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME
    JWT_SECRET=your_jwt_secret
    ```
    
    Replace `USER`, `PASSWORD`, and `DATABASE_NAME` with your PostgreSQL credentials.
    
6.  Run the Prisma migrations to set up your database schema:
    
    ```bash
    npx prisma migrate dev --name init
    ``` 
    
7.  Start the server:
    
    ```bash
    npm start
    ``` 
    
    The backend will run on `http://localhost:3000`.
    

### API Endpoints

#### User Authentication

-   **POST /api/v1/user/signup**: Register a new user. Requires `name`, `email`, and `password`.
-   **POST /api/v1/user/signin**: Sign in an existing user. Requires `email` and `password`.

#### Blog Management

-   **GET /api/v1/blog/bulk**: Fetch all blogs with pagination and sorting.
-   **POST /api/v1/blog**: Create a new blog post. Requires authentication.
-   **GET /api/v1/blog/** : Fetch a specific blog by its ID.
-   **POST /api/v1/blog/ /like** : Like a blog post.
-   **POST /api/v1/blog/comment** : Comment on a blog post.

### New Features Added:

1.  **Email and Password Validation**: Ensure users cannot use the same email to register multiple times, and the password follows the security requirements.
2.  **Search and Pagination**: Blog search functionality was added, enabling users to search for blog posts by title or content. Pagination was also implemented for efficient blog browsing.
3.  **Likes and Comments**: Real-time updates for likes and comments, allowing users to interact with blog posts.
4.  **Related Posts API**: Added an endpoint to fetch related posts based on activity.

----------

### Contributing

Feel free to fork the repository and submit a pull request if you would like to contribute to **Blogster**.
