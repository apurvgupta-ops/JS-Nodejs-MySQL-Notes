# Chat Application

A real-time chat application built with React, Node.js, Socket.io, and MySQL with Sequelize ORM.

## Features

- User authentication (register, login, logout)
- One-to-one chat
- Group chat
- Real-time messaging with Socket.io
- Online/offline status indicators
- Read receipts
- Typing indicators
- Message history
- Group management (create, update, delete)
- Group member management (add, remove, update roles)

## Tech Stack

### Frontend

- React with TypeScript
- React Router for navigation
- Socket.io client for real-time communication
- Axios for API requests
- CSS for styling

### Backend

- Node.js with Express
- Socket.io for real-time communication
- MySQL database
- Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and Socket services
│   │   ├── styles/         # CSS styles
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── ...
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   └── server.js           # Entry point
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL

### Installation

1. Clone the repository

   ```
   git clone <repository-url>
   cd chat-app
   ```

2. Install server dependencies

   ```
   cd server
   npm install
   ```

3. Install client dependencies

   ```
   cd ../client
   npm install
   ```

4. Create a MySQL database

   ```
   mysql -u root -p
   CREATE DATABASE chat_app;
   exit
   ```

5. Configure environment variables
   - Copy `.env.example` to `.env` in the server directory
   - Update the database credentials and JWT secret

### Running the Application

1. Start the server

   ```
   cd server
   npm run dev
   ```

2. Start the client

   ```
   cd ../client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Users

- `GET /api/users` - Get all users
- `GET /api/users/search` - Search users
- `PATCH /api/users/profile` - Update user profile

### Messages (One-to-One)

- `POST /api/messages` - Send a message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:userId` - Get conversation with a specific user
- `PATCH /api/messages/read` - Mark messages as read

### Groups

- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups for current user
- `GET /api/groups/:groupId` - Get group details
- `PATCH /api/groups/:groupId` - Update group details
- `DELETE /api/groups/:groupId` - Delete group
- `POST /api/groups/:groupId/members` - Add members to group
- `DELETE /api/groups/:groupId/members/:userId` - Remove member from group
- `PATCH /api/groups/:groupId/members/:userId/role` - Update member role
- `POST /api/groups/messages` - Send a group message
- `GET /api/groups/:groupId/messages` - Get messages for a group
- `DELETE /api/groups/messages/:messageId` - Delete a group message

## Socket.io Events

### Client to Server

- `private_message` - Send a private message
- `group_message` - Send a group message
- `join_group` - Join a group room
- `leave_group` - Leave a group room
- `typing` - Send typing indicator for private chat
- `group_typing` - Send typing indicator for group chat
- `message_read` - Mark message as read

### Server to Client

- `private_message` - Receive a private message
- `private_message_delivered` - Confirmation of message delivery
- `group_message` - Receive a group message
- `user_status_change` - User status change notification
- `typing` - Receive typing indicator for private chat
- `group_typing` - Receive typing indicator for group chat
- `message_read` - Message read receipt

## License

This project is licensed under the MIT License.
