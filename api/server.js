const express = require('express');
const mongoose = require('mongoose');
const dictionaryRoutes = require('../routes/dictionaryRoutes.js');
const authRoutes = require('../routes/authRoutes.js');
const { connectDB } = require('../config/db.js');
const errorHandler = require('../middleware/errorHandler.js');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Middleware: ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (e) {
        console.error('Database connection error in request:', e);
    }
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Lexify Dictionary API ishlamoqda!', status: 'OK' });
});

app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', require('../routes/progressRoutes.js'));
app.use(errorHandler);

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server ${PORT} portida ishlamoqda`));
    }).catch(err => {
        console.error(err);
        app.listen(PORT, () => console.log(`Server ${PORT} portida (offline DB) ishlamoqda`));
    });
}
