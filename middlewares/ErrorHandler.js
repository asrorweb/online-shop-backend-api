// ErrorHandler.js
const ErrorHandler = (error, req, res, next) => {
  const errorStatus = error.statusCode || 500;
  const errMsg = error.message || "Something went wrong";
  console.log("Middleware Error Hadnling", error);
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? error.stack : {},
  });
};

export default ErrorHandler;
