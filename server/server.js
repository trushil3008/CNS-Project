const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

app.use(cors({
  origin(origin, callback) {
    // Allow requests without Origin header (e.g. Postman, curl, server-to-server).
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy blocked origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
const mongoDirectUri = process.env.MONGO_URI_DIRECT;

if (!mongoUri) {
  console.error('MongoDB URI is missing. Set MONGO_URI in .env');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');

const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4
};

function isSrvDnsError(err) {
  if (!err) return false;

  return (
    err.syscall === 'querySrv' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'ENOTFOUND' ||
    err.code === 'EAI_AGAIN' ||
    err.code === 'ETIMEOUT' ||
    (typeof err.message === 'string' && err.message.toLowerCase().includes('querysrv'))
  );
}

async function connectToMongo() {
  try {
    await mongoose.connect(mongoUri, mongoOptions);
    console.log('Connected to MongoDB successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    return;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);

    if (isSrvDnsError(err) && mongoDirectUri) {
      console.warn('SRV DNS lookup failed. Retrying with MONGO_URI_DIRECT...');

      try {
        await mongoose.connect(mongoDirectUri, mongoOptions);
        console.log('Connected to MongoDB successfully using MONGO_URI_DIRECT!');
        console.log('Database:', mongoose.connection.db.databaseName);
        return;
      } catch (directErr) {
        console.error('MongoDB direct URI connection failed:', directErr.message);
        console.error('Full error:', directErr);
        return;
      }
    }

    if (isSrvDnsError(err) && !mongoDirectUri) {
      console.error('SRV DNS lookup failed and MONGO_URI_DIRECT is not set.');
      console.error('Add MONGO_URI_DIRECT to .env using the non-SRV Atlas connection string.');
    }

    console.error('Full error:', err);
  }
}

connectToMongo();

// Monitor connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error event:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PayPal API is running' });
});

// Database connection status endpoint
app.get('/api/status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({ 
    api: 'running',
    database: states[dbState] || 'unknown',
    dbStateCode: dbState
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
