const mongoose = require('mongoose');

const IdiomSchema = new mongoose.Schema({
    phrase: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
});

const PhrasalVerbSchema = new mongoose.Schema({
    phrase: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
});

const DictionarySchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true, lowercase: true, trim: true },
    translation: { type: String, required: true, trim: true },
    partOfSpeech: {
        type: String,
        required: true,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'interjection', 'other'],
    },
    level: { type: String, required: true, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    pronunciation: { type: String, required: true, trim: true },
    examples: {
        type: [String],
        required: true,
        validate: { validator: (v) => v.length > 0, message: 'Kamida bitta misol kerak' },
    },
    synonyms: { type: [String], default: [] },
    antonyms: { type: [String], default: [] },
    definition: { type: String, required: true, trim: true },
    idioms: { type: [IdiomSchema], default: [] },
    phrasalVerbs: { type: [PhrasalVerbSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'createdByModel', required: true },
    createdByModel: { type: String, required: true, enum: ['User', 'Admin'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

DictionarySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Dictionary', DictionarySchema);