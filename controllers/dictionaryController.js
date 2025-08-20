const Dictionary = require('../models/Dictionary.js');
const dictionaryService = require('../services/dictionaryService.js');

const getAllWords = async (req, res, next) => {
    try {
        const words = await dictionaryService.getAllWords();
        res.json(words);
    } catch (error) {
        next(error);
    }
};

const addWord = async (req, res, next) => {
    try {
        const word = await dictionaryService.addWord({
            ...req.body,
            createdBy: req.user._id,
            createdByModel: req.user.role === 'admin' ? 'Admin' : 'User',
        });
        res.status(201).json(word);
    } catch (error) {
        next(error);
    }
};

const updateWord = async (req, res, next) => {
    try {
        const word = await dictionaryService.updateWord(req.params.id, req.body, req.user);
        if (!word) return res.status(404).json({ message: "So'z topilmadi" });
        res.json(word);
    } catch (error) {
        next(error);
    }
};

const deleteWord = async (req, res, next) => {
    try {
        const word = await dictionaryService.deleteWord(req.params.id, req.user);
        if (!word) return res.status(404).json({ message: "So'z topilmadi" });
        res.json({ message: "So'z o'chirildi" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllWords, addWord, updateWord, deleteWord };