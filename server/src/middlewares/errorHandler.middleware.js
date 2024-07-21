const errorHandler = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join()
    : err.message;

  res.status(err.statusCode).json({
    Sucess: false,
    message: errorMessage ? errorMessage : err.message,
  });
};

module.exports = errorHandler;
