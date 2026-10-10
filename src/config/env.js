const path = require('node:path');
require('dotenv').config();

const storage = process.env.SQLITE_STORAGE || './data/notes.sqlite';

module.exports = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sqliteStorage: path.resolve(process.cwd(), storage),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info'
};
