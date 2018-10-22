var config   = require('./config'),
    jwt      = require('jwt-simple'),
    multer   = require('multer'),
    Todo     = require('./models/todo'),
    Resource = require('./models/resource'),
    User     = require('./models/user'),
    Note     = require('./models/note'),
    File     = require('./models/file')

const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, res, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const upload   = multer({ dest: 'uploads/' }),

module.exports = function ( api ) {

    // #################   AUTHENTICATION
    api.post('/login', (req, res) => {
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

    // #################   FILES

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
            if(req.body.details!== '') resource.details = req.body.details
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
    api.post( '/users', upload.single('avatar'),( req, res ) => {
        console.log(req.file)
        var user = new User()
        if(req.body.fname !== '') user.fname = req.body.fname
        if(req.body.lname !== '') user.lname = req.body.lname
        if(req.body.username === '' && req.body.username !== null) user.username = req.body.username
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
            if(req.body.fname === '') user.fname = req.body.fname
            if(req.body.lname === '') user.lname = req.body.lname
            if(req.body.username === '' && req.body.username !== null) user.username = req.body.username
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

    function error ( res, err )  {
        res.json( { err: 'Server ' + err } )
    }
}
