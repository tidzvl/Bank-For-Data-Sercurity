import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import staffRoutes from './routes/staff.js';
import directorRoutes from './routes/director.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5003',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Banking API Server'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/director', directorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🏦 BM Bank API Server');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🚀 Server running on: http://localhost:${PORT}`);
  console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5003'}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('  📡 Available endpoints:');
  console.log('     GET  /health');
  console.log('     POST /api/auth/login');
  console.log('     POST /api/auth/verify');
  console.log('     GET  /api/customer/*');
  console.log('     GET  /api/staff/*');
  console.log('     GET  /api/director/*');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  💡 Ready to accept connections!');
  console.log('═══════════════════════════════════════════════════════\n');
});
