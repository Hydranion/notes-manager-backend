const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const env = require('./config/env');
const logger = require('./config/logger');
const notesRoutes = require('./routes/notes');
const categoriesRoutes = require('./routes/categories');
const tagsRoutes = require('./routes/tags');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp(container) {
  const app = express();
  app.disable('x-powered-by');
  const allowedOrigins = env.corsOrigin === '*' ? null : env.corsOrigin.split(',').map((item) => item.trim());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins || allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    }
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
  app.use((req, _res, next) => {
    req.container = container.cradle;
    next();
  });

  const openapiPath = path.join(__dirname, '../docs/openapi.yaml');
  const openapi = yaml.parse(fs.readFileSync(openapiPath, 'utf8'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
  app.use('/api/notes', notesRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/tags', tagsRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
