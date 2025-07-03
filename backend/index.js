const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Change this if your ML service runs on a different host/port
const ML_SERVICE_URL = 'http://localhost:5000';

app.post('/api/predict/:disease', async (req, res) => {
  try {
    const { disease } = req.params;
    const response = await axios.post(`${ML_SERVICE_URL}/predict/${disease}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.error || err.message || 'Prediction failed' });
  }
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
