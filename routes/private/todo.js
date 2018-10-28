const Todo = require('../../models/todo')

module.exports = (api) => {

    api.get('/tasks', (req, res) => {
        Todo.find((err, todos) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(todos)
        })
    })
    api.post('/tasks', (req, res) => {
        var todo = new Todo()
        todo.title = req.body.title
        todo.completed = req.body.completed
        todo.user_id = req.body.user_id
        todo.save(err => {
            if (err) {
                error(res, err)
                return
            }
            res.json(todo)
        })
    })
    api.delete('/tasks/:_id', (req, res) => {
        Todo.remove({
            _id: req.params._id
        }, (err, todo) => {
            if (err) {
                error(res, err)
                return
            }
            res.sendStatus(200)
        })
    })
    api.put('/tasks/:_id', (req, res) => {
        Todo.findById(req.params._id, (err, todo) => {
            if (err) {
                error(res, err)
                return
            }
            todo.title = req.body.title
            todo.completed = req.body.completed
            todo.user_id = req.body.user_id
            todo.save(err => {
                if (err) {
                    error(res, err)
                    return
                }
                res.json(todo)
            })
        })
    }) 
}