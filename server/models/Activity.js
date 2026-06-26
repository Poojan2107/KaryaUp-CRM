const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: { type: String, enum: ['Call', 'Email', 'Meeting', 'Note', 'Task'], default: 'Note' },
  subject: { type: String, required: true },
  description: String,
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', default: null },
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', default: null },
  dueDate: Date,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
