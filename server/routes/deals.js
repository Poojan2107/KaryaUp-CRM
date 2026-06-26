const express = require('express');
const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const router = express.Router();

router.get('/', async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? { $or: [{ title: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }] }
    : {};
  const deals = await Deal.find(filter).sort({ updatedAt: -1 });
  res.json(deals);
});

router.get('/:id', async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Not found' });
  res.json(deal);
});

router.get('/:id/activities', async (req, res) => {
  const activities = await Activity.find({ dealId: req.params.id })
    .populate('contactId', 'name')
    .sort({ createdAt: -1 });
  res.json(activities);
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
  await Activity.updateMany({ dealId: req.params.id }, { $unset: { dealId: '' } });
  res.json({ message: 'Deleted' });
});

module.exports = router;
