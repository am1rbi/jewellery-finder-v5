const mongoose = require('mongoose');

const FunnelSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  lowerBound: { type: Number, required: true },
  upperBound: { type: Number, required: true },
  dueDate: { type: String, required: true },
  specificDate: { type: String },
  uploadedImages: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
}, { collection: 'funnels' });

module.exports = mongoose.model('Funnel', FunnelSchema);