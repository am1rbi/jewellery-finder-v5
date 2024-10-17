const express = require('express');
const router = express.Router();
const Funnel = require('../models/Funnel');

// Create a new funnel entry
router.post('/funnel', async (req, res) => {
  try {
    console.log('Received funnel data:', JSON.stringify(req.body, null, 2));
    const newFunnel = new Funnel(req.body);
    console.log('Created new Funnel document:', newFunnel);
    const savedFunnel = await newFunnel.save();
    console.log('Saved funnel data:', savedFunnel);
    res.status(201).json(savedFunnel);
  } catch (error) {
    console.error('Error saving funnel data:', error);
    res.status(500).json({ 
      message: 'Error saving funnel data',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack 
    });
  }
});

// Get all funnel entries
router.get('/funnel', async (req, res) => {
  try {
    const funnels = await Funnel.find();
    console.log('Retrieved funnels:', funnels);
    res.json(funnels);
  } catch (error) {
    console.error('Error fetching funnels:', error);
    res.status(500).json({ message: 'Error fetching funnels', error: error.message });
  }
});

module.exports = router;