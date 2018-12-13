var express  = require( 'express' ),
    path     = require('path'),
    api      = express(),
    mongoose = require( 'mongoose' ),
    config   = require('./config'),
    Visitor  = require('./models/visitor'),
    axios    = require('axios')


require('./routes/routing')(api)

api.use('/uploads', express.static(path.join(__dirname, 'uploads')))
api.use('/uploads', express.static(path.join(__dirname, 'static')))

var port = process.env.PORT || config.port

mongoose.connect(config.database, { useNewUrlParser: true } )

// websockets
const server = require('http').Server(api)
const ws = require('ws')
const moment = require('moment')
// require('events').EventEmitter.prototype._maxListeners = 100

const socket = new ws.Server({
    server
})

function noop() {}

function heartbeat() {
    this.isAlive = true
}

socket.on('connection', (ws, req) => {

    ws.isAlive = true
    ws.on('pong', heartbeat)

    if(ws.type === 'view') {

        socket.clients.forEach((ws) => {

            var id = setInterval(function () {
                ws.ss++
            }, 1000)

            const index = req.connection.remoteAddress.lastIndexOf(':')
            const ip = req.connection.remoteAddress.substr(index + 1, req.connection.remoteAddress.length)
            ws.ip = ip



            ws.on('close', function () {

                console.log('closing view')

                axios.get('http://ip-api.com/json/' + ip).then(res => {

                    let visitor = new Visitor()
                    visitor.ip = ws.ip
                    visitor.city = res.data.city
                    visitor.country = res.data.country
                    visitor.region = res.data.regionName
                    visitor.timezone = res.data.timezone
                    visitor.date = moment().unix()
                    visitor.seconds = ws.ss
                    visitor.page = ws.page
                    visitor.app = ws.app
                    visitor.user_id = ws.user_id
                    visitor.resolution = ws.resolution
                    visitor.save(err => {
                        if (err) {
                            error(res.err)
                            return
                        }
                        console.log('view data added:', visitor.ip)
                        clearInterval(id)
                        clearInterval(interval)
                        ws.terminate()
                    })

                }).catch(err => {
                    console.log('ip-api fetch error:')
                    clearInterval(id)
                    clearInterval(interval)
                    ws.terminate()
                })
            })
        })
    }

    

    ws.on('message', (msg) => {

        parsed = JSON.parse(msg)

        switch(parsed.type) {
            case 'view':
                ws.type = 'view'
                ws.ss = 0
                ws.page = parsed.page
                ws.app = parsed.app
                ws.user_id = parsed.user_id
                ws.resolution = parsed.resolution
                break
            case 'forum':
                console.log(parsed)
        }

    })

})

const interval = setInterval(function ping() {
    socket.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log('dead')
            return ws.terminate()
        }
        ws.isAlive = false
        ws.ping(noop)
    })
}, 30000)

server.listen(port)
console.log( 'http://localhost:', port )
