const noteService = require('../services/note.service');

class NoteController {
  async createNote(req, res) {
    try {
      const note = await noteService.createNote(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: note
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getNotes(req, res) {
    try {
      const filters = {
        isArchived: req.query.isArchived === 'true',
        isPinned: req.query.isPinned === 'true'
      };
      const notes = await noteService.getNotes(req.user._id, filters);
      res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getNoteById(req, res) {
    try {
      const note = await noteService.getNoteById(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateNote(req, res) {
    try {
      const note = await noteService.updateNote(req.params.id, req.user._id, req.body);
      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: note
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteNote(req, res) {
    try {
      const result = await noteService.deleteNote(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async permanentDeleteNote(req, res) {
    try {
      const result = await noteService.permanentDeleteNote(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTrashedNotes(req, res) {
    try {
      const notes = await noteService.getTrashedNotes(req.user._id);
      res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async restoreNote(req, res) {
    try {
      const note = await noteService.restoreNote(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        message: 'Note restored successfully',
        data: note
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async addLabel(req, res) {
    try {
      const { labelId } = req.body;
      const note = await noteService.addLabelToNote(req.params.id, labelId, req.user._id);
      res.status(200).json({
        success: true,
        message: 'Label added to note',
        data: note
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async removeLabel(req, res) {
    try {
      const { labelId } = req.params;
      const note = await noteService.removeLabelFromNote(req.params.id, labelId, req.user._id);
      res.status(200).json({
        success: true,
        message: 'Label removed from note',
        data: note
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new NoteController();