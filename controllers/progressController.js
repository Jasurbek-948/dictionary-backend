const User = require('../models/User.js');

// Foydalanuvchi progressini yangilash
const updateProgress = async (req, res, next) => {
    try {
        const { topic, correctAnswers } = req.body;
        const userId = req.user._id;

        if (!topic || correctAnswers === undefined) {
            return res.status(400).json({ message: 'Topic va to‘g‘ri javoblar soni kiritilishi kerak' });
        }

        if (correctAnswers < 0 || correctAnswers > 30) {
            return res.status(400).json({ message: 'To‘g‘ri javoblar soni 0 dan 30 gacha bo‘lishi kerak' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        await user.updateTopicProgress(topic, correctAnswers);
        res.json({
            message: 'Progress muvaffaqiyatli yangilandi',
            completedTopics: user.getCompletedTopics(),
            topicProgress: user.topicProgress.find((progress) => progress.topic === topic),
        });
    } catch (error) {
        next(error);
    }
};

// Foydalanuvchi progressini olish
const getProgress = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('topicProgress');
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.json({
            message: 'Progress muvaffaqiyatli olindi',
            topicProgress: user.topicProgress,
            completedTopics: user.getCompletedTopics(),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { updateProgress, getProgress };