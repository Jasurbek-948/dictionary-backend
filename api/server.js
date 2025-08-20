const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const dictionaryRoutes = require('../routes/dictionaryRoutes.js');
const authRoutes = require('../routes/authRoutes.js');
const { connectDB } = require('../config/db.js');
const errorHandler = require('../middleware/errorHandler.js');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', require('../routes/progressRoutes.js'));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server ${PORT} portida ishlamoqda`));
}); 