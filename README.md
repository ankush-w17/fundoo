# FundooNotes Backend

A robust, feature-rich note-taking application backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**: Registration, Login, JWT Authentication, Password Reset.
- **Note Management**: Create, Read, Update, Delete (CRUD), Trash/Restore, Archive, Pin.
- **Labels**: Organize notes with custom labels.
- **Collaboration**: Share notes with other users via email invitations.
- **Search**: Full-text search support for notes.
- **Caching**: Redis integration for high-performance data retrieval.
- **Documentation**: Swagger UI API documentation.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest
- **Email**: Nodemailer

## 📂 Project Structure

```
fundoo/
├── src/
│   ├── config/         # Database, Redis, and Swagger configuration
│   ├── controllers/    # Request handlers (User, Note, Label)
│   ├── middleware/     # Auth (protect) and Validation middleware
│   ├── models/         # Mongoose schemas (User, Note, Label)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   └── utils/          # Utilities (Token generation, Email)
├── tests/              # Automated test suites
├── server.js           # Entry point
└── package.json        # Dependencies and scripts
```

## ⚙️ Setup & Installation

1.  **Prerequisites**:
    *   Node.js (v14+)
    *   MongoDB (running on default port 27017)
    *   Redis (running on default port 6379)

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Ensure a `.env` file exists in the root directory with the following keys (defaults are provided in `src/config/config.js`):
    *   `PORT`
    *   `MONGODB_URI`
    *   `JWT_SECRET`
    *   `REDIS_HOST`, `REDIS_PORT`
    *   `EMAIL_USER`, `EMAIL_PASSWORD` (for collaboration features)

## 🏃‍♂️ Running the App

- **Start Server**:
    ```bash
    npm start
    ```
    Server runs at `http://localhost:3000`.

- **Run Tests**:
    ```bash
    npm test
    ```

- **API Documentation**:
    Visit `http://localhost:3000/api-docs` to view the Swagger UI.

## 🧪 Testing

The project uses **Jest** and **Supertest**. Tests are located in the `tests/` directory and use an in-memory MongoDB instance (`@shelf/jest-mongodb`) for isolation.