const labelService = require('../services/label.service');

class LabelController {
  async createLabel(req, res) {
    try {
      const { name } = req.body;
      const label = await labelService.createLabel(name, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Label created successfully',
        data: label
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getLabels(req, res) {
    try {
      const labels = await labelService.getLabels(req.user._id);
      res.status(200).json({
        success: true,
        count: labels.length,
        data: labels
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getLabelById(req, res) {
    try {
      const label = await labelService.getLabelById(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        data: label
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateLabel(req, res) {
    try {
      const { name } = req.body;
      const label = await labelService.updateLabel(req.params.id, req.user._id, name);
      res.status(200).json({
        success: true,
        message: 'Label updated successfully',
        data: label
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteLabel(req, res) {
    try {
      const result = await labelService.deleteLabel(req.params.id, req.user._id);
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

  async getNotesByLabel(req, res) {
    try {
      const notes = await labelService.getNotesByLabel(req.params.id, req.user._id);
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
}

module.exports = new LabelController();