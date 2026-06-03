const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        error: message,
    });
};

module.exports = errorHandler; 