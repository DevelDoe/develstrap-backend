const Setting      = require('../../models/setting')
const { error }     = require('../../hlps')
const Moment        = require('moment')

module.exports = api => {

    api.get('/settings', (req, res) => {

        Setting.find( ( err, settings ) => {
                if ( err ) {
                    error( res, err )
                    return
                }
                res.json( settings )
        })
    })
   
    api.post( '/settings', ( req, res ) => {

        var setting = new Setting() 

        console.log(req.body.user_id)

        setting.user_id     = req.body.user_id
        setting.sites       = req.body.sites

        setting.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( setting )
        })

    })
    
    api.put( '/settings/:_id', ( req, res ) => {

        Setting.findById( req.params._id, ( err, setting ) => {

             if( err ) {
                  error( res, err )
                  return
             }

            setting.user_id     = req.body.user_id
            setting.sites       = req.body.sites

             setting.save( err => {
                  if( err ) {
                       error( res, err )
                       return
                  }
                  res.json( setting )
             })

        })

   })

   api.delete('/settings/:_id', (req, res) => {

    Setting.remove({
            _id: req.params._id
        }, (err) => {
            if (err) {
                error(setting, err)
                return
            }
            res.sendStatus(200)
        })

    })

}