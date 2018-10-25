const config   = require('./config'),
      jwt      = require('jwt-simple'),
      multer   = require('multer'),
      Todo     = require('./models/todo'),
      Resource = require('./models/resource'),
      User     = require('./models/user'),
      Note     = require('./models/note'),
      Post     = require('./models/post')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5  }, // 5 MB
    fileFilter: fileFilter
}).single('img_src')

module.exports = function ( api ) {

    // #################   AUTHENTICATION
    api.post('/login', (req, res) => {
        Model.find( { 'email': 'root' }, function (err, results) {
             if(err) {
                error(res, err)
                return
            }
            if (!results.length) {
                var root = new User()
                root.email = 'root@root'
                root.password = 'toor'
                root.save(err => {
                    if( err ) {
                        error( res, err )
                        return
                    }
                })
            }
        }
        User.findOne({ 'email': req.body.email }, (err, user) => {
            if(err) {
                error(res, err)
                return
            }
            if(!user) {
                res.json({ msg: 'User not found!' })
            } else {
                user.comparePassword(req.body.password, function( err, isMatched ) {
                    console.log(isMatched)
                    if ( isMatched && !err ) {
                        var token = jwt.encode(user, config.secret)

                        res.json({ user: user, token : 'JWT ' + token})
                    }
                    else {
                        res.json( { message: 'Invalid password'  } )
                    }
                })
            }

        })
    })
    api.post( '/logout', function( req, res ) {
        req.logout()
        res.json({ msg: 'Loged out' })
        res.end()
    })
    // #################

    // #################   IMAGES
    api.post('/image',( req, res ) => {
        upload(req, res, (err) => {
            if( err ) {
                if(err) {
                    error(res, err)
                    return
                }
            }
            return res.json({ file: req.file })
        })
    })
    // api.post('/images', upload.array('avatari', 30), (req,res) => {
    //     console.log(req)
    // })
    // #################


    // #################   TODOS
    api.get( '/tasks', ( req, res ) => {
        Todo.find( ( err, todos ) => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( todos )
        })
    })
    api.post( '/tasks', ( req, res ) => {
        var todo = new Todo()
        todo.title      = req.body.title
        todo.completed  = req.body.completed
        todo.user_id    = req.body.user_id
        todo.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( todo )
        })
    })
    api.delete( '/tasks/:_id', ( req, res ) => {
        Todo.remove( { _id: req.params._id }, ( err, todo ) => {
            if( err ) {
                error( res, err)
                return
            }
            res.sendStatus( 200 )
        })
    })
    api.put( '/tasks/:_id', ( req, res ) => {
        Todo.findById( req.params._id, ( err, todo ) => {
            if( err ) {
                error( res, err)
                return
            }
            todo.title      = req.body.title
            todo.completed  = req.body.completed
            todo.user_id    = req.body.user_id
            todo.save( err => {
                if( err ) {
                    error( res, err )
                    return
                }
                res.json( todo )
            })
        })
    })
    // #################

    // #################   RESOURCES
    api.get( '/resources', ( req, res ) => {
        Resource.find( ( err, resource ) => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( resource )
        })
    })
    api.post( '/resources', ( req, res ) => {
        var resource = new Resource()
        resource.name = req.body.name
        resource.details = req.body.details
        resource.fields = req.body.fields
        resource.read = req.body.read
        resource.write = req.body.write
        resource.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( resource )
        })
    })
    api.delete( '/resources/:_id', ( req, res ) => {
        Resource.remove( { _id: req.params._id }, ( err, resource ) => {
            if( err ) {
                error( res, err)
                return
            }
            res.sendStatus( 200 )
        })
    })
    api.put( '/resources/:_id', ( req, res ) => {
        Resource.findById( req.params._id, ( err, resource ) => {
            if( err ) {
                error( res, err)
                return
            }
            resource.name = req.body.name
            resource.details = req.body.details
            resource.fields = req.body.fields
            resource.read = req.body.read
            resource.write = req.body.write
            resource.save( err => {
                if( err ) {
                    error( res, err )
                    return
                }
                res.json( resource )
            })
        })
    })
    // #################

    // #################   USERS
    api.get( '/users', ( req, res ) => {
        User.find( ( err, user ) => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( user )
        })
    })
    api.post( '/users', ( req, res ) => {
        var user = new User()
        user.fname = req.body.fname
        user.lname = req.body.lname
        if(req.body.username === '' ) user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        if(req.file.path === '') user.img_src = 'https://media.giphy.com/media/Im7Adiayxy6zK/giphy.gif'
        user.img_src = req.file.path
        user.sec_lv = req.body.sec_lv
        user.applications = req.body.applications
        user.administrations = req.body.administrations
        user.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( user )
        })
    })
    api.delete( '/users/:_id', ( req, res ) => {
        User.remove( { _id: req.params._id }, ( err, user ) => {
            if( err ) {
                error( res, err)
                return
            }
            res.sendStatus( 200 )
        })
    })
    api.put( '/users/:_id', ( req, res ) => {
        User.findById( req.params._id, ( err, user ) => {
            if( err ) {
                error( res, err)
                return
            }
            user.fname = req.body.fname
            if(req.body.lname === '') user.lname = req.body.lname
            if(req.body.username === '' ) user.username = req.body.username
            user.email = req.body.email
            user.password = req.body.password
            if(req.body.img_src === '') user.img_src = 'https://media.giphy.com/media/Im7Adiayxy6zK/giphy.gif'
            else user.img_src = req.body.img_src
            user.sec_lv = req.body.sec_lv
            user.applications = req.body.applications
            user.administrations = req.body.administrations
            user.save( err => {
                if( err ) {
                    error( res, err )
                    return
                }
                res.json( user )
            })
        })
    })
    // #################

    // #################   TODOS
    api.get( '/notes', ( req, res ) => {
        Note.find( ( err, notes ) => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( notes )
        })
    })
    api.post( '/notes', ( req, res ) => {
        var note = new Note()
        note.title      = req.body.title
        note.overview  = req.body.overview
        note.user_id    = req.body.user_id
        note.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( note )
        })
    })
    api.delete( '/notes/:_id', ( req, res ) => {
        Note.remove( { _id: req.params._id }, ( err, note ) => {
            if( err ) {
                error( res, err)
                return
            }
            res.sendStatus( 200 )
        })
    })
    api.put( '/notes/:_id', ( req, res ) => {
        Note.findById( req.params._id, ( err, note ) => {
            if( err ) {
                error( res, err)
                return
            }
            note.title      = req.body.title
            note.overview  = req.body.overview
            note.user_id    = req.body.user_id
            note.save( err => {
                if( err ) {
                    error( res, err )
                    return
                }
                res.json( note )
            })
        })
    })
    // #################

    // #################   POSTS
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
         post.createdAt = req.body.createdAt
         post.tags = req.body.tags
         post.user_id = req.body.user_id
         post.save(function (err) {
             if (err) {
                 error(res, err)
                 return
             }
             res.json(post)
         })
    })
    api.delete('/posts/:_id', (req, res) => {
        Post.remove({ _id: req.params._id }, (err, post) => {
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
            post.createdAt = req.body.createdAt
            post.tags = req.body.tags
            post.user_id = req.body.user_id
            post.save(err => {
                if (err) {
                    error(res, err)
                    return
                }
                res.json(post)
            })
        })
    })
    // #################

    function error ( res, err )  {
        res.status(500)
        res.json( { err: 'Server ' + err } )
    }
}
