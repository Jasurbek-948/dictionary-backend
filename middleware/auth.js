const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Admin = require('../models/Admin.js');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'Token topilmadi' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user;
        if (decoded.role === 'user') {
            user = await User.findById(decoded._id);
        } else if (decoded.role === 'admin') {
            user = await Admin.findById(decoded._id);
        }
        if (!user) return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
        req.user = { _id: user._id, role: decoded.role };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Noto\'g\'ri token' });
    }
};

const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Faqat adminlar uchun' });
    }
    next();
};

module.exports = { auth, admin };