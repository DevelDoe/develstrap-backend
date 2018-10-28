const Post = require('../../models/post')

module.exports = function (api) {
    api.get('/public/posts', (req, res) => {
        Post.find((err, posts) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(posts)
        })
    })
    api.get('/public/post', (req, res) => {
        Post.findById(req.param('id'), (err, post) => {
            if (err) {
                error(res, err)
                return
            }
            if(!post) {
                res.end( 'No post' )
            } else {
                res.json(post)
            }
            
        })
    })
} 