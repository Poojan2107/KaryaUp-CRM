const mongoose = require('mongoose');

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, default: 0 },
  stage: { type: String, enum: STAGES, default: 'Lead' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', default: null },
  company: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

dealSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Deal', dealSchema);
module.exports.STAGES = STAGES;
