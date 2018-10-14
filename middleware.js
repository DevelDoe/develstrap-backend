var cors = require( 'cors' ),
    bp   = require( 'body-parser' )

module.exports = function( api ) {
    api.use( bp.urlencoded( { extended: true } ) )
    api.use( bp.json() )
    api.use( cors() )
}
