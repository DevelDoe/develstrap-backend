var cors        = require('cors'),
    bp          = require('body-parser'),
    passport    = require('passport')

module.exports = function( api ) {
    api.use( bp.urlencoded( { extended: true } ) )
    api.use( bp.json() )
    api.use( cors() )
    api.use(passport.initialize())
    require('./passport')(passport)
}
