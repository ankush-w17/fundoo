const Label = require('../models/label.model');
const Note = require('../models/note.model');

class LabelService {
  async createLabel(name, userId) {
    const existingLabel = await Label.findOne({ name, userId });
    
    if (existingLabel) {
      throw new Error('Label already exists');
    }

    const label = await Label.create({ name, userId });
    return label;
  }

  async getLabels(userId) {
    return await Label.find({ userId }).sort({ name: 1 });
  }

  async getLabelById(labelId, userId) {
    const label = await Label.findOne({ _id: labelId, userId });
    
    if (!label) {
      throw new Error('Label not found');
    }

    return label;
  }

  async updateLabel(labelId, userId, name) {
    const label = await Label.findOne({ _id: labelId, userId });
    
    if (!label) {
      throw new Error('Label not found');
    }

    const existingLabel = await Label.findOne({ 
      name, 
      userId, 
      _id: { $ne: labelId } 
    });
    
    if (existingLabel) {
      throw new Error('Label with this name already exists');
    }

    label.name = name;
    await label.save();

    return label;
  }

  async deleteLabel(labelId, userId) {
    const label = await Label.findOneAndDelete({ _id: labelId, userId });
    
    if (!label) {
      throw new Error('Label not found');
    }

    await Note.updateMany(
      { userId, labels: labelId },
      { $pull: { labels: labelId } }
    );

    return { message: 'Label deleted successfully' };
  }

  async getNotesByLabel(labelId, userId) {
    const label = await Label.findOne({ _id: labelId, userId });
    
    if (!label) {
      throw new Error('Label not found');
    }

    return await Note.find({ 
      userId, 
      labels: labelId, 
      isTrashed: false 
    }).populate('labels').sort({ updatedAt: -1 });
  }
}

module.exports = new LabelService();