const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const Deal = require('./models/Deal');
const Activity = require('./models/Activity');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm-demo';

const contacts = [
  { name: 'Alice Johnson', email: 'alice@acme.com', phone: '555-0101', company: 'Acme Corp', role: 'CEO', notes: 'Key decision maker, prefers email communication' },
  { name: 'Bob Smith', email: 'bob@globex.io', phone: '555-0102', company: 'Globex Inc', role: 'CTO', notes: 'Technical lead, interested in cloud solutions' },
  { name: 'Carol Davis', email: 'carol@initech.com', phone: '555-0103', company: 'Initech', role: 'VP Sales', notes: 'Hot lead, decision expected this quarter' },
  { name: 'Dan Wilson', email: 'dan@umbrella.co', phone: '555-0104', company: 'Umbrella Co', role: 'IT Manager', notes: 'Budget approved for Q3' },
  { name: 'Eve Martin', email: 'eve@stark.com', phone: '555-0105', company: 'Stark Industries', role: 'Director of Ops', notes: 'Long-term partnership potential' },
  { name: 'Frank Lee', email: 'frank@octo.com', phone: '555-0106', company: 'OctoCorp', role: 'CFO', notes: 'Very budget-conscious' },
  { name: 'Grace Kim', email: 'grace@nova.io', phone: '555-0107', company: 'Nova Systems', role: 'Product Manager', notes: 'Needs demo by end of month' },
  { name: 'Henry Zhao', email: 'henry@apex.dev', phone: '555-0108', company: 'Apex Dev', role: 'Founder', notes: 'Startup, rapid growth potential' },
  { name: 'Iris Chen', email: 'iris@pixel.co', phone: '555-0109', company: 'Pixel Labs', role: 'Creative Director', notes: 'Interested in design services' },
  { name: 'Jack Brown', email: 'jack@river.com', phone: '555-0110', company: 'River Inc', role: 'Operations Lead', notes: 'Warm referral from Alice' },
  { name: 'Karen White', email: 'karen@silver.com', phone: '555-0111', company: 'Silver Creek', role: 'CEO', notes: 'Enterprise client, high priority' },
  { name: 'Leo Torres', email: 'leo@copper.net', phone: '555-0112', company: 'Copper Net', role: 'VP Engineering', notes: 'Technical evaluation in progress' },
  { name: 'Maria Garcia', email: 'maria@green.co', phone: '555-0113', company: 'Green Energy Co', role: 'Sustainability Officer', notes: 'ESG-focused, good brand fit' },
  { name: 'Nathan Park', email: 'nathan@blue.dev', phone: '555-0114', company: 'Blue Dev Studio', role: 'CTO', notes: 'Small team, high growth' },
  { name: 'Olivia Adams', email: 'olivia@red.com', phone: '555-0115', company: 'Red Sky Ltd', role: 'Procurement Manager', notes: 'Formal RFP process required' },
];

const deals = [
  { title: 'Website Redesign', value: 15000, stage: 'Proposal', company: 'Acme Corp', contactIdx: 0 },
  { title: 'Mobile App Development', value: 45000, stage: 'Negotiation', company: 'Globex Inc', contactIdx: 1 },
  { title: 'Cloud Migration Suite', value: 80000, stage: 'Qualified', company: 'Initech', contactIdx: 2 },
  { title: 'SEO Optimization', value: 5000, stage: 'Lead', company: 'Umbrella Co', contactIdx: 3 },
  { title: 'Data Analytics Platform', value: 60000, stage: 'Closed Won', company: 'Stark Industries', contactIdx: 4 },
  { title: 'IT Consulting Retainer', value: 24000, stage: 'Lead', company: 'Acme Corp', contactIdx: 0 },
  { title: 'Cybersecurity Audit', value: 35000, stage: 'Qualified', company: 'Nova Systems', contactIdx: 6 },
  { title: 'E-commerce Platform', value: 95000, stage: 'Proposal', company: 'OctoCorp', contactIdx: 5 },
  { title: 'Brand Identity Package', value: 12000, stage: 'Lead', company: 'Pixel Labs', contactIdx: 8 },
  { title: 'Infrastructure Upgrade', value: 55000, stage: 'Negotiation', company: 'River Inc', contactIdx: 9 },
  { title: 'ERP Implementation', value: 120000, stage: 'Closed Lost', company: 'Silver Creek', contactIdx: 10 },
  { title: 'DevOps Consulting', value: 28000, stage: 'Closed Won', company: 'Apex Dev', contactIdx: 7 },
  { title: 'AI Chatbot Development', value: 42000, stage: 'Qualified', company: 'Copper Net', contactIdx: 11 },
  { title: 'Sustainability Dashboard', value: 18000, stage: 'Proposal', company: 'Green Energy Co', contactIdx: 12 },
  { title: 'API Integration Project', value: 22000, stage: 'Lead', company: 'Blue Dev Studio', contactIdx: 13 },
];

