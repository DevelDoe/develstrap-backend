const Album = require('../../models/image')
const { error } = require('../../hlps')
module.exports = api => {

     api.get( '/albums', ( req, res ) => {
          Album.find( ( err, albums )  => {
               if( err ) {
                    error( res, err )
                    return
               }
               res.json( albums )
          })
     })
     
}