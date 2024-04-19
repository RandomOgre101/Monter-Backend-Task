const responseHandler = (res) => ({
  success: (statusCode, message, data) =>
    res.status(statusCode).json({
      message,
      status: "success",
      code: statusCode,
      data,
    }),

  error: (statusCode, error) => {
    return res.status(statusCode).json({
      message: error?.message || error,
      error: true,
      status: "error",
      code: statusCode,
    });
  },
});

module.exports = { responseHandler };
