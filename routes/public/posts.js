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
}