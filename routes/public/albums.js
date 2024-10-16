const Album = require('../../models/image')
const User = require('../../models/user')
const { error } = require('../../hlps')
module.exports = api => {

     api.get( '/public/albums', ( req, res ) => {
          Album.find( ( err, albums )  => {
               if( err ) {
                    error( res, err )
                    return
               }
               User.find( ( er, users ) => {
                    if (err) {
                         error(res, err)
                         return
                    }
                    let modAlbums = JSON.parse(JSON.stringify(albums))
                    modAlbums.forEach(album => {
                         users.forEach(user => {
                              if( user._id == album.user_id ) {
                                   album.artist = user.username
                                   album.artist_img = user.img_src
                              } 
                         })
                    })
                    res.json(modAlbums)
               })
               

               
          })
     })

     api.get( '/public/album', ( req, res ) => {
          Album.findById( req.param( 'id' ), ( err, album ) => {
               if (err) {
                    error(res, err)
                    return
               }
               if (!album) {
                    res.end('No album')
               } else {
                    res.json(album)
               }
          })
     })

}