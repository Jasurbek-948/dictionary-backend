const Joi = require('joi');

// So‘z ma‘lumotlari uchun validatsiya sxemasi
const wordSchema = Joi.object({
    word: Joi.string().required().messages({ 'string.empty': 'So‘z kiritilishi kerak' }),
    translation: Joi.string().required().messages({ 'string.empty': 'Tarjima kiritilishi kerak' }),
    partOfSpeech: Joi.string()
        .valid('noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'interjection', 'other')
        .required()
        .messages({ 'any.only': 'Noto‘g‘ri so‘z turkumi' }),
    level: Joi.string()
        .valid('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
        .required()
        .messages({ 'any.only': 'Noto‘g‘ri daraja' }),
    pronunciation: Joi.string().required().messages({ 'string.empty': 'Talaffuz kiritilishi kerak' }),
    examples: Joi.array().items(Joi.string()).min(1).required().messages({ 'array.min': 'Kamida bitta misol kerak' }),
    synonyms: Joi.array().items(Joi.string()).default([]),
    antonyms: Joi.array().items(Joi.string()).default([]),
    definition: Joi.string().required().messages({ 'string.empty': 'Ta‘rif kiritilishi kerak' }),
    idioms: Joi.array()
        .items(Joi.object({
            phrase: Joi.string().required(),
            meaning: Joi.string().required(),
        }))
        .default([]),
    phrasalVerbs: Joi.array()
        .items(Joi.object({
            phrase: Joi.string().required(),
            meaning: Joi.string().required(),
        }))
        .default([]),
});

// Foydalanuvchi ma‘lumotlari uchun validatsiya sxemasi
const userSchema = Joi.object({
    username: Joi.string().min(3).required().messages({ 'string.min': 'Foydalanuvchi nomi kamida 3 belgi bo‘lishi kerak' }),
    email: Joi.string().email().when('$isRegister', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }).messages({ 'string.email': 'Noto‘g‘ri email formati' }),
    password: Joi.string().min(6).required().messages({ 'string.min': 'Parol kamida 6 belgi bo‘lishi kerak' }),
});

// Admin ma‘lumotlari uchun validatsiya sxemasi
const adminSchema = Joi.object({
    username: Joi.string().min(3).required().messages({ 'string.min': 'Foydalanuvchi nomi kamida 3 belgi bo‘lishi kerak' }),
    password: Joi.string().min(6).required().messages({ 'string.min': 'Parol kamida 6 belgi bo‘lishi kerak' }),
});

// So‘z ma‘lumotlarini tekshirish
const validateWord = (req, res, next) => {
    const { error } = wordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

// Foydalanuvchi ma‘lumotlarini tekshirish (ro‘yxatdan o‘tish yoki kirish)
const validateUser = (req, res, next) => {
    const isRegister = req.path.includes('register');
    const { error } = userSchema.validate(req.body, { context: { isRegister } });
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

// Admin ma‘lumotlarini tekshirish
const validateAdmin = (req, res, next) => {
    const { error } = adminSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

// Profil rasmi yuklashni tekshirish
const validateImageUpload = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Rasim fayli yuklanmadi' });
    }
    next();
};

module.exports = { validateWord, validateUser, validateAdmin, validateImageUpload };