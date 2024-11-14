
const APIError = require('../errors/ErrorAPI');  // Import your custom APIError class

const errorHandler = (err, req, res, next) => {
    // If the error is an instance of your APIError class, send the specific status code and message
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            error: err.message,  // Send the error message
        });
    }

    // For any unexpected errors, return a generic server error
    return res.status(500).json({
        error: 'Internal server error',  // Fallback for unexpected errors
    });
};


module.exports = errorHandler;
