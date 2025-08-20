const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB ulandi');
    } catch (error) {
        console.error('MongoDB ulanish xatosi:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };