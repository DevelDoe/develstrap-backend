var jwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt
    User        = require('./models/user.js'),
    config      = require('./config')

module.exports = function( pp ) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
    opts.secretOrKey = config.secret
    pp.use(new jwtStrategy( opts , function( jwt_payload , done ) {
        console.log('payload received', jwt_payload);
        User.find({ id: jwt_payload.id }, function( err , user ) {
            if ( err ) return done( err , false )
            if ( user ) done( null , user )
            else done( null , false )
        })
    }))
}
