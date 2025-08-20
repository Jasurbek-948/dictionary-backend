const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController.js');
const { auth, admin } = require('../middleware/auth.js');
const { validateWord } = require('../middleware/validate.js');

router.get('/all', dictionaryController.getAllWords);
router.post('/', auth, admin, validateWord, dictionaryController.addWord);
router.put('/:id', auth, admin, validateWord, dictionaryController.updateWord);
router.delete('/:id', auth, admin, dictionaryController.deleteWord);

module.exports = router;