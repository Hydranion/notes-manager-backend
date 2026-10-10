const fs = require('node:fs');
const path = require('node:path');
const { Sequelize } = require('sequelize');
const env = require('../config/env');

fs.mkdirSync(path.dirname(env.sqliteStorage), { recursive: true });

module.exports = new Sequelize({
  dialect: 'sqlite',
  storage: env.sqliteStorage,
  logging: false,
  define: { underscored: false }
});
