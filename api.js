var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    config   = require('./config')


require('./routes/routing')(api)
api.use('/uploads', express.static('uploads'))
var port = process.env.PORT || config.port
mongoose.connect(config.database, { useNewUrlParser: true } )
api.listen( port )
console.log( 'http://localhost:', port )
