import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoute from "./src/routes/userRoute.js";
import projectRoute from './src/routes/projectRoute.js';
import taskRoute from './src/routes/taskRoute.js';
import clientRoute from './src/routes/clientRoute.js';
import uploadRoute from './src/routes/uploadRoute.js';
import clientRequestRoute from './src/routes/clientRequestRoute.js';
import discussionRoute from './src/routes/discussionRoute.js';
import path from 'path';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//routes
app.get('/',(req,res)=>{
  res.send('API is running');
});

app.use("/api/users", userRoute);
app.use("/api/projects", projectRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/clients", clientRoute);
app.use("/api/uploads", uploadRoute);
app.use("/api/client-requests", clientRequestRoute);
app.use("/api/discussions", discussionRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('taskUpdated', (data) => {
    io.emit('refreshTasks', data);
  });

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
