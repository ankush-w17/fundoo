const Note = require('../models/note.model');

class NoteService {
  async createNote(noteData, userId) {
    const note = await Note.create({
      ...noteData,
      userId
    });

    return await note.populate('labels');
  }

  async getNotes(userId, filters = {}) {
    const query = { userId, isTrashed: false };

    if (filters.isArchived !== undefined) {
      query.isArchived = filters.isArchived;
    }

    if (filters.isPinned !== undefined) {
      query.isPinned = filters.isPinned;
    }

    const notes = await Note.find(query)
      .populate('labels')
      .sort({ isPinned: -1, updatedAt: -1 });

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

    return await note.populate('labels');
  }

  async deleteNote(noteId, userId) {
    const note = await Note.findOne({ _id: noteId, userId });
    
    if (!note) {
      throw new Error('Note not found');
    }

    note.isTrashed = true;
    await note.save();

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
}

module.exports = new NoteService();