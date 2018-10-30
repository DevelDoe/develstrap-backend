const Note = require('../../models/note'),
      Moment = require('moment')

module.exports = function (api) {
    api.get('/notes', (req, res) => {
        Note.find((err, notes) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(notes)
        })
    })
    api.post('/notes', (req, res) => {
        var note = new Note()
        note.title = req.body.title
        note.overview = req.body.overview
        note.user_id = req.body.user_id
        note.createdAt = Moment().unix()
        note.save(err => {
            if (err) {
                error(res, err)
                return
            }
            res.json(note)
        })
    })
    api.delete('/notes/:_id', (req, res) => {
        Note.remove({
            _id: req.params._id
        }, (err, note) => {
            if (err) {
                error(res, err)
                return
            }
            res.sendStatus(200)
        })
    })
    api.put('/notes/:_id', (req, res) => {
        Note.findById(req.params._id, (err, note) => {
            if (err) {
                error(res, err)
                return
            }
            note.title = req.body.title
            note.overview = req.body.overview
            note.user_id = req.body.user_id
            note.updatedAt = Moment().unix()
            note.save(err => {
                if (err) {
                    error(res, err)
                    return
                }
                res.json(note)
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