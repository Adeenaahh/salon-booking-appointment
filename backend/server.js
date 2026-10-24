import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, isDbConnected } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [allowedOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight Request Logger for Development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// System Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isDbConnected();
  res.status(dbStatus ? 200 : 503).json({
    status: dbStatus ? 'UP' : 'DEGRADED',
    message: 'Glamour Haven Salon API is running',
    database: {
      connected: dbStatus,
      status: dbStatus ? 'Connected to MongoDB' : 'Disconnected / Pending MONGODB_URI configuration'
    },
    timestamp: new Date().toISOString()
  });
});

// Root API Greeting
app.get('/api', (req, res) => {
  res.json({
    message: '🌸 Welcome to Glamour Haven Salon Appointment Booking API',
    version: '1.0.0',
    documentation: '/README.md'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// 404 & Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🌸 Glamour Haven Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   API Root    : http://localhost:${PORT}/api`);
});

export default app;
