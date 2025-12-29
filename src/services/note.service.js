const Note = require('../models/note.model');
const cacheService = require('./cache.service');

class NoteService {
  async createNote(noteData, userId) {
    const note = await Note.create({
      ...noteData,
      userId
    });

    await cacheService.deletePattern(`notes:${userId}*`);

    return await note.populate('labels');
  }

  async getNotes(userId, filters = {}) {
    const cacheKey = cacheService.generateKey('notes', userId, JSON.stringify(filters));
    
    const cachedNotes = await cacheService.get(cacheKey);
    if (cachedNotes) {
      return cachedNotes;
    }

    const query = { userId, isTrashed: false };

    if (filters.isArchived !== undefined) {
      query.isArchived = filters.isArchived;
    }

    if (filters.isPinned !== undefined) {
      query.isPinned = filters.isPinned;
    }

    const notes = await Note.find(query)
      .populate('labels')
      .sort({ isPinned: -1, updatedAt: -1 })
      .limit(20);

    await cacheService.set(cacheKey, notes);

    return notes;
  }

  async getNoteById(noteId, userId) {
    const note = await Note.findOne({ _id: noteId, userId }).populate('labels');
    
    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }

  async updateNote(noteId, userId, updateData) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    Object.assign(note, updateData);
    await note.save();

    await cacheService.deletePattern(`notes:${userId}*`);

    return await note.populate('labels');
  }

  async deleteNote(noteId, userId) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    note.isTrashed = true;
    await note.save();

    await cacheService.deletePattern(`notes:${userId}*`);

    return { message: 'Note moved to trash' };
  }

  async permanentDeleteNote(noteId, userId) {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    return { message: 'Note permanently deleted' };
  }

  async getTrashedNotes(userId) {
    return await Note.find({ userId, isTrashed: true })
      .populate('labels')
      .sort({ updatedAt: -1 });
  }

  async restoreNote(noteId, userId) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    note.isTrashed = false;
    await note.save();

    return await note.populate('labels');
  }

  async addLabelToNote(noteId, labelId, userId) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    if (!note.labels.includes(labelId)) {
      note.labels.push(labelId);
      await note.save();
    }

    return await note.populate('labels');
  }

  async removeLabelFromNote(noteId, labelId, userId) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    note.labels = note.labels.filter(id => id.toString() !== labelId.toString());
    await note.save();

    return await note.populate('labels');
  }

  async getArchivedNotes(userId) {
    const cacheKey = cacheService.generateKey('notes', userId, 'archived');
    
    const cachedNotes = await cacheService.get(cacheKey);
    if (cachedNotes) {
      return cachedNotes;
    }

    const notes = await Note.find({ userId, isArchived: true, isTrashed: false })
      .populate('labels')
      .sort({ updatedAt: -1 })
      .limit(20);

    await cacheService.set(cacheKey, notes);

    return notes;
  }

  async getPinnedNotes(userId) {
    const cacheKey = cacheService.generateKey('notes', userId, 'pinned');
    
    const cachedNotes = await cacheService.get(cacheKey);
    if (cachedNotes) {
      return cachedNotes;
    }

    const notes = await Note.find({ userId, isPinned: true, isTrashed: false })
      .populate('labels')
      .sort({ updatedAt: -1 })
      .limit(20);

    await cacheService.set(cacheKey, notes);

    return notes;
  }

  async getNotesByLabel(userId, labelId) {
    const cacheKey = cacheService.generateKey('notes', userId, `label:${labelId}`);
    
    const cachedNotes = await cacheService.get(cacheKey);
    if (cachedNotes) {
      return cachedNotes;
    }

    const notes = await Note.find({ userId, labels: labelId, isTrashed: false })
      .populate('labels')
      .sort({ isPinned: -1, updatedAt: -1 })
      .limit(20);

    await cacheService.set(cacheKey, notes);

    return notes;
  }

  async searchNotes(userId, query) {
    const Label = require('../models/label.model');
    
    const labels = await Label.find({
      userId,
      name: { $regex: query, $options: 'i' }
    }).select('_id');

    const labelIds = labels.map(label => label._id);

    const notes = await Note.find({
      userId,
      isTrashed: false,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { labels: { $in: labelIds } }
      ]
    })
      .populate('labels')
      .sort({ isPinned: -1, updatedAt: -1 });

    return notes;
  }

  async addCollaborator(noteId, userId, collaboratorEmail) {
    const User = require('../models/user.model');
    
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    const collaborator = await User.findOne({ email: collaboratorEmail });
    
    if (!collaborator) {
      throw new Error('User not found with this email');
    }

    if (collaborator._id.toString() === userId.toString()) {
      throw new Error('Cannot add yourself as collaborator');
    }

    if (note.collaborators.some(id => id.toString() === collaborator._id.toString())) {
      throw new Error('User is already a collaborator');
    }

    note.collaborators.push(collaborator._id);
    await note.save();

    await cacheService.deletePattern(`notes:${userId}*`);
    await cacheService.deletePattern(`notes:${collaborator._id}*`);

    return { note: await note.populate(['labels', 'collaborators']), collaborator };
  }

  async removeCollaborator(noteId, userId, collaboratorId) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    note.collaborators = note.collaborators.filter(
      id => id.toString() !== collaboratorId.toString()
    );
    await note.save();

    await cacheService.deletePattern(`notes:${userId}*`);
    await cacheService.deletePattern(`notes:${collaboratorId}*`);

    return await note.populate(['labels', 'collaborators']);
  }

  async getSharedNotes(userId) {
    const cacheKey = cacheService.generateKey('notes', userId, 'shared');
    
    const cachedNotes = await cacheService.get(cacheKey);
    if (cachedNotes) {
      return cachedNotes;
    }

    const notes = await Note.find({ collaborators: userId, isTrashed: false })
      .populate(['labels', 'userId', 'collaborators'])
      .sort({ updatedAt: -1 })
      .limit(20);

    await cacheService.set(cacheKey, notes);

    return notes;
  }
}

module.exports = new NoteService();