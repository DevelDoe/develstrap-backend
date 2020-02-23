const Workout      = require('../../models/workout')
const { error }     = require('../../hlps')
const Moment        = require('moment')

module.exports = api => {

    api.get('/workouts/:user_id', (req, res) => {

        Workout.find( { user_id: req.params.user_id }, ( err, workouts ) => {
            if ( err ) {
                error( res, err )
                return
            }
            res.json( workouts )
        })
    })
   
    api.post( '/workouts', ( req, res ) => {

        var workout = new Workout() 

        workout.user_id     = req.body.user_id
        workout.group       = req.body.group 
        workout.name        = req.body.name
        workout.exercise_id = req.body.exercise_id
        workout.target      = req.body.target
        workout.weight      = req.body.weight

        workout.created_at  = Moment().unix()
        
        if(!req.body.level) workout.level = 1
        else workout.level = req.body.level

        workout.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( workout )
        })

    })
    
    api.put( '/workouts/:_id', ( req, res ) => {

        Workout.findById( req.params._id, ( err, workout ) => {

             if( err ) {
                  error( res, err )
                  return
             }

             workout.repetitions  = req.body.repetitions
             workout.target       = req.body.target

             workout.updated_at   = Moment().unix()

             workout.save( err => {
                  if( err ) {
                       error( res, err )
                       return
                  }
                  res.json( workout )
             })

        })

   })

   api.delete('/workouts/:_id', (req, res) => {


        Workout.findById( req.params._id, ( err, workout ) => {

            if( err ) {
                 error( res, err )
                 return
            }

            Workout.find( { user_id: workout.user_id }, ( err, workouts ) => {
                if ( err ) {
                    error( res, err )
                    return
                }

                let eFlag = false

                workouts.forEach( w => {
                    if(w.name === workout.name) {
                        Workout.remove({
                            _id: w._id
                        }, (err) => {
                            eFlag = true
                        })
                    }
                })

                if(eFlag) {
                    if (err) {
                        error(w, err)
                        return
                    }
                } else {
                    res.sendStatus(200)
                }
            })
       })
    })
}