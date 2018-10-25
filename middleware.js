var cors        = require('cors'),
    bp          = require('body-parser'),
    config      = require('./config'),
    passport    = require('passport'),
    jwt         = require('jwt-simple'),
    morgan      = require('morgan')

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
    if(/(login)|(uploads)/.test(req.originalUrl)) {
        next()
    } else {
        (passport.authenticate('jwt', { session: false}), function(req, res, next) {
            var token = getToken(req.headers)
            if(token) {
                let decodedJWT = jwt.decode(token, config.secret)
                User.find({ name: 'whatever' }, (err, user) => {
                    if(err) {
                        res.json( { err: 'Server ' + err } )
                        return
                    }
                    if (!results.length) {
                        var user = new User()
                        user.name = 'root'
                        user.password = 'toor'
                        user.save( err => {
                            if( err ) {
                                error( res, err )
                                return
                            }
                        })
                    }
                })
                User.findOne({ name: decodedJWT.name }, (err, user) => {
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
                res.sendStatus( 403 )
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
