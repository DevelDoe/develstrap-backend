const Photo = require('../../models/photo')
const { error } = require( '../../hlps')

module.exports = function( api ) {

    api.get('/photos', (req,res) => {
        Photo.find( (err, photos) => {
            if(err) {
                error(res, err)
                return
            }
            res.json(photos)
        })
    })

    api.post('/photos', (req, res) => {
        
        var photo = new Photo()
        photo.title = req.body.title
        photo.summary = req.body.summary
        photo.published = req.body.published
        photo.createdAt = Moment().unix()
        photo.updatedAt = photo.createdAt
        photo.publishedAt = req.body.publishedAt
        photo.tags = req.body.tags
        photo.user_id = req.body.user_id
        photo.shared = req.body.shared
        photo.feat = req.body.feat
        photo.photos = req.body.photos

        photo.save( err => {
            if(err) {
                error(res,err)
                return
            }
            res.json(photo)
        })
    })

    api.put('/photos/:id', (req, res) => {
        Photo.findById(req.params._id, (err, photo) => {
            if(err) {
                error(res,err)
                return
            }
            
            photo.title = req.body.title
            photo.summary = req.body.summary
            photo.published = req.body.published
            photo.updatedAt = Moment().unix()
            photo.publishedAt = req.body.publishedAt
            photo.tags = req.body.tags
            photo.user_id = req.body.user_id
            photo.shared = req.body.shared
            photo.feat = req.body.feat
            photo.photos = req.body.photos

            photo.save( err => {
                if(err) {
                    error(res,err)
                    return
                }
                res.json(photo)
            })
        })
    })

    api.delete('/photos/:id', (req, res) => {
        Photo.remove({ _id: req.param._id }, (err, photo) =>{
            if(err) {
                error(res,err)
                return 
            }
            res.sendStatus(200)
        })
    })

}