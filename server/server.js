import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database (Mongoose or fallback local JSON database)
connectDB();

// Mount Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'StayMate AI PG Operations API Server is running.',
    timestamp: new Date().toISOString(),
    localDbFallback: !process.env.MONGODB_URI
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ StayMate AI Backend listening at http://localhost:${PORT}`);
});
