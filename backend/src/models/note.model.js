const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Note description is required']
  },
  color: {
    type: String,
    default: '#FFFFFF'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isTrashed: {
    type: Boolean,
    default: false
  },
  reminder: {
    type: Date,
    default: null
  },
  checklist: [{
    text: { type: String, required: true },
    isDone: { type: Boolean, default: false }
  }],
  position: {
    type: Number,
    default: 0
  },
  labels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Label'
  }],
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

noteSchema.index({ userId: 1, isTrashed: 1 });
noteSchema.index({ title: 'text' });
noteSchema.index({ labels: 1 });
noteSchema.index({ collaborators: 1 });

module.exports = mongoose.model('Note', noteSchema);
