module.exports = function ( api ) {
    require( './middleware' )( api )
    require( './routes' )( api )
    require('./routes/public/login')(api)
    require('./routes/public/posts')(api)
}
