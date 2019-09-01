const Exercise           = require('../../models/exercise')
const { error }     = require('../../hlps')
const Moment        = require('moment')

module.exports = api => {

    api.get('/exercises', (req, res) => {

        Exercise.find( ( err, exercises ) => {
                if ( err ) {
                    error( res, err )
                    return
                }
                res.json( exercises )
        })
    })
   
    api.post( '/exercises', ( req, res ) => {

        var exercise = new Exercise() 

        exercise.group       = req.body.group 
        exercise.name        = req.body.name
        exercise.target      = req.body.target
        exercise.created_at  = Moment().unix() 

        exercise.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( exercise )
        })

    })
    
    api.put( '/exercises/:_id', ( req, res ) => {

        Exercise.findById( req.params._id, ( err, exercise ) => {

             if( err ) {
                  error( res, err )
                  return
             }

             exercise.group        = req.body.group
             exercise.name         = req.body.name
             exercise.weight       = req.body.weight
             exercise.repetitions  = req.body.repetitions
             exercise.target       = req.body.target

             exercise.updated_at   = Moment().unix()

             exercise.save( err => {
                  if( err ) {
                       error( res, err )
                       return
                  }
                  res.json( exercise )
             })

        })

   })

   api.delete('/exercises/:_id', (req, exercise) => {

        Exercise.remove({
            _id: req.params._id
        }, (err) => {
            if (err) {
                error(exercise, err)
                return
            }
            res.sendStatus(200)
        })

    })

}