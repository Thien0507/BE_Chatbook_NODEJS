exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res
    .status(err.statusCode)
    .json({ status: "Something  failed", error: err.message });
};
