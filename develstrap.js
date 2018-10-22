var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    routes   = require( './routing' )( api ),
    config   = require('./config'),
    fs       = require('fs')

app.use(express.static())
var port = process.env.PORT || 4002
mongoose.connect(config.database, { useNewUrlParser: true } )
api.listen( port )
console.log( 'http://localhost:', port )
