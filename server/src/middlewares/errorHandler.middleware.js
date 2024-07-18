const errorHandler = (err, req, res, next) => {
  console.log(err);
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join()
    : err.message;

  res.status(err.statusCode).json({ Sucess: false, message: errorMessage });
};

module.exports = errorHandler;
