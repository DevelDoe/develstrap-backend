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
                         console.log('album.user_id ' + album.user_id)
                         let artist
                         users.forEach(user => {
                              console.log('user._id ' + user._id)
                              if (user._id == album.user_id) artist = user.username
                         })
                         console.log(artist)
                    })
                    res.json(modAlbums)
               })
               

               
          })
     })

}