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
                              if( user._id == album.user_id ) album.artis = user.username
                         })
                         console.log(album.artis)
                    })
                    res.json(modAlbums)
               })
               

               
          })
     })

}