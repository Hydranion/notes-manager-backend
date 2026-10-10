const HttpError = require('../errors/HttpError');

module.exports = function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
