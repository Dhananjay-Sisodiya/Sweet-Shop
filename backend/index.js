require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.NODE_ENV === 'test' ? (process.env.MONGO_URI_TEST || process.env.MONGO_URI) : process.env.MONGO_URI;

connectDB(MONGO_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));


// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // for testing
