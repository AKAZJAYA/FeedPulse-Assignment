const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// --------------- Global Middleware ---------------
app.use(helmet());                 // Security headers
app.use(cors());                   // Cross-origin requests
app.use(morgan('dev'));            // HTTP request logger
app.use(express.json());          // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// --------------- Health Check ---------------
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

// --------------- API Routes ---------------
app.use('/api', routes);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
