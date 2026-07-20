const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const { loginLimiter } = require("./controllers/LimitSecure/ExpressLimit.js");

dotenv.config();

const app = express();
const server = http.createServer(app); // <-- create the actual HTTP server

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.locals.io = io; // accessible in routes/controllers via req.app.locals.io

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('Received from client:', data);
    socket.emit('messageReceived', { status: 'ok', echo: data });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api/auth/login', loginLimiter);

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Connect to MongoDB, then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {          // <-- listen on `server`, not `app`
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });