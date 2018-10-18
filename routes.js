var config   = require('./config'),
    jwt      = require('jwt-simple'),
    passport = require('passport'),
    Todo     = require('./models/todo'),
    Resource = require('./models/resource'),
    User     = require('./models/user')

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


    // #################   TODOS
    api.get( '/todos', ( req, res ) => {
        Todo.find( ( err, todos ) => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( todos )
        })
    })
    api.post( '/todos', ( req, res ) => {
        var todo = new Todo()
        todo.title      = req.body.title
        todo.completed  = req.body.completed
        todo.save( err => {
            if( err ) {
                error( res, err )
                return
            }
            res.json( todo )
        })
    })
    api.delete( '/todos/:_id', ( req, res ) => {
        Todo.remove( { _id: req.params._id }, ( err, todo ) => {
            if( err ) {
                error( res, err)
                return
            }
            res.sendStatus( 200 )
        })
    })
    api.put( '/todos/:_id', ( req, res ) => {
        Todo.findById( req.params._id, ( err, todo ) => {
            if( err ) {
                error( res, err)
                return
            }
            todo.title      = req.body.title
            todo.completed  = req.body.completed
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
        resource.fields = req.body.fields
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
            resource.fields = req.body.fields
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
        user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        if(req.body.img_src === '') user.img_src = 'http://orig03.deviantart.net/9670/f/2016/057/9/e/technomancy_tracks_by_valenberg-d9t6qzy.gif'
        else user.img_src = req.body.img_src
        user.sec_lv = req.body.sec_lv
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
            user.lname = req.body.lname
            user.username = req.body.username
            user.email = req.body.email
            user.password = req.body.password
            user.image_src = req.body.image_src
            user.sec_lv = req.body.sec_lv
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

    function error ( res, err )  {
        res.json( { err: 'Server ' + err } )
    }
}
