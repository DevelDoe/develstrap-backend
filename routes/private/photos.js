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
        post.summary = req.body.summary
        post.published = req.body.published
        post.createdAt = Moment().unix()
        post.updatedAt = post.createdAt
        post.publishedAt = req.body.publishedAt
        post.tags = req.body.tags
        post.user_id = req.body.user_id
        post.shared = req.body.shared
        post.feat = req.body.feat
        post.photos = req.body.photos

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
            post.summary = req.body.summary
            post.published = req.body.published
            post.updatedAt = Moment().unix()
            post.publishedAt = req.body.publishedAt
            post.tags = req.body.tags
            post.user_id = req.body.user_id
            post.shared = req.body.shared
            post.feat = req.body.feat
            post.photos = req.body.photos

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