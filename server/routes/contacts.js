const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

router.get('/', async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};
  const contacts = await Contact.find(filter).sort({ createdAt: -1 });
  res.json(contacts);
});

router.get('/:id', async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Not found' });
  res.json(contact);
});

router.post('/', async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
});

router.put('/:id', async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!contact) return res.status(404).json({ error: 'Not found' });
  res.json(contact);
});

router.delete('/:id', async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
