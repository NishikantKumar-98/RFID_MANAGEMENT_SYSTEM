# RFID Tool Tracking System - Backend

Complete Node.js + Express + TypeScript backend for RFID Tool Tracking System.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Mongoose/MongoDB
- JWT (JSON Web Tokens)
- Zod (Request Validation)
- Helmet (Security)
- CORS

## Project Structure

```
src/
├── config/
│   └── db.ts                  # MongoDB connection
├── models/
│   ├── Tool.model.ts          # Tool schema
│   ├── Transaction.model.ts   # Transaction schema
│   └── User.model.ts          # User schema
├── controllers/
│   ├── tool.controller.ts     # Tool CRUD operations
│   ├── issue.controller.ts    # Issue tool logic
│   ├── return.controller.ts   # Return tool logic
│   ├── scan.controller.ts     # Inventory scan logic
│   └── stats.controller.ts    # Dashboard statistics
├── routes/
│   ├── tool.routes.ts
│   ├── issue.routes.ts
│   ├── return.routes.ts
│   ├── scan.routes.ts
│   └── stats.routes.ts
├── middleware/
│   └── auth.middleware.ts     # JWT verification
├── validators/
│   └── tool.validator.ts      # Zod request schemas
└── index.ts                   # Express app entry point
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v16+)
- MongoDB running locally or MongoDB Atlas URI

### 2. Environment Variables

Create a `.env` file in the server directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rfid-tool-tracking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Alternatively, copy from `.env.example`:
```bash
cp .env.example .env
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

Start the development server with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 5. Seed Database

Populate the database with 10 sample tools covering all categories and statuses:

```bash
npm run seed
```

This creates tools with:
- 3 Power Tools (Available, Issued, Missing)
- 2 Hand Tools (Available, Issued)
- 2 Measuring Tools (Available, Missing)
- 2 Safety Equipment (Available, Issued)
- 1 Electrical Tool (Available)

### 6. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Tools

- `POST /api/tools` - Create a new tool
  ```json
  {
    "toolId": "TOOL-001",
    "name": "Hammer",
    "category": "Hand Tools"
  }
  ```

- `GET /api/tools` - Get all tools

### Issue/Return

- `POST /api/issue` - Issue a tool to user
  ```json
  {
    "toolId": "TOOL-001",
    "userId": "USER-123"
  }
  ```

- `POST /api/return` - Return a tool
  ```json
  {
    "toolId": "TOOL-001"
  }
  ```

### Inventory Scan

- `POST /api/scan` - Simulate RFID scan
  ```json
  {
    "scannedIds": ["TOOL-001", "TOOL-003", "TOOL-005"]
  }
  ```

### Statistics

- `GET /api/stats` - Get dashboard statistics (total, issued, missing tools)

## Error Handling

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **404** - Not Found (tool not found)
- **409** - Conflict (tool ID already exists)
- **500** - Internal Server Error

## JWT Generation for Testing

To generate a test JWT token, you can use an online tool or Node.js:

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: 'test-user' },
  'your-super-secret-jwt-key-change-this-in-production',
  { expiresIn: '24h' }
);

console.log(token);
```

Use this token in requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/stats
```

## Features

✅ JWT-protected all endpoints
✅ MongoDB models for Tool, Transaction, User
✅ Zod request validation
✅ Error handling with detailed messages
✅ Inventory scan with correct/missing/extra tracking
✅ Tool status management (Available, Issued, Missing)
✅ Transaction logging
✅ Database seeding script
✅ CORS enabled
✅ Security headers with Helmet