const activities = [
  { type: 'Call', subject: 'Initial outreach call', description: 'Discussed website needs and timeline', contactIdx: 0, dealIdx: 0 },
  { type: 'Meeting', subject: 'Requirements workshop', description: 'Met with Bob and engineering team to scope mobile app', contactIdx: 1, dealIdx: 1 },
  { type: 'Email', subject: 'Cloud migration proposal sent', description: 'Sent detailed pricing and migration timeline', contactIdx: 2, dealIdx: 2 },
  { type: 'Note', subject: 'Internal memo', description: 'Carol is very interested, prioritize follow-up', contactIdx: 2, dealIdx: 2 },
  { type: 'Task', subject: 'Schedule follow-up demo', description: 'Book calendar for next week with Dan', contactIdx: 3, dealIdx: 3 },
  { type: 'Email', subject: 'Contract signed!', description: 'Eve confirmed and signed the analytics platform deal', contactIdx: 4, dealIdx: 4 },
  { type: 'Call', subject: 'Discovery call', description: 'Discussed cybersecurity needs with Grace', contactIdx: 6, dealIdx: 6 },
  { type: 'Meeting', subject: 'Proposal review', description: 'Walked through e-commerce proposal with Frank', contactIdx: 5, dealIdx: 7 },
  { type: 'Note', subject: 'Budget constraints', description: 'Frank needs board approval for e-commerce platform', contactIdx: 5, dealIdx: 7 },
  { type: 'Call', subject: 'Creative brief call', description: 'Iris shared brand guidelines and preferences', contactIdx: 8, dealIdx: 8 },
  { type: 'Email', subject: 'Infrastructure quote sent', description: 'Sent pricing for server upgrade and migration', contactIdx: 9, dealIdx: 9 },
  { type: 'Task', subject: 'Follow up with Karen', description: 'Send revised proposal after feedback', contactIdx: 10, dealIdx: 10 },
  { type: 'Meeting', subject: 'ERP requirements gathering', description: 'Karen outlined integration requirements', contactIdx: 10, dealIdx: 10 },
  { type: 'Email', subject: 'DevOps engagement closed', description: 'Leo confirmed project kickoff', contactIdx: 7, dealIdx: 11 },
  { type: 'Call', subject: 'AI chatbot discovery', description: 'Discussed chatbot use cases with Maria', contactIdx: 11, dealIdx: 12 },
  { type: 'Note', subject: 'Technical notes', description: 'Nathan has specific API requirements for integration', contactIdx: 13, dealIdx: 14 },
  { type: 'Meeting', subject: 'Sustainability goals', description: 'Maria wants carbon tracking features in dashboard', contactIdx: 12, dealIdx: 13 },
  { type: 'Email', subject: 'Proposal adjustments', description: 'Sent updated proposal with reduced scope for budget', contactIdx: 5, dealIdx: 7 },
  { type: 'Call', subject: 'Check-in call', description: 'Alice happy with website redesign progress', contactIdx: 0, dealIdx: 0 },
  { type: 'Task', subject: 'Prepare Q2 forecast', description: 'Compile pipeline data for quarterly review', contactIdx: null, dealIdx: null },
  { type: 'Meeting', subject: 'Quarterly review', description: 'Presented CRM pipeline to leadership team', contactIdx: null, dealIdx: null },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([Contact.deleteMany({}), Deal.deleteMany({}), Activity.deleteMany({})]);

  const createdContacts = await Contact.insertMany(contacts);
  console.log(`Seeded ${createdContacts.length} contacts`);

  const dealsWithRefs = deals.map((d) => ({
    title: d.title,
    value: d.value,
    stage: d.stage,
    company: d.company,
    contactId: createdContacts[d.contactIdx]._id,
  }));
  const createdDeals = await Deal.insertMany(dealsWithRefs);
  console.log(`Seeded ${createdDeals.length} deals`);

  const activitiesWithRefs = activities.map((a) => ({
    type: a.type,
    subject: a.subject,
    description: a.description,
    contactId: a.contactIdx !== null && a.contactIdx !== undefined ? createdContacts[a.contactIdx]._id : undefined,
    dealId: a.dealIdx !== null && a.dealIdx !== undefined ? createdDeals[a.dealIdx]._id : undefined,
  }));
  const createdActivities = await Activity.insertMany(activitiesWithRefs);
  console.log(`Seeded ${createdActivities.length} activities`);

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
