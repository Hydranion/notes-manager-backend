const { UniqueConstraintError, ForeignKeyConstraintError, ValidationError } = require('sequelize');
const logger = require('../config/logger');
const env = require('../config/env');

module.exports = function errorHandler(error, req, res, _next) {
  let status = error.status || 500;
  let message = error.message || 'Internal server error';
  let details = error.details;

  if (error instanceof UniqueConstraintError) {
    status = 409;
    message = 'A record with this value already exists';
  } else if (error instanceof ForeignKeyConstraintError) {
    status = 400;
    message = 'A referenced record does not exist';
  } else if (error instanceof ValidationError) {
    status = 400;
    message = 'Database validation failed';
    details = error.errors.map(({ path, message: reason }) => ({ field: path, message: reason }));
  }

  logger.error({ err: error, method: req.method, url: req.originalUrl, status }, 'Request failed');
  res.status(status).json({
    error: {
      message: status === 500 && env.nodeEnv === 'production' ? 'Internal server error' : message,
      ...(details ? { details } : {})
    }
  });
};
