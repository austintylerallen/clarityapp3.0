const express = require('express');
const axios = require('axios');
const cors = require('cors');
const connectDB = require('./config/db');
const auth = require('./middleware/auth'); // Import auth middleware
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log(`${req.method} ${req.url}`);
  next();
});

// Open States API Route (protected)
app.get('/api/representatives', auth, async (req, res) => {
  try {
    const response = await axios.get('https://v3.openstates.org/people?jurisdiction=ocd-jurisdiction/country:us/state:ny/government', {
      headers: {
        'X-API-Key': process.env.OPEN_STATES_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});

// News API Route (protected)
app.get('/api/news', auth, async (req, res) => {
  const { q } = req.query;
  console.log('Fetching news for query:', q);
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: q || 'politics',
        apiKey: process.env.NEWS_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news from API:', error);
    res.status(500).send(error.toString());
  }
});

// Authentication Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
