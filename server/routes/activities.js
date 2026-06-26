const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

router.get('/', async (req, res) => {
  const { contactId } = req.query;
  const filter = contactId ? { contactId } : {};
  const activities = await Activity.find(filter)
    .populate('contactId', 'name')
    .populate('dealId', 'title')
    .sort({ createdAt: -1 });
  res.json(activities);
});

router.get('/:id', async (req, res) => {
  const activity = await Activity.findById(req.params.id)
    .populate('contactId', 'name')
    .populate('dealId', 'title');
  if (!activity) return res.status(404).json({ error: 'Not found' });
  res.json(activity);
});

router.post('/', async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json(activity);
});

router.put('/:id', async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!activity) return res.status(404).json({ error: 'Not found' });
  res.json(activity);
});

router.delete('/:id', async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
