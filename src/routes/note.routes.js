const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateNote } = require('../middleware/validation.middleware');


router.use(protect);


router.post('/', validateNote, noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/trash', noteController.getTrashedNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.delete('/:id/permanent', noteController.permanentDeleteNote);
router.post('/:id/restore', noteController.restoreNote);


router.post('/:id/labels', noteController.addLabel);
router.delete('/:id/labels/:labelId', noteController.removeLabel);

module.exports = router;