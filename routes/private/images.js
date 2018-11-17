const Image = require('../../models/image')
const { error } = require( '../../hlps')
const Moment = require('moment')

module.exports = function( api ) {

    api.get('/images', (req, res) => {
        Image.find((err, images) => {
            if(err) {
                error(res, err)
                return
            }
            res.json(images)
        })
    })

    api.post('/images', (req, res) => {
        
        var image = new Image()
        image.title = req.body.title
        image.summary = req.body.summary
        image.published = req.body.published
        image.createdAt = Moment().unix()
        image.updatedAt = image.createdAt
        image.publishedAt = req.body.publishedAt
        image.tags = req.body.tags
        image.user_id = req.body.user_id
        image.shared = req.body.shared
        image.feat = req.body.feat
        image.images = req.body.images

        image.save(err => {
            if(err) {
                error(res,err)
                return
            }
            res.json(image)
        })
    })

    api.put('/images/:_id', (req, res) => {
        Image.findById(req.params._id, (err, image) => {
            if(err) {
                error(res,err)
                return
            }
            
            image.title = req.body.title
            image.summary = req.body.summary
            image.published = req.body.published
            image.updatedAt = Moment().unix()
            image.publishedAt = req.body.publishedAt
            image.tags = req.body.tags
            image.user_id = req.body.user_id
            image.shared = req.body.shared
            image.feat = req.body.feat
            image.images = req.body.images

            image.save(err => {
                if(err) {
                    error(res,err)
                    return
                }
                res.json(image)
            })
        })
    })

    api.delete('/images/:_id', (req, res) => {
        Image.remove({ _id: req.param._id }, (err, image) =>{
            if(err) {
                error(res,err)
                return 
            }
            res.sendStatus(200)
        })
    })

}