const express = require('express');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware to check token
const authenticateToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Endpoint to fetch representatives (using LegiScan API)
app.get('/api/representatives', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`https://api.legiscan.com/?key=${process.env.LEGISCAN_API_KEY}&op=getSessionPeople&id=2008`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching representatives from LegiScan:', error);
    res.status(500).send(error.toString());
  }
});

// Endpoint to fetch details for a representative (using LegiScan API)
app.get('/api/representative/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching details for representative with ID: ${id}`);
  try {
    const response = await axios.get(`https://api.legiscan.com/?key=${process.env.LEGISCAN_API_KEY}&op=getPerson&id=${id}`);
    console.log('Representative API Response:', JSON.stringify(response.data, null, 2)); // Log the response data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching representative details:', error);
    res.status(500).send(error.toString());
  }
});

// Endpoint to fetch voting records for a representative (using LegiScan API)
app.get('/api/representative/:id/votes', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching votes for representative with ID: ${id}`);
  try {
    // Fetch the list of sponsored bills by the representative
    const sponsoredListResponse = await axios.get(`https://api.legiscan.com/?key=${process.env.LEGISCAN_API_KEY}&op=getSponsoredList&id=${id}`);
    console.log('Sponsored List Response:', JSON.stringify(sponsoredListResponse.data, null, 2)); // Log the sponsored list response

    if (!sponsoredListResponse.data.sponsored) {
      return res.status(404).json({ message: 'No sponsored bills found for the representative' });
    }

    const billsSponsored = sponsoredListResponse.data.sponsored || [];

    // Fetch roll call votes for each bill sponsored by the representative
    const rollCalls = await Promise.all(billsSponsored.map(async (bill) => {
      const rollCallResponse = await axios.get(`https://api.legiscan.com/?key=${process.env.LEGISCAN_API_KEY}&op=getRollCall&id=${bill.bill_id}`);
      return rollCallResponse.data.roll_call;
    }));

    console.log('Vote API Response:', JSON.stringify(rollCalls, null, 2)); // Log the response data
    res.json({ votes: rollCalls });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).send(error.toString());
  }
});

// Endpoint to fetch news
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=politics&apiKey=${process.env.NEWS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 5001;
app.set('port', PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
