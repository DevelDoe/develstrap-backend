const jwt = require('jsonwebtoken');
const config = require('./config');
const { verboseLog } = require('./utils/logger');

// JWT Verification Middleware
/*
 * Middleware to verify JWT tokens.
 * Extracts the token from the headers and verifies it using the secret key.
 *
 * @param req {object} - Incoming request.
 * @param res {object} - Response object to send results back.
 * @param next {function} - Callback to pass control to the next middleware.
 */
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        verboseLog('[AUTH] No token provided');
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
        if (err) {
            verboseLog('[AUTH] Failed to authenticate token');
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        // Save user info to request object for later use
        req.user = decoded;
        next();
    });
}

module.exports = { verifyToken };