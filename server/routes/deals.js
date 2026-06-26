const express = require('express');
const Deal = require('../models/Deal');
const router = express.Router();

router.get('/', async (req, res) => {
  const deals = await Deal.find().sort({ updatedAt: -1 });
  res.json(deals);
});

router.get('/:id', async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Not found' });
  res.json(deal);
});

router.post('/', async (req, res) => {
  const deal = await Deal.create(req.body);
  res.status(201).json(deal);
});

router.put('/:id', async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!deal) return res.status(404).json({ error: 'Not found' });
  res.json(deal);
});

router.delete('/:id', async (req, res) => {
  const deal = await Deal.findByIdAndDelete(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
