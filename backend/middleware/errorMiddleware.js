export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  // ✅ If res.status was set before calling next(error), use it. Otherwise 500.
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // ✅ Handle Mongoose-specific errors
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    res.status(400);
    message = `Invalid ID: ${err.value}`;
  }

  if (err.code === 11000) {
    res.status(400);
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
  }

  if (err.name === "ValidationError") {
    res.status(400);
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(res.statusCode !== 200 ? res.statusCode : statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}