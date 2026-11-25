import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import apiRouter from './routes/apiRouter';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { seedDatabase } from './utils/seed';

// Load environment configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Access denied for this origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Serve public static assets (images, logos, slide banners)
const publicPath = path.resolve(__dirname, '../../client/public');
app.use('/assets', express.static(publicPath));
app.use(express.static(publicPath));

// Health check / Root endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DanceAura Management API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Main API Router
app.use('/api', apiRouter);

// Fallback error handling
app.use(notFound);
app.use(errorHandler);

// Server startup and database connection
let serverInstance: any = null;

export const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    serverInstance = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  DanceAura Server listening on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    return serverInstance;
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    throw error;
  }
};

// Auto-run if executed directly
if (require.main === module) {
  startServer();
}

export default app;
