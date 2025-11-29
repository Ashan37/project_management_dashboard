Project Management Dashboard

A full-stack Project Management & Dashboard System designed for software companies to manage projects, tasks, team collaboration, and client interactions efficiently.

Features

Core Functionality

Project Management

* Create and manage multiple projects
* Assign team members
* Track progress with progress bars
* Set start and end dates
* Assign clients to projects

Kanban Board

* Drag-and-drop task management
* Workflow: To Do → In Progress → In Review → Completed
* Real-time updates
* Task cards with priority indicators

Task Management

* Create and assign tasks
* Subtasks with completion tracking
* Due dates and priority levels
* Task comments
* File attachments
* Status permission controls

Client Portal

* Client login and dashboard
* View assigned projects and progress
* Track milestones and updates
* Submit requirement/change requests
* Request types: Requirements, Changes, Bugs, Features
* Track request status

Internal Communication

* Discussion threads for projects and tasks
* @Mention team members
* Real-time messaging
* Emoji reactions
* Message replies
* File sharing

User Management

* Role-based access control
* JWT authentication
* Admin user creation
* Profile management

Dashboard Analytics

* Role-specific widgets
* Project and task statistics
* Client request tracking
* Progress visualization

---

Tech Stack

Frontend

* React 18
* React Router v6
* TailwindCSS
* Zustand
* Axios
* Socket.io Client
* DnD Kit
* Vite

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JWT
* Bcrypt
* Multer
* CORS

---

Project Structure

```
Project_Management_Dashboard/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── socket/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

Installation

Prerequisites

* Node.js v18+
* MongoDB Atlas or local MongoDB
* Git

Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/project-management-dashboard.git
cd project-management-dashboard
```

Step 2: Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start backend:

```bash
npm start
```

Step 3: Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

---

Environment Variables

Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb_connection_string
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5174
```

---

Usage

Default Admin User

Create manually in MongoDB:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

User Roles

Role     
Admin   
Manager  
Employee 
Client   

---

API Documentation

Authentication

```
POST /api/users/register
POST /api/users/login
```

Projects

```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/my-projects
```

Tasks

```
GET    /api/tasks/my-tasks
GET    /api/tasks/project/:projectId
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

### Client Requests

```
POST   /api/client-requests
GET    /api/client-requests/my-requests
GET    /api/client-requests
PATCH  /api/client-requests/:id
```

### Discussions

```
POST   /api/discussions
GET    /api/discussions/project/:projectId
GET    /api/discussions/task/:taskId
PUT    /api/discussions/:id
DELETE /api/discussions/:id
POST   /api/discussions/:id/reaction
```

Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request
