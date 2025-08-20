const Dictionary = require('../models/Dictionary.js');
const mongoose = require('mongoose');

const getAllWords = async () => {
    return Dictionary.find().lean();
};

const addWord = async (data) => {
    const word = new Dictionary(data);
    return word.save();
};

const updateWord = async (id, data, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Noto\'g\'ri ID formati');
    }
    return Dictionary.findByIdAndUpdate(
        id,
        { $set: { ...data, updatedAt: Date.now() } },
        { new: true }
    );
};

const deleteWord = async (id, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Noto\'g\'ri ID formati');
    }
    return Dictionary.findByIdAndDelete(id);
};

module.exports = { getAllWords, addWord, updateWord, deleteWord };