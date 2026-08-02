const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();




const allowedOrigins = [
  'http://localhost:5173',
  'https://blog-app-two-kappa-21.vercel.app',
  'https://blog-76o679oqs-sanskruti4.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Generic error handler (safety net)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('DB Connection Error:', err.message));
