# Folder Manager - Backend

A Node.js/Express REST API for file management with JWT authentication, folder hierarchy, and image uploads.

## Features

- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days) in HttpOnly cookies
- **User Management**: Registration, login, logout with bcrypt password hashing
- **Folder Management**: Create, rename, delete folders with nested hierarchy
- **Image Upload**: Multer-based image uploads with file type validation
- **Folder Size Tracking**: Automatic size calculation propagated to parent folders

## Tech Stack

- **Node.js** - Runtime
- **Express 5** - Web Framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **express-validator** - Request validation

## Project Structure

```
backend/
├── config/
│   └── DBConnect.Config.js  # MongoDB connection
├── controller/
│   ├── authController.js    # Auth handlers
│   ├── folderController.js  # Folder CRUD handlers
│   ├── imageController.js   # Image upload handlers
│   └── userController.js    # User handlers
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── errorHandler.js      # Global error handler
│   └── validate.js          # Validation middleware
├── model/
│   ├── folder.model.js      # Folder schema
│   ├── image.model.js       # Image schema
│   └── user.model.js        # User schema
├── routes/
│   ├── auth.router.js       # Auth routes
│   ├── folder.router.js     # Folder routes
│   ├── image.router.js      # Image routes
│   └── user.router.js       # User routes
├── service/
│   ├── authService.js       # Auth business logic
│   ├── folderService.js     # Folder business logic
│   ├── imageService.js      # Image business logic
│   └── multerService.js     # Multer configuration
├── utils/
│   └── jwt.js               # JWT utilities
├── uploads/                 # Uploaded images directory
├── app.js                   # Express app entry point
└── package.json
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/folder-manager
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
NODE_ENV=development
```

## Running the Server

```bash
npm start
```

Server runs at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user (protected) |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/folders?userId=...` | Get all folders |
| GET | `/api/folders?userId=...&parentId=...` | Get folder contents |
| POST | `/api/folders` | Create folder |
| PUT | `/api/folders/:id` | Rename folder |
| DELETE | `/api/folders/:id` | Delete folder (recursive) |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/images/upload` | Upload image |
| GET | `/api/images/folder/:folderId` | Get images in folder |
| DELETE | `/api/images/:id` | Delete image |

## Authentication Flow

1. **Register**: Creates user with hashed password
2. **Login**: Returns access token (JSON) + refresh token (HttpOnly cookie)
3. **Protected Routes**: Require `Authorization: Bearer <token>` header
4. **Token Refresh**: POST to `/api/auth/refresh` with cookie
5. **Logout**: Clears cookie and invalidates refresh token in DB

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  refreshToken: String
}
```

### Folder
```javascript
{
  name: String,
  userId: ObjectId,
  parentId: ObjectId | null,
  size: Number
}
```

### Image
```javascript
{
  name: String,
  url: String,
  size: Number,
  folderId: ObjectId,
  userId: ObjectId
}
```
