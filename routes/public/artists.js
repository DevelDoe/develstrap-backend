const User = require('../../models/user')
const { error } = require('../../hlps')
module.exports = api => {
     
     api.get( '/public/artists', ( req, res )  => {
          User.find( { artist: true }, ( err, users  ) => {
               if( err ) {
                    error( res, err )
                    return
               }
               const artists = JSON.parse( JSON.stringify( users ))
               artists.forEach( artist => {
                    delete artist.password 
                    delete artist.applications 
                    delete artist.administrations 
                    delete artist.forums 
                    delete artist.supports 
                    delete artist.sec_lv
               })
               res.json( artists )
          })
     })

     api.get( '/public/artist', ( req, res ) => {
          User.find( { username : req.param('username') }, (err, user) => {
               if (err) {
                    error(res, err)
                    return
               }
               if (!user) {
                    res.end('No user')
               } else {
                    const artist = JSON.parse(JSON.stringify(user))
                    delete artist.password
                    delete artist.applications
                    delete artist.administrations
                    delete artist.forums
                    delete artist.supports
                    delete artist.sec_lv
                    res.json(artist)
               }
          })
     })


}