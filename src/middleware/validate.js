const { validationResult } = require('express-validator');
const HttpError = require('../errors/HttpError');

function validate(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new HttpError(400, 'Input validation failed', result.array()));
  }
  next();
}

module.exports = validate;
