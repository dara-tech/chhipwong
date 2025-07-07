import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import https from 'https'; // Added
import authRoutes from './routes/authRoutes.js';
import companyRoute from './routes/companyRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import viewerRoutes from './routes/viewerRoutes.js';
import {trackVisit} from './middleware/visitTracker.js';

dotenv.config();

const app = express();
app.set('trust proxy', true); // Trust proxy for correct client IP
const PORT = process.env.PORT || 5001;
const AUTO_RELOAD_INTERVAL = 10 * 60 * 1000; // 10 minutes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5001",
    "https://chhipwong.onrender.com",
    "https://www.chimmywonggroup.com",
    "https://chimmywonggroup.com",
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(trackVisit);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoute);
app.use('/api/payments', paymentRoutes);
app.use('/api/viewers', viewerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Fallback to frontend
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Auto-reload ping
const autoReload = () => {
  https.get("https://chhipwong.onrender.com/", (res) => {
    console.log(`[${new Date().toISOString()}] 🔄 Auto-reload request sent. Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`[${new Date().toISOString()}] ❌ Auto-reload failed: ${err.message}`);
  }).on("timeout", () => {
    console.warn(`[${new Date().toISOString()}] ⚠️ Auto-reload request timed out.`);
  }).setTimeout(10000);
};

// Start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      autoReload();
      setInterval(autoReload, AUTO_RELOAD_INTERVAL);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });