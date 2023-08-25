const createError = require('http-errors');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    // If response headers are already sent, let Express handle the error
    return next(err);
  }

  if (err instanceof createError.HttpError) {
    // Known http-errors (like 404, 401, 400, etc.)
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid Id',
      message: err.message
    })
  }
  if (err.code === 11000) {
    // MongoDB duplicate key error
    return res.status(409).json({
      error: 'Conflict',
      message: 'Username or email already in use'
    });
  }

  //joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.details[0].message
    });
  }

  // Default error handler for uncaught errors
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
