const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS to allow credentials and handle preflight requests
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-API-KEY'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to log requests and set CORS headers
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY");
  console.log(`${req.method} ${req.url}`);
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Open States API Route
app.get('/api/representatives', async (req, res) => {
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
