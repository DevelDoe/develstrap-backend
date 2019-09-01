const Set           = require('../../models/set')
const { error }     = require('../../hlps')
const Moment        = require('moment')

module.exports = api => {

    api.get('/sets', (req, res) => {

        Set.find( ( err, sets ) => {
                if ( err ) {
                    error( res, err )
                    return
                }
                res.json( sets )
        })
    })
   
    api.post( '/sets', ( req, res ) => {

        var set = new Set() 

        set.group       = req.body.group 
        set.name        = req.body.name
        set.created_at  = Moment().unix() 

        set.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( set )
        })

    })
    
    api.put( '/sets/:_id', ( req, res ) => {

        Set.findById( req.params._id, ( err, set ) => {

             if( err ) {
                  error( res, err )
                  return
             }

             set.group        = req.body.group
             set.name         = req.body.name
             set.weight       = req.body.weight
             set.repetitions  = req.body.repetitions

             set.updated_at   = Moment().unix()

             set.save( err => {
                  if( err ) {
                       error( res, err )
                       return
                  }
                  res.json( set )
             })

        })

   })

   api.delete('/sets/:_id', (req, set) => {

        Set.remove({
            _id: req.params._id
        }, (err) => {
            if (err) {
                error(set, err)
                return
            }
            res.sendStatus(200)
        })

    })

}