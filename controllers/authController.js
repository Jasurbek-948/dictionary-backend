const User = require('../models/User.js');
const Admin = require('../models/Admin.js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer sozlamalari: rasimlarni uploads papkasida saqlash
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Faqat JPEG, JPG, PNG yoki WEBP rasmlar ruxsat etiladi'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cheklov
}).single('profileImage');

// JWT autentifikatsiyasi middleware
const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Autentifikatsiya talab qilinadi' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Noto‘g‘ri token' });
    }
};

// Foydalanuvchi ro‘yxatdan o‘tishi
const userRegister = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Foydalanuvchi nomi yoki email allaqachon mavjud' });
        }
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'Foydalanuvchi ro‘yxatdan o‘tdi' });
    } catch (error) {
        next(error);
    }
};

// Foydalanuvchi tizimga kirishi
const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Noto‘g‘ri foydalanuvchi nomi yoki parol' });
        }
        const token = jwt.sign({ _id: user._id, role: 'user' }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        // Foydalanuvchi ma‘lumotlari bilan javob qaytarish
        res.json({
            token,
            role: 'user',
            username: user.username,
            profileImage: user.profileImage,
        });
    } catch (error) {
        next(error);
    }
};

// Admin ro‘yxatdan o‘tishi
const adminRegister = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin nomi allaqachon mavjud' });
        }
        const admin = new Admin({ username, password });
        await admin.save(); // 'user.save()' o‘rniga 'admin.save()'
        res.status(201).json({ message: 'Admin ro‘yxatdan o‘tdi' });
    } catch (error) {
        next(error);
    }
};

// Admin tizimga kirishi
const adminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Noto‘g‘ri admin nomi yoki parol' });
        }
        const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.json({ token, role: 'admin' });
    } catch (error) {
        next(error);
    }
};

// Profil rasmini yuklash
const uploadProfileImage = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Rasim yuklashda xato' });
        }
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
            }
            // Eski rasimni o‘chirish (agar mavjud bo‘lsa)
            if (user.profileImage) {
                const oldImagePath = path.join(process.cwd(), user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Yangi rasim URL manzilini saqlash
            user.profileImage = `/uploads/${req.file.filename}`;
            await user.save();
            res.json({ message: 'Profil rasmi muvaffaqiyatli yuklandi', profileImage: user.profileImage });
        } catch (error) {
            next(error);
        }
    });
};

module.exports = { userRegister, userLogin, adminRegister, adminLogin, uploadProfileImage, authenticateJWT };