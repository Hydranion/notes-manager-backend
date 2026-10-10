const pino = require('pino');
const env = require('./env');

module.exports = pino({
  level: env.logLevel,
  base: { service: 'notes-manager-api' },
  redact: ['req.headers.authorization', 'password']
});
