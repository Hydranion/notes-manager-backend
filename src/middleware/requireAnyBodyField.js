const HttpError = require('../errors/HttpError');

module.exports = (...fields) => (req, _res, next) => {
  if (!fields.some((field) => Object.hasOwn(req.body || {}, field))) {
    return next(new HttpError(400, `Provide at least one of these fields: ${fields.join(', ')}`));
  }
  next();
};
