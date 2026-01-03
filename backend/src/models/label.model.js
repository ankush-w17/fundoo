const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Label name is required'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

labelSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Label', labelSchema);