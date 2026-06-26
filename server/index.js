const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const contactsRouter = require('./routes/contacts');
const dealsRouter = require('./routes/deals');
const activitiesRouter = require('./routes/activities');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm-demo';

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/activities', activitiesRouter);

app.get('/api/stages', (req, res) => {
  res.json(['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']);
});

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
