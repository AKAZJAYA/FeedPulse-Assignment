const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/feedpulse',
};

module.exports = config;
