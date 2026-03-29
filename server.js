const dotenv = require('dotenv');

// Load environment variables BEFORE anything else
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(config.port, () => {
      console.log(
        `🚀 Server running in ${config.env} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
