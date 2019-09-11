const Exercise      = require('../../models/exercise')
const { error }     = require('../../hlps')
const Moment        = require('moment')

module.exports = api => {

    api.get('/exercises/:user_id', (req, res) => {

        Exercise.find( { user_id: req.params.user_id }, ( err, exercises ) => {
            if ( err ) {
                error( res, err )
                return
            }
            res.json( exercises )
        })
    })
   
    api.post( '/exercises', ( req, res ) => {

        var exercise = new Exercise() 

        exercise.group        = req.body.group 
        exercise.name         = req.body.name
        exercise.equipment    = req.body.equipment
        exercise.rated        = req.body.rated
        exercise.type         = req.body.type
        exercise.mechanic     = req.body.mechanic
        exercise.video        = req.body.video
        exercise.images       = req.body.images
        exercise.instructions = req.body.instructions

        exercise.created_at = Moment().unix()

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
            exercise.equipment    = req.body.equipment
            exercise.rated        = req.body.rated
            exercise.type         = req.body.type
            exercise.mechanic     = req.body.mechanic
            exercise.video        = req.body.video
            exercise.images       = req.body.images
            exercise.instructions = req.body.instructions

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

   api.delete('/exercises/:_id', (req, res) => {

        Exercise.remove({ _id: req.params._id }, (err) => {
            if (err) {
                error(exercise, err)
                return
            }
            res.sendStatus(200)
        })

    })

}