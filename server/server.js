import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoute from "./src/routes/userRoute.js";
import projectRoute from './src/routes/projectRoute.js';
import taskRoute from './src/routes/taskRoute.js';



dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('taskUpdated', (data) => {
    io.emit('refreshTasks', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});
//routes
app.get('/',(req,res)=>{
  res.send('API is running');
});

app.use("/api/user", userRoute);
app.use("/api/projects",projectRoute);
app.use("/api/tasks",taskRoute);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
