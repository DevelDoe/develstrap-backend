var Todo = require('./models/todo')

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
    function error ( res, err )  {
        res.json( { err: 'Server error:' + err } )
    }
}
