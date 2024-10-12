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






var express    = require( 'express' ),
    cors       = require('cors'),
    path       = require('path'),
    api        = express(),
    mongoose   = require( 'mongoose' ),
    config     = require('./config'),
    Visitor    = require('./models/visitor'),
    axios      = require('axios'),
    Message    = require('./models/message'),
    bodyParser = require('body-parser');

// CORS options for allowing requests from the front-end
const corsOptions = {
    origin: 'http://localhost:8080', // Allow requests from this front-end URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow these HTTP methods
    credentials: true, // Allow cookies or authorization headers to be included
    allowedHeaders: ['Content-Type', 'Authorization'], // Add required headers
    optionsSuccessStatus: 204 // Status to return for preflight OPTIONS request success
};

// Apply CORS globally to handle all requests, including preflight OPTIONS
api.use(cors(corsOptions));

// Apply body-parser before routes are defined
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

const { verboseLog, handleError } = require('./utils/logger')
verboseLog('[SERVER} Starting the server...')

api.use('/uploads', express.static(path.join(__dirname, 'uploads')))
api.use('/uploads', express.static(path.join(__dirname, 'static')))

require('./routes/routing')(api)

// Existing code
var port = process.env.PORT || config.port

mongoose.connect(config.database, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
    useCreateIndex: true, 
    serverSelectionTimeoutMS: 5000 // Set a 5-second timeout for MongoDB operations       
}).then(() => {
    verboseLog('[MONGO} Connected to MongoDB successfully')
}).catch((err) => {
    console.error('MongoDB connection error:', err)
})

// websockets
const server = require('http').Server(api)
const ws = require('ws')
const moment = require('moment')
// require('events').EventEmitter.prototype._maxListeners = 100

const socket = new ws.Server({
    server
})

function noop() {}

function heartbeat() {
    this.isAlive = true
}

let online = []

socket.on('connection', (ws, req) => {

    ws.isAlive = true
    ws.on('pong', heartbeat)

    verboseLog('[SOCKET} New WebSocket connection established')

    socket.clients.forEach((ws) => {

        ws.on('close', function () {
            verboseLog('[SOCKET} WebSocket connection closed')


            if(online.indexOf(ws.user) != -1) {
                online.splice(online.indexOf(ws.user), 1)
                verboseLog(`[SOCKET} User ${ws.user} removed from online list`)

                socket.clients.forEach((client) => {
                    if (ws !== client) client.send(JSON.stringify({ type: 'online', online: false, id: ws.user }))
                })
                
            } 


        })

    })

    ws.on('message', (msg) => {

        let parsed
        try {
            parsed = JSON.parse(msg)
        } catch (err) {
            handleError(err)
            return
        }
        verboseLog(`[SOCKET} Received WebSocket message: ${msg}`)

        ws.type = parsed.type

        if (ws.type === 'setUser') {

            ws.user = parsed.user
            verboseLog(`[SOCKET} User set: ${ws.user}`)
            
            online.push(ws.user)
            verboseLog(`[SOCKET} Current online users: ${JSON.stringify(online)}`)

            socket.clients.forEach((client) => {
                online.forEach( user => {
                    client.send(JSON.stringify({ type: 'online', online: true, id: user }))
                })
            })
        }

        if (ws.type === 'chat') {
            verboseLog(`[SOCKET} Handling chat message from user ${parsed.user} in room ${parsed.room}`)

             var message        = new Message()

             message.room       = parsed.room 
             message.user       = parsed.user 
             message.message    = parsed.message
             message.created_at = parsed.created_at 

             message.save( err => {
                handleError(err)
                
                 socket.clients.forEach((client) => {
                     if (client !== ws) {
                        client.send(JSON.stringify( { type: 'message', message }))
                        verboseLog(`[SOCKET} Message sent: ${parsed.message}`)
                     } 
                 })
             })
            
        }

        if( ws.type === 'view' ) {
            verboseLog(`[SOCKET} Page view detected for app ${parsed.app} by user ${parsed.user_id}`)

            const index = req.connection.remoteAddress.lastIndexOf(':')
            const ip = req.connection.remoteAddress.substr(index + 1, req.connection.remoteAddress.length)
            ws.ip = ip
            ws.ss = 0
            ws.page = parsed.page
            ws.app = parsed.app
            ws.user_id = parsed.user_id
            ws.resolution = parsed.resolution

            var id = setInterval(function () {
                ws.ss++
            }, 1000)
        }

        if( ws.type === 'endview') {
            verboseLog(`[SOCKET} End of view session for IP ${ws.ip}`)

            axios.get('http://ip-api.com/json/' + ws.ip).then(res => {

                let visitor = new Visitor()

                visitor.ip = ws.ip
                visitor.city = res.data.city
                visitor.country = res.data.country
                visitor.region = res.data.regionName
                visitor.timezone = res.data.timezone
                visitor.date = moment().unix()
                visitor.seconds = ws.ss
                visitor.page = ws.page
                visitor.app = ws.app
                if (ws.user) visitor.user_id = ws.user 
                else visitor.user_id = ws.user_id
                visitor.resolution = ws.resolution

                visitor.save(err => {
                    handleError(err)
                    clearInterval(id)
                    verboseLog(`[SOCKET} [SOCKET} View data added: ${ws.user}`)
                })

            }).catch(err => {
                handleError('ip-api fetch error:')
            })
        }

    })

})

