var Todo     = require('./models/todo'),
    Resource = require('./models/resource'),
    User     = require('./models/user')

module.exports = function ( api ) {


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
        var resource = new User()
        user.name = req.body.name
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
            user.name = req.body.name
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
        res.json( { err: 'Server error:' + err } )
    }
}
