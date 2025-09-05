# Real-time Chat Application

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd chat-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run start
   ```

The server will start on `http://localhost:3000` with WebSocket support.

## Development Commands

Additional commands available for development:

- **npm run format** - Format code using Prettier
- **npm run lint** - Run ESLint to check code quality
- **npm run test** - Run unit tests
- **npm run test:e2e** - Run end-to-end tests

## Usage

There are two ways to interact with the chat backend:

### 1. REST API Endpoints

- **GET http://46.101.114.148/chat/messages** - Retrieve chat messages
- **POST http://46.101.114.148/chat/message** - Send a new chat message

### 2. Socket.IO Connection

Connect to the live server using Socket.IO:
```
http://46.101.114.148:3000/
```

This provides real-time bidirectional communication for instant messaging.