const interval = setInterval(function ping() {
    socket.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            verboseLog('[SOCKET} dead')
            return ws.terminate()
        }

        ws.isAlive = false
        ws.ping(noop)
    })
}, 30000)

server.listen(port)
console.log(`[SERVER] http://localhost:${port}`)



// login.js
// Import required modules
const express = require('express');
const router = express.Router();
const config = require('../../config');
const jwt = require('jwt-simple');
const User = require('../../models/user');
const { verboseLog } = require('../../utils/logger');
const { SUPPORTS } = require('mongodb/lib/utils');

/**
 * Module that defines the login and logout routes
 * @param api - The main Express app instance
 */
module.exports = function (api) {
    // Login Route (POST /public/login)
    router.post('/login', async (req, res) => {
        verboseLog(`[LOGIN] User login attempt from email: ${req.body.email}`);

        if (!req.body.email || !req.body.password) {
            verboseLog('[LOGIN] Missing email or password in request');
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        try {
            verboseLog('[LOGIN] Starting login process');

            // Find user attempting to log in
            verboseLog(`[LOGIN] Looking for user with email: ${req.body.email}`);
            let user = await User.findOne({ 'email': req.body.email }).exec();

            if (!user) {
                verboseLog('[LOGIN] User not found');
                return res.status(404).json({ msg: 'User not found!' });
            }

            // Compare password
            verboseLog('[LOGIN] User found, comparing password');
            user.comparePassword(req.body.password, function (err, isMatched) {
                if (err) {
                    verboseLog(`[LOGIN] Error comparing password: ${err}`);
                    return res.status(500).json({ msg: 'Server error comparing password' });
                }

                if (isMatched) {
                    verboseLog('[LOGIN] Password matched, generating token');

                    // Define the payload
                    const payload = {
                        _id: user.id,
                        username: user.username,
                        email: user.email,
                        sec_lv: user.sec_lv,
                        administrations: user.administrations,
                        applications:user.applications,
                        supports:user.supports,
                        forums:user.forums
                    };

                    try {
                        // Generate the token with the payload
                        const token = jwt.encode(payload, config.secret);
                        verboseLog('[LOGIN] Token generated successfully');

                        return res.json({
                            user: user, // CHANGE TO PAYLOAD
                            token: 'Bearer ' + token
                        });
                    } catch (tokenError) {
                        verboseLog(`[LOGIN] Error during token generation: ${tokenError}`);
                        return res.status(500).json({ msg: 'Error generating token' });
                    }
                } else {
                    verboseLog('[LOGIN] Invalid password');
                    return res.status(401).json({ msg: 'Invalid password' });
                }
            });
        } catch (err) {
            verboseLog(`[LOGIN] Error during login process: ${err}`);
            return res.status(500).json({ msg: 'Server error during login process' });
        }
    });

    // Logout Route (POST /public/logout)
    router.post('/logout', (req, res) => {
        try {
            verboseLog('[LOGOUT] Logging out user');
            res.json({ msg: 'Logged out' });
            res.end()
        } catch (err) {
            verboseLog(`[LOGOUT] Error during logout process: ${err}`);
            return res.status(500).json({ msg: 'Server error during logout process' });
        }
    });

    // Attach the router to the main `api` object at `/public`
    api.use('/public', router);
};



/* {
    "applications": [],
    "administrations": [
        "users",
        "data"
    ],
    "supports": [],
    "forums": [],
    "_id": "67080b74a1675826e4e89478",
    "username": "root@toor.me",
    "email": "root@toor.me",
    "password": "$2b$10$Po.Uc87Uv33jCDXjOZw8jeWL2VJze2SZg.ILHCLhQiupYtsGhjbue",
    "sec_lv": "0",
    "__v": 0
} */



    // Export routing function
module.exports = function (api) {
    // Public routes (no authentication required)
    require('./public/login')(api);
    require('./public/posts')(api);
    require('./public/authors')(api);
    require('./public/artists')(api);
    require('./public/albums')(api);

    // Import the authenticate middleware for private routes
    const { authenticate } = require('../middleware');

    // Private routes that require authentication
    require('./private/notes')(api, authenticate);
    require('./private/posts')(api, authenticate);
    require('./private/resources')(api, authenticate);
    require('./private/todos')(api, authenticate);
    require('./private/users')(api, authenticate);
    require('./private/visitors')(api, authenticate);
    require('./private/images')(api, authenticate);
    require('./private/upload')(api, authenticate);
    require('./private/workouts')(api, authenticate);
    require('./private/exercises')(api, authenticate);
    require('./private/settings')(api, authenticate);
    require('./private/messages')(api, authenticate);
    require('./private/tickets')(api, authenticate);
};