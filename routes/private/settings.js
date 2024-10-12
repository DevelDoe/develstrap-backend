const express = require('express');
const router = express.Router(); // Use Express Router
const Setting      = require('../../models/setting')
const { handleError }     = require('../../utils/logger')
const { verifyToken } = require('../../middleware'); // Import authentication middleware
const Moment        = require('moment')

module.exports = api => {

api.get('/settings', verifyToken, (req, res) => {

    Setting.find( ( err, settings ) => {
            if ( err ) {
                handleError( res, err )
                return
            }
            res.json( settings )
    })
})

api.post( '/settings', verifyToken, ( req, res ) => {

    var setting = new Setting() 

    verboseLog(req.body.user_id)

    setting.user_id     = req.body.user_id
    setting.sites       = req.body.sites
    setting.created_at  = Moment().unix()


    setting.save( err => {
        if( err ) {
            handleError( res, err )
            return
        }
        res.json( setting )
    })

})

api.put( '/settings/:_id', verifyToken, ( req, res ) => {

    Setting.findById( req.params._id, ( err, setting ) => {

            if( err ) {
                handleError( res, err )
                return
            }

        setting.user_id     = req.body.user_id
        setting.updated_at  = Moment().unix()

            setting.save( err => {
                if( err ) {
                    handleError( res, err )
                    return
                }
                res.json( setting )
            })

    })

})

api.delete('/settings/:_id', verifyToken, (req, res) => {

Setting.remove({
        _id: req.params._id
    }, (err) => {
        if (err) {
            handleError(setting, err)
            return
        }
        res.sendStatus(200)
    })

})

}