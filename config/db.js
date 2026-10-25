const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('MONGO_URI topilmadi .env faylida');
            return;
        }
        const db = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB ulandi');
    } catch (error) {
        console.error('MongoDB ulanish xatosi:', error.message);
    }
};

module.exports = { connectDB };
