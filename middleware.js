var cors        = require('cors'),
    bp          = require('body-parser'),
    config      = require('./config'),
    passport    = require('passport'),
    jwt         = require('jwt-simple'),
    morgan     = require('morgan')

module.exports = function( api ) {
    api.use(morgan('dev'))
    api.use( bp.urlencoded( { extended: true } ) )
    api.use( bp.json() )
    api.use( cors() )
    api.use(passport.initialize())
    require('./passport')(passport)
    api.use(authenticate)
}

function authenticate(req, res, next) {
    if(/(|login|register)/.test(req.originalUrl)) {
        return next()
    } else {
        (passport.authenticate('jwt', { session: false}), function(req, res, next) {
            var token = getToken(req.headers)
            if(token) {
                let decodedJWT = jwt.decode(token, config.secret)
                Todo.findOne({ name: decodedJWT.name }, (err, user) => {
                    if(err) {
                        res.json( { err: 'Server ' + err } )
                        return
                    }
                    if(!user) res.json( { message: 'Not authenticated' } )
                    else {
                        next()
                    }
                })
            } else {
                res.json({ msg: 'no token provided' })
            }
        })(req, res, next)
    }
}

function getToken(headers) {
    if( headers && headers.authorization) {
        var parted = headers.authorization.split(' ')
        if( parted.length = 2) return parted[1]
        else return null
    } else {
        return null
    }
}
