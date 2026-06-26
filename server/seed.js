const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const Deal = require('./models/Deal');
const Activity = require('./models/Activity');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm-demo';

const contacts = [
  { name: 'Priya Sharma', email: 'priya@tata.com', phone: '+91-98765-43201', company: 'Tata Digital', role: 'CEO', notes: 'Key decision maker, prefers email' },
  { name: 'Rahul Verma', email: 'rahul@infosys.com', phone: '+91-98765-43202', company: 'Infosys', role: 'CTO', notes: 'Technical lead, interested in cloud' },
  { name: 'Ananya Gupta', email: 'ananya@zomato.com', phone: '+91-98765-43203', company: 'Zomato', role: 'VP Engineering', notes: 'Hot lead, decision expected this quarter' },
  { name: 'Vikram Patel', email: 'vikram@razorpay.com', phone: '+91-98765-43204', company: 'Razorpay', role: 'Engineering Manager', notes: 'Budget approved for Q3' },
  { name: 'Deepika Singh', email: 'deepika@nykaa.com', phone: '+91-98765-43205', company: 'Nykaa', role: 'Director of Ops', notes: 'Long-term partnership potential' },
  { name: 'Arjun Nair', email: 'arjun@flipkart.com', phone: '+91-98765-43206', company: 'Flipkart', role: 'CFO', notes: 'Very budget-conscious' },
  { name: 'Neha Joshi', email: 'neha@swiggy.in', phone: '+91-98765-43207', company: 'Swiggy', role: 'Product Head', notes: 'Needs demo by month end' },
  { name: 'Rohit Deshmukh', email: 'rohit@zerodha.com', phone: '+91-98765-43208', company: 'Zerodha', role: 'Founder', notes: 'Startup, rapid growth potential' },
  { name: 'Iyer Krishnan', email: 'iyer@freshworks.com', phone: '+91-98765-43209', company: 'Freshworks', role: 'Creative Director', notes: 'Interested in design services' },
  { name: 'Kavita Reddy', email: 'kavita@phonepe.com', phone: '+91-98765-43210', company: 'PhonePe', role: 'Operations Lead', notes: 'Warm referral from Priya' },
  { name: 'Amit Saxena', email: 'amit@oyorooms.com', phone: '+91-98765-43211', company: 'OYO Rooms', role: 'CEO', notes: 'Enterprise client, high priority' },
  { name: 'Sneha Kulkarni', email: 'sneha@bharatpe.com', phone: '+91-98765-43212', company: 'BharatPe', role: 'VP Engineering', notes: 'Technical evaluation in progress' },
  { name: 'Pooja Mehta', email: 'pooja@reliance.com', phone: '+91-98765-43213', company: 'Reliance Retail', role: 'Sustainability Officer', notes: 'Good brand fit' },
  { name: 'Karan Kapoor', email: 'karan@upstox.com', phone: '+91-98765-43214', company: 'Upstox', role: 'CTO', notes: 'Small team, high growth' },
  { name: 'Maya Pillai', email: 'maya@policybazaar.com', phone: '+91-98765-43215', company: 'PolicyBazaar', role: 'Procurement Head', notes: 'Formal RFP process required' },
];

const deals = [
  { title: 'Website Redesign', value: 1500000, stage: 'Proposal', company: 'Tata Digital', contactIdx: 0 },
  { title: 'Mobile App Development', value: 4500000, stage: 'Negotiation', company: 'Infosys', contactIdx: 1 },
  { title: 'Cloud Migration Suite', value: 8000000, stage: 'Qualified', company: 'Zomato', contactIdx: 2 },
  { title: 'SEO Optimization', value: 500000, stage: 'Lead', company: 'Razorpay', contactIdx: 3 },
  { title: 'Data Analytics Platform', value: 6000000, stage: 'Closed Won', company: 'Nykaa', contactIdx: 4 },
  { title: 'IT Consulting Retainer', value: 2400000, stage: 'Lead', company: 'Tata Digital', contactIdx: 0 },
  { title: 'Cybersecurity Audit', value: 3500000, stage: 'Qualified', company: 'Swiggy', contactIdx: 6 },
  { title: 'E-commerce Platform', value: 9500000, stage: 'Proposal', company: 'Flipkart', contactIdx: 5 },
  { title: 'Brand Identity Package', value: 1200000, stage: 'Lead', company: 'Freshworks', contactIdx: 8 },
  { title: 'Infrastructure Upgrade', value: 5500000, stage: 'Negotiation', company: 'PhonePe', contactIdx: 9 },
  { title: 'ERP Implementation', value: 12000000, stage: 'Closed Lost', company: 'OYO Rooms', contactIdx: 10 },
  { title: 'DevOps Consulting', value: 2800000, stage: 'Closed Won', company: 'Zerodha', contactIdx: 7 },
  { title: 'AI Chatbot Development', value: 4200000, stage: 'Qualified', company: 'BharatPe', contactIdx: 11 },
  { title: 'Retail Dashboard', value: 1800000, stage: 'Proposal', company: 'Reliance Retail', contactIdx: 12 },
  { title: 'API Integration', value: 2200000, stage: 'Lead', company: 'Upstox', contactIdx: 13 },
];

const activities = [
  { type: 'Call', subject: 'Initial outreach', description: 'Discussed website needs and timeline', contactIdx: 0, dealIdx: 0 },
  { type: 'Meeting', subject: 'Requirements workshop', description: 'Met with Rahul and team to scope mobile app', contactIdx: 1, dealIdx: 1 },
  { type: 'Email', subject: 'Cloud migration proposal', description: 'Sent detailed pricing and migration timeline', contactIdx: 2, dealIdx: 2 },
  { type: 'Note', subject: 'Internal memo', description: 'Ananya is very interested, prioritise follow-up', contactIdx: 2, dealIdx: 2 },
  { type: 'Task', subject: 'Schedule demo', description: 'Book calendar for next week with Vikram', contactIdx: 3, dealIdx: 3 },
  { type: 'Email', subject: 'Contract signed', description: 'Deepika confirmed and signed the analytics deal', contactIdx: 4, dealIdx: 4 },
  { type: 'Call', subject: 'Discovery call', description: 'Discussed cybersecurity needs with Neha', contactIdx: 6, dealIdx: 6 },
  { type: 'Meeting', subject: 'Proposal review', description: 'Walked through e-commerce proposal with Arjun', contactIdx: 5, dealIdx: 7 },
  { type: 'Note', subject: 'Budget constraints', description: 'Arjun needs board approval for e-commerce platform', contactIdx: 5, dealIdx: 7 },
  { type: 'Call', subject: 'Creative brief', description: 'Iyer shared brand guidelines and preferences', contactIdx: 8, dealIdx: 8 },
  { type: 'Email', subject: 'Infrastructure quote', description: 'Sent pricing for server upgrade and migration', contactIdx: 9, dealIdx: 9 },
  { type: 'Task', subject: 'Follow up with Amit', description: 'Send revised proposal after feedback', contactIdx: 10, dealIdx: 10 },
  { type: 'Meeting', subject: 'ERP requirements', description: 'Amit outlined integration requirements', contactIdx: 10, dealIdx: 10 },
  { type: 'Email', subject: 'DevOps engagement closed', description: 'Rohit confirmed project kickoff', contactIdx: 7, dealIdx: 11 },
  { type: 'Call', subject: 'AI chatbot discovery', description: 'Discussed chatbot use cases with Sneha', contactIdx: 11, dealIdx: 12 },
  { type: 'Note', subject: 'Technical notes', description: 'Karan has specific API requirements for integration', contactIdx: 13, dealIdx: 14 },
  { type: 'Meeting', subject: 'Retail dashboard goals', description: 'Pooja wants real-time inventory tracking', contactIdx: 12, dealIdx: 13 },
  { type: 'Email', subject: 'Proposal adjustments', description: 'Sent updated proposal with reduced scope for budget', contactIdx: 5, dealIdx: 7 },
  { type: 'Call', subject: 'Check-in call', description: 'Priya happy with website redesign progress', contactIdx: 0, dealIdx: 0 },
  { type: 'Task', subject: 'Prepare quarterly forecast', description: 'Compile pipeline data for quarterly review', contactIdx: null, dealIdx: null },
  { type: 'Meeting', subject: 'Quarterly review', description: 'Presented CRM pipeline to leadership team', contactIdx: null, dealIdx: null },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([Contact.deleteMany({}), Deal.deleteMany({}), Activity.deleteMany({})]);

  const createdContacts = await Contact.insertMany(contacts);
  console.log(`Seeded ${createdContacts.length} contacts`);

  const dealsWithRefs = deals.map((d) => ({
    title: d.title, value: d.value, stage: d.stage, company: d.company,
    contactId: createdContacts[d.contactIdx]._id,
  }));
  const createdDeals = await Deal.insertMany(dealsWithRefs);
  console.log(`Seeded ${createdDeals.length} deals`);

  const activitiesWithRefs = activities.map((a) => ({
    type: a.type, subject: a.subject, description: a.description,
    contactId: a.contactIdx != null ? createdContacts[a.contactIdx]._id : undefined,
    dealId: a.dealIdx != null ? createdDeals[a.dealIdx]._id : undefined,
  }));
  const createdActivities = await Activity.insertMany(activitiesWithRefs);
  console.log(`Seeded ${createdActivities.length} activities`);

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((err) => { console.error(err); process.exit(1); });
