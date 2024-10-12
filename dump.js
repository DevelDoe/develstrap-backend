const cors = require('cors'),
      config = require('./config'),
      passport = require('passport'),
      jwt = require('jwt-simple'),
      morgan = require('morgan'),
      User = require('./models/user'),
      { verboseLog } = require('./utils/logger')

require('./passport')(passport); // Load passport strategies here

// Module exports function to set up middleware for the API
module.exports = function(api) {
    // Middleware setup
    api.use(morgan('dev')) // Logger
    api.use(cors()) // CORS middleware
    api.use(passport.initialize()) // Passport middleware

    // Passport JWT strategy setup
    api.use(passport.initialize()); // Initialize Passport
    api.use(authenticate); // Use custom authentication middleware after initializing passport

    // Custom authentication middleware
    api.use(authenticate)
}

// Custom Authentication Middleware
function authenticate(req, res, next) {
    // Skip authentication for public and uploads routes
    if (/(uploads)|(public)/.test(req.originalUrl)) {
        verboseLog('[AUTH] Passing control to next middleware');
        return next();
    } else {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                verboseLog(`[AUTH] Server error during passport authentication: ${err}`);
                return res.status(500).json({ err: 'Server error: ' + err });
            }

            if (!user) {
                verboseLog('[AUTH] User not authenticated - Token issue or user not found');
                return res.status(401).json({ message: 'Not authenticated' });
            }

            // Check for token in the request headers
            const token = getToken(req.headers);
            if (!token) {
                verboseLog('[AUTH] Token not found - sending 403');
                return res.sendStatus(403);
            }

            let decodedJWT;
            try {
                // Decode token with the secret key
                decodedJWT = jwt.decode(token, config.secret);
                verboseLog(`[AUTH] Token decoded successfully for email: ${decodedJWT.email}`);
            } catch (err) {
                verboseLog('[AUTH] Error decoding token: ' + err);
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Find user in the database based on the decoded JWT 'email'
            User.findOne({ email: decodedJWT.email }, (err, user) => {
                if (err) {
                    verboseLog('[AUTH] Error finding user in database: ' + err);
                    return res.status(500).json({ err: 'Server error' });
                }

                if (!user) {
                    verboseLog(`[AUTH] User with email ${decodedJWT.email} not found in database`);
                    return res.status(401).json({ message: 'Not authenticated' });
                } else {
                    verboseLog(`[AUTH] User with email ${decodedJWT.email} authenticated successfully`);
                    req.user = user; // Attach the user to the request object for further use
                    return next();
                }
            });
        })(req, res, next);
    }
}

// Export the authenticate function separately
module.exports.authenticate = authenticate;

// Helper function to get token from headers
function getToken(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {  // Corrected from assignment (=) to comparison (===)
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}
