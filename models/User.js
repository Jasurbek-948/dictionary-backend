const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Foydalanuvchi nomi kiritilishi kerak'],
        unique: true,
        trim: true,
        minlength: [3, 'Foydalanuvchi nomi kamida 3 belgi bo\'lishi kerak'],
    },
    email: {
        type: String,
        required: [true, 'Email kiritilishi kerak'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Iltimos, to\'g\'ri email kiriting'],
    },
    password: {
        type: String,
        required: [true, 'Parol kiritilishi kerak'],
        minlength: [6, 'Parol kamida 6 belgi bo\'lishi kerak'],
    },
    profileImage: {
        type: String,
        default: null, // Agar rasim yuklanmagan bo‘lsa, null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    topicProgress: [{
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        correctAnswers: {
            type: Number,
            default: 0,
        },
        totalQuestions: {
            type: Number,
            default: 30, // Har bir topicda 30 ta savol bor deb faraz qilamiz
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        lastAttempted: {
            type: Date,
            default: null,
        },
    }],
});

UserSchema.pre('save', async function (next) {
    // Hash password if it is modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 15);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Method to update topic progress
UserSchema.methods.updateTopicProgress = async function (topic, correctAnswers) {
    const topicProgress = this.topicProgress.find((progress) => progress.topic === topic);
    const totalQuestions = 30; // Har bir topicda 30 ta savol
    const completionThreshold = totalQuestions * 0.6; // 60% threshold (18 correct answers)

    if (topicProgress) {
        // Update existing topic progress
        topicProgress.correctAnswers = correctAnswers;
        topicProgress.isCompleted = correctAnswers >= completionThreshold;
        topicProgress.lastAttempted = new Date();
    } else {
        // Add new topic progress
        this.topicProgress.push({
            topic,
            correctAnswers,
            totalQuestions,
            isCompleted: correctAnswers >= completionThreshold,
            lastAttempted: new Date(),
        });
    }

    await this.save();
};

// Method to get completed topics
UserSchema.methods.getCompletedTopics = function () {
    return this.topicProgress.filter((progress) => progress.isCompleted).map((progress) => progress.topic);
};

module.exports = mongoose.model('User', UserSchema);