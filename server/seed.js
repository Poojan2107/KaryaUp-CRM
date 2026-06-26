const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const Deal = require('./models/Deal');
const Activity = require('./models/Activity');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm-demo';

const contacts = [
  { name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', company: 'Acme Corp', role: 'CEO', notes: 'Key decision maker' },
  { name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', company: 'Globex Inc', role: 'CTO', notes: 'Technical lead' },
  { name: 'Carol Davis', email: 'carol@example.com', phone: '555-0103', company: 'Initech', role: 'VP Sales', notes: 'Hot lead' },
  { name: 'Dan Wilson', email: 'dan@example.com', phone: '555-0104', company: 'Umbrella Co', role: 'Manager', notes: '' },
  { name: 'Eve Martin', email: 'eve@example.com', phone: '555-0105', company: 'Stark Ind', role: 'Director', notes: 'Follow up in Q2' },
];

const deals = [
  { title: 'Website Redesign', value: 15000, stage: 'Proposal', company: 'Acme Corp' },
  { title: 'Mobile App Development', value: 45000, stage: 'Negotiation', company: 'Globex Inc' },
  { title: 'Cloud Migration', value: 80000, stage: 'Qualified', company: 'Initech' },
  { title: 'SEO Optimization', value: 5000, stage: 'Lead', company: 'Umbrella Co' },
  { title: 'Data Analytics Platform', value: 60000, stage: 'Closed Won', company: 'Stark Ind' },
  { title: 'IT Consulting Retainer', value: 24000, stage: 'Lead', company: 'Acme Corp' },
];

const activities = [
  { type: 'Call', subject: 'Initial outreach', description: 'Discussed website needs', contactIdx: 0, dealIdx: 0 },
  { type: 'Meeting', subject: 'Requirements gathering', description: 'Met with Bob and team', contactIdx: 1, dealIdx: 1 },
  { type: 'Email', subject: 'Proposal sent', description: 'Sent pricing for cloud migration', contactIdx: 2, dealIdx: 2 },
  { type: 'Note', subject: 'Internal note', description: 'Carol seems very interested', contactIdx: 2, dealIdx: 2 },
  { type: 'Task', subject: 'Follow up next week', description: 'Call Dan to re-engage', contactIdx: 3, dealIdx: 3 },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([Contact.deleteMany({}), Deal.deleteMany({}), Activity.deleteMany({})]);

  const createdContacts = await Contact.insertMany(contacts);
  console.log(`Seeded ${createdContacts.length} contacts`);

  const dealsWithRefs = deals.map((d, i) => ({
    ...d,
    contactId: createdContacts[i % createdContacts.length]._id,
  }));
  const createdDeals = await Deal.insertMany(dealsWithRefs);
  console.log(`Seeded ${createdDeals.length} deals`);

  const activitiesWithRefs = activities.map((a) => ({
    ...a,
    contactId: createdContacts[a.contactIdx]._id,
    dealId: createdDeals[a.dealIdx]._id,
  }));
  const cleaned = activitiesWithRefs.map(({ contactIdx, dealIdx, ...rest }) => rest);
  const createdActivities = await Activity.insertMany(cleaned);
  console.log(`Seeded ${createdActivities.length} activities`);

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
