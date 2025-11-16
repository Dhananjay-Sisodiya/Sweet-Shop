require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ✅ CORS ALLOW (must be before routes)
app.use(cors({
  origin: "*",        // allow all frontend URLs
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? (process.env.MONGO_URI_TEST || process.env.MONGO_URI)
    : process.env.MONGO_URI;

// Database connect
connectDB(MONGO_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // for testing
