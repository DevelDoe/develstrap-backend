const Post = require('../../models/post')

module.exports = function( api ) {
    api.get('/public/posts', (req, res) => {
        Post.find((err, posts) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(posts)
        })
    })
    api.get('/public/post/:id', (req, res) => {
        Post.findOne({ _id: req.body.id }, (err, post) => {
            if (err) {
                error(res, err)
                return
            }
            if(!post) {
                res.end( 'No post' )
            }
            res.json(post)
        })
    })
}