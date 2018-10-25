var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    routes   = require( './routing' )( api ),
    config   = require('./config')

api.use('/uploads', express.static('uploads'))
var port = process.env.PORT || config.port
mongoose.connect(config.database, { useNewUrlParser: true } )
api.listen( port )
console.log( 'http://localhost:', port )
