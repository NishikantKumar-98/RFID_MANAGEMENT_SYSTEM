# RFID Tool Management System

## 1. Working Demo

This project is a full-stack RFID-based tool management demo. It contains a React + TypeScript frontend and a Node.js + Express + TypeScript backend connected to MongoDB.

### Demo Purpose

The demo shows how a company or workshop can manage tools using RFID-style tool IDs. Each tool has a unique ID, category, and status. A user can register or log in, add tools to the system, issue tools, return tools, and perform an inventory scan to identify correct, missing, or unknown tool IDs.

### How To Run The Demo

#### Backend

Open a terminal in the backend folder:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```text
PORT=5000
MONGO_URI=mongodb://localhost:27017/rfid-tool-management
JWT_SECRET=your-secret-key
```

Start MongoDB locally, then run:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

#### Frontend

Open another terminal in the frontend folder:

```bash
cd client
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

### Demo Flow

1. Open the frontend in the browser.
2. Register a user with a user ID and name.
3. Log in using the registered user ID.
4. Go to Tool Master and add tools with a unique tool ID, name, and category.
5. Go to Issue / Return to issue an available tool to a user.
6. Return an issued tool from the same page.
7. Go to Inventory Scan and enter scanned tool IDs.
8. View dashboard counts for total tools, issued tools, and missing tools.

### Main Screens

- Login and Register: user authentication.
- Dashboard: summary of total, issued, and missing tools.
- Tool Master: add and view tool records.
- Issue / Return: change tool status between Available and Issued.
- Inventory Scan: compare scanned IDs against stored tool records.

### Important API Endpoints

| Feature | Method | Endpoint | Description |
|---|---:|---|---|
| Register | POST | `/api/auth/register` | Creates a user and returns a JWT token |
| Login | POST | `/api/auth/login` | Logs in an existing user |
| Tools | GET | `/api/tools` | Gets all tools |
| Tools | POST | `/api/tools` | Creates a new tool |
| Issue | POST | `/api/issue` | Issues an available tool |
| Return | POST | `/api/return` | Returns an issued tool |
| Scan | POST | `/api/scan` | Compares scanned RFID IDs with database records |
| Stats | GET | `/api/stats` | Gets dashboard counts |

All protected endpoints use this header:

```text
Authorization: Bearer <token>
```

## 2. Database Schema

The system uses MongoDB with Mongoose models. The schema is intentionally simple because this project is an MVP/demo.

### Users Collection

Stores users who can log in to the system.

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB generated ID |
| `userId` | String | Yes | Unique user ID used for login |
| `name` | String | Yes | User display name |
| `createdAt` | Date | Yes | Created automatically by Mongoose |
| `updatedAt` | Date | Yes | Updated automatically by Mongoose |

Example:

```json
{
  "userId": "USER-001",
  "name": "Nishikant"
}
```

### Tools Collection

Stores all tool inventory records.

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB generated ID |
| `toolId` | String | Yes | Unique RFID/tool identifier |
| `name` | String | Yes | Tool name |
| `category` | String | Yes | Tool category |
| `status` | String | Yes | Current status of the tool |
| `createdAt` | Date | Yes | Created automatically by Mongoose |
| `updatedAt` | Date | Yes | Updated automatically by Mongoose |

Allowed categories:

- Power Tools
- Hand Tools
- Measuring Tools
- Safety Equipment
- Electrical Tools

Allowed statuses:

- Available
- Issued
- Missing

Example:

```json
{
  "toolId": "TOOL-001",
  "name": "Drill Machine",
  "category": "Power Tools",
  "status": "Available"
}
```

### Transactions Collection

Stores issue and return history.

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | MongoDB generated ID |
| `toolId` | String | Yes | Tool involved in the transaction |
| `userId` | String | Yes | User involved in the transaction |
| `type` | String | Yes | Issue or Return |
| `timestamp` | Date | Yes | Transaction time |

Allowed transaction types:

- Issue
- Return

Example:

```json
{
  "toolId": "TOOL-001",
  "userId": "USER-001",
  "type": "Issue",
  "timestamp": "2026-05-10T10:00:00.000Z"
}
```

### Simple Relationship View

```text
User
  userId
    |
    | referenced in
    v
Transaction
  toolId
    |
    | references
    v
Tool
  toolId
```

MongoDB does not enforce foreign keys in this project. The relationship is maintained by storing `userId` and `toolId` values inside transaction records.

## 3. Short Explanation

### How The System Works

The system is designed around the lifecycle of tools in an inventory. Each physical tool is represented by a tool record in MongoDB. The `toolId` field works like the RFID tag ID. In a real RFID setup, this value would come from an RFID reader. In this demo, the user enters or scans IDs manually through the frontend.

When a user registers, the backend stores the user in the Users collection and returns a JWT token. The frontend saves this token in local storage. For protected API calls, the Axios client automatically attaches the token in the `Authorization` header. The backend verifies this token before allowing access to tool, issue, return, scan, and stats routes.

The Tool Master screen allows new tools to be added. When a tool is created, it starts with the `Available` status. The backend checks that the tool ID is unique and validates the category before saving it.

The issue workflow changes a tool from `Available` to `Issued`. The backend first checks whether the tool exists and whether it is currently available. If both checks pass, it updates the tool status and creates an `Issue` transaction record.

The return workflow changes a tool from `Issued` back to `Available`. The backend checks that the tool exists and that it is currently issued. If valid, it updates the status and creates a `Return` transaction record.

The inventory scan workflow compares scanned tool IDs with the database. The backend receives an array of scanned IDs. It checks which scanned IDs exist in the database, which scanned IDs are unknown, and which issued tools were not found in the scan. Unknown scanned IDs are returned as `extra`. Valid scanned IDs are returned as `correct`. Issued tools that are not scanned are marked as `Missing` and returned in the `missing` list.

The dashboard uses the stats endpoint to count total tools, issued tools, and missing tools. These values help the user quickly understand the current inventory state.

### Assumptions

- Each physical tool has one unique RFID/tool ID.
- Tool IDs are entered correctly by the user or scanner.
- One tool can have only one active status at a time.
- A tool can be issued only if its status is `Available`.
- A tool can be returned only if its status is `Issued`.
- The demo uses simple user login by `userId`; it does not use passwords.
- JWT tokens are stored in browser local storage for simplicity.
- MongoDB is available locally or through a valid MongoDB connection string.
- The scan feature receives a list of RFID IDs from the frontend.
- The project is intended as an MVP/demo, not a production-ready inventory platform.

### Limitations

- There is no password-based authentication.
- There are no user roles such as admin, supervisor, or employee.
- Return transactions currently use `system` as the user ID.
- Transaction history is saved in the database but no full transaction history screen is provided.
- Tools can be created and listed, but edit and delete operations are not implemented.
- The RFID scan is simulated by entering IDs manually; there is no direct hardware integration.
- The scan logic marks issued tools as missing when they are not included in the scanned list.
- There is no pagination, filtering, or advanced search for large inventories.
- JWT tokens are stored in local storage, which is acceptable for a demo but should be improved for production.
- There are no automated tests included for frontend or backend workflows.
- The system does not enforce MongoDB foreign key relationships between users, tools, and transactions.

### Future Improvements

- Add password login and secure password hashing.
- Add role-based access control.
- Add transaction history screens and filters.
- Add edit/delete tool functionality.
- Add real RFID reader integration.
- Add audit logs for inventory changes.
- Move JWT handling to secure httpOnly cookies.
- Add automated API and UI tests.
- Add reporting, export, and analytics features.
