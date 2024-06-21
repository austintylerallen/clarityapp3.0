// backend/app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const newsApiKey = process.env.NEWS_API_KEY;
const propublicaApiKey = process.env.PROPUBLICA_API_KEY;
const googleCivicApiKey = process.env.GOOGLE_CIVIC_API_KEY;

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=politics&apiKey=${newsApiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/api/representatives', async (req, res) => {
  try {
    const response = await axios.get(`https://api.propublica.org/congress/v1/members.json`, {
      headers: { 'X-API-Key': propublicaApiKey }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/api/elections', async (req, res) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/elections?key=${googleCivicApiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 5000;
app.set('port', PORT);

module.exports = app;
