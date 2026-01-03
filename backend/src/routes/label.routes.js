const express = require('express');
const router = express.Router();
const labelController = require('../controllers/label.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateLabel } = require('../middleware/validation.middleware');


router.use(protect);


router.post('/', validateLabel, labelController.createLabel);
router.get('/', labelController.getLabels);
router.get('/:id', labelController.getLabelById);
router.put('/:id', validateLabel, labelController.updateLabel);
router.delete('/:id', labelController.deleteLabel);


router.get('/:id/notes', labelController.getNotesByLabel);

module.exports = router;