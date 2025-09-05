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

#### GET /chat/messages
Retrieve chat messages

**Response Example:**
```json
[
  {
    "id": "message-id-1",
    "username": "Bill Gates",
    "message": "my message 1"
  },
  {
    "id": "message-id-2",
    "username": "Bill Gates", 
    "message": "my message 2"
  }
]
```

#### POST /chat/message
Send a new chat message

**Request Example:**
```json
{
  "id": "message-id-2",
  "username": "Bill Gates",
  "message": "my message 2"
}
```

### 2. Socket.IO Connection

Connect to the live server using Socket.IO:
```
http://46.101.114.148:3000/
```

This provides real-time bidirectional communication for instant messaging.

#### Available Events

**Client → Server Events:**

1. **sendMessage** - Send a new chat message
   ```javascript
   socket.emit('sendMessage', {
     id: 'message-id-1',
     username: 'Bill Gates',
     message: 'Hello everyone!'
   });
   ```

2. **getMessages** - Request chat message history
   ```javascript
   socket.emit('getMessages');
   ```

**Server → Client Events:**

1. **newMessage** - Receive new messages in real-time
   ```javascript
   socket.on('newMessage', (message) => {
     console.log('New message:', message);
     // message format: { id, username, message }
   });
   ```

2. **messagesHistory** - Receive message history (response to getMessages)
   ```javascript
   socket.on('messagesHistory', (messages) => {
     console.log('Message history:', messages);
     // messages format: [{ id, username, message }, ...]
   });
   ```

#### Connection Example
```javascript
import { io } from 'socket.io-client';

const socket = io('http://46.101.114.148:3000/');

// Listen for new messages
socket.on('newMessage', (message) => {
  console.log(`${message.username}: ${message.message}`);
});

// Send a message
socket.emit('sendMessage', {
  id: Date.now().toString(),
  username: 'Your Name',
  message: 'Hello from Socket.IO!'
});

// Get message history
socket.emit('getMessages');
socket.on('messagesHistory', (messages) => {
  messages.forEach(msg => console.log(`${msg.username}: ${msg.message}`));
});
```
