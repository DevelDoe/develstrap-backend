const Message       = require('../../models/message')
const { error }     = require('../../hlps')

module.exports = api => {

     api.get( '/messages', ( req, res ) => {
          
          Message.find( ( err, messages ) => {
               if( err ) {
                    error( res, err )
                    return 
               }
               res.json( messages )
          })

     })

}