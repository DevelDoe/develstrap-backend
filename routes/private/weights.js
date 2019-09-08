const Weight      = require('../../models/weight')
const { error }     = require('../../hlps')
const Moment        = require('moment')

module.exports = api => {

    api.get('/weights/:user_id', (req, res) => {

        Weight.find( { user_id: req.params.user_id }, ( err, weights ) => {
            if ( err ) {
                error( res, err )
                return
            }
            res.json( weights )
        })
    })
   
    api.post( '/weights', ( req, res ) => {

        var weight = new Weight() 

        weight.user_id    = req.body.user_id
        weight.group      = req.body.group 
        weight.name       = req.body.name
        weight.target     = req.body.target
        weight.weight     = req.body.weight
        weight.created_at = Moment().unix()
        if(!req.body.level) weight.level = 1
        else weight.level = req.body.level

        weight.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( weight )
        })

    })
    
    api.put( '/weights/:_id', ( req, res ) => {

        Weight.findById( req.params._id, ( err, weight ) => {

             if( err ) {
                  error( res, err )
                  return
             }

             weight.user_id      = req.body.user_id
             weight.group        = req.body.group
             weight.name         = req.body.name
             weight.weight       = req.body.weight
             weight.repetitions  = req.body.repetitions
             weight.target       = req.body.target

             weight.updated_at   = Moment().unix()

             weight.save( err => {
                  if( err ) {
                       error( res, err )
                       return
                  }
                  res.json( weight )
             })

        })

   })

   api.delete('/weights/:_id', (req, res) => {

        Weight.remove({
            _id: req.params._id
        }, (err) => {
            if (err) {
                error(weight, err)
                return
            }
            res.sendStatus(200)
        })

    })

}