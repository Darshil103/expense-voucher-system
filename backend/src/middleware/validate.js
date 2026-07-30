const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    const err = new AppError('Validation failed', 422);
    err.errors = formatted;
    return res.status(422).json({ success: false, message: 'Validation failed', errors: formatted });
  }
  next();
}

module.exports = validate;
