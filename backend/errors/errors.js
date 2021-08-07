const syncError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

const asyncError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

module.exports = { syncError, asyncError };
