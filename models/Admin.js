const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Foydalanuvchi nomi kiritilishi kerak'],
        unique: true,
        trim: true,
        minlength: [3, 'Foydalanuvchi nomi kamida 3 belgi bo\'lishi kerak'],
    },
    password: {
        type: String,
        required: [true, 'Parol kiritilishi kerak'],
        minlength: [6, 'Parol kamida 6 belgi bo\'lishi kerak'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

AdminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);