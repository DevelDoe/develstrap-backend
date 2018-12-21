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
               let users
               User.find( ( er, u ) => {
                    if (err) {
                         error(res, err)
                         return
                    }
                    users = u
               })
               let modAlbums = JSON.parse(JSON.stringify(albums))
               modAlbums.forEach( album => {
                    album.artist = users.find(user => user._id === album.user_id)
               })

               res.json( modAlbums )
          })
     })

}