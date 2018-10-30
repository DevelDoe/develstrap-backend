const Post = require('../../models/post'),
      Moment = require('moment')

module.exports = function (api) {
    api.get('/posts', (req, res) => {
        Post.find((err, posts) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(posts)
        })
    })
    api.post('/posts', (req, res) => {
        var post = new Post()
        post.title = req.body.title
        post.original = req.body.original
        post.summary = req.body.summary
        post.body = req.body.body
        post.category = req.body.category
        post.published = req.body.published
        post.createdAt = Moment().unix()
        post.updatedAt = Moment().unix()
        post.tags = req.body.tags
        post.user_id = req.body.user_id
        post.shared = req.body.shared
        post.lang = req.body.lang
        post.wip = req.body.wip
        post.feat = req.body.feat
        post.important = req.body.important
        post.save(function (err) {
            if (err) {
                error(res, err)
                return
            }
            res.json(post)
        })
    })
    api.delete('/posts/:_id', (req, res) => {
        Post.remove({
            _id: req.params._id
        }, (err, post) => {
            if (err) {
                error(res, err)
                return
            }
            res.sendStatus(200)
        })
    })
    api.put('/posts/:_id', (req, res) => {
        Post.findById(req.params._id, (err, post) => {
            if (err) {
                error(res, err)
                return
            }
            post.title = req.body.title
            post.original = req.body.original
            post.summary = req.body.summary
            post.body = req.body.body
            post.category = req.body.category
            post.published = req.body.published
            post.updatedAt = Moment().unix()
            post.tags = req.body.tags
            post.user_id = req.body.user_id
            post.shared = req.body.shared
            post.lang = req.body.lang
            post.wip = req.body.wip
            post.feat = req.body.feat
            post.important = req.body.important
            post.save(err => {
                if (err) {
                    error(res, err)
                    return
                }
                res.json(post)
            })
        })
    })
    function error(res, err) {
        res.status(500)
        res.json({
            err: 'Server ' + err
        })
    }
}