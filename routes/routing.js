module.exports = function ( api ) {
    require( '../middleware' )( api )
    require( './routes' )( api )
    require('./private/images')(api)
    require('./private/notes')(api)
    require('./private/posts')(api)
    require('./private/resources')(api)
    require('./private/todos')(api)
    require('./private/users')(api)
    require('./public/login')(api)
    require('./public/posts')(api)
}
