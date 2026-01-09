const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateNote } = require('../middleware/validation.middleware');


router.use(protect);


router.post('/', validateNote, noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/archived', noteController.getArchivedNotes);
router.get('/pinned', noteController.getPinnedNotes);
router.get('/shared', noteController.getSharedNotes);
router.get('/search', noteController.searchNotes);
router.get('/trash', noteController.getTrashedNotes);
router.get('/label/:labelId', noteController.getNotesByLabel);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.delete('/:id/permanent', noteController.permanentDeleteNote);
router.post('/:id/restore', noteController.restoreNote);
router.put('/:id/archive', noteController.archiveNote);


router.post('/:id/labels', noteController.addLabel);
router.delete('/:id/labels/:labelId', noteController.removeLabel);

router.post('/:id/collaborators', noteController.addCollaborator);
router.delete('/:id/collaborators/:collaboratorId', noteController.removeCollaborator);

module.exports = router;