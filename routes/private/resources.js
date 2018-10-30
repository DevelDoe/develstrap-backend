const Resource = require('../../models/resource')

module.exports = function (api) {
    api.get('/resources', (req, res) => {
        Resource.find((err, resource) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(resource)
        })
    })
    api.post('/resources', (req, res) => {
        var resource = new Resource()
        resource.name = req.body.name
        resource.details = req.body.details
        resource.fields = req.body.fields
        resource.read = req.body.read
        resource.write = req.body.write
        resource.save(err => {
            if (err) {
                error(res, err)
                return
            }
            res.json(resource)
        })
    })
    api.delete('/resources/:_id', (req, res) => {
        Resource.remove({
            _id: req.params._id
        }, (err, resource) => {
            if (err) {
                error(res, err)
                return
            }
            res.sendStatus(200)
        })
    })
    api.put('/resources/:_id', (req, res) => {
        Resource.findById(req.params._id, (err, resource) => {
            if (err) {
                error(res, err)
                return
            }
            resource.name = req.body.name
            resource.details = req.body.details
            resource.fields = req.body.fields
            resource.read = req.body.read
            resource.write = req.body.write
            resource.save(err => {
                if (err) {
                    error(res, err)
                    return
                }
                res.json(resource)
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