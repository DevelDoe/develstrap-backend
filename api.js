var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    routes   = require( './routing' )( api )

var port = process.env.PORT || 4002,
    db   = 'mongodb://localhost:27017/develstrap'

mongoose.connect( db, { useNewUrlParser: true } )
api.listen( port )
console.log( 'http://localhost:', port )
