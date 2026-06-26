const express = require('express');
const cors = require('cors');
const connectDB = require('./_db');

const contactsRouter = require('../server/routes/contacts');
const dealsRouter = require('../server/routes/deals');
const activitiesRouter = require('../server/routes/activities');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB on every request (cached across warm invocations)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/contacts', contactsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/activities', activitiesRouter);

app.get('/api/stages', (req, res) => {
  res.json(['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']);
});

module.exports = app;
