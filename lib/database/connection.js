// connection.js

const mongoose = require('mongoose');
const config = require('./config'); // aapke config file me MONGO_URI hoga

// MongoDB connection URI
const mongoURI = config.MONGO_URI || 'mongodb://127.0.0.1:27017/bilal-md'; // agar env variable nahi hai toh local use hoga

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // agar connection fail hua toh bot band ho jaaye
});

// Optional: handle disconnected events
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected!');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});

module.exports = mongoose;
