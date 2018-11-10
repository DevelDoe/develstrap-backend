var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    config   = require('./config')


require('./routes/routing')(api)

api.use('/uploads', express.static('uploads'))

var port = process.env.PORT || config.port

mongoose.connect(config.database, { useNewUrlParser: true } )

// websockets
const server = require('http').Server(api)
const ws = require('ws')

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

    socket.clients.forEach((ws) => {

        var secondsOnServer = 0

        var id = setInterval(function () {
            secondsOnServer++
            ws.send(secondsOnServer, function () { /* ignore errors */ })
        }, 100)

        const index = req.connection.remoteAddress.lastIndexOf(':')
        const ip = req.connection.remoteAddress.substr(index + 1, req.connection.remoteAddress.length)
        ws.ip = ip

        ws.on('close', function () {
            console.log('ip:', ws.ip)
            console.log('seconds:', secondsOnServer)
            console.log('page:', ws.page)
            console.log('app:',ws.app)
            secondsOnServer = 0
            clearInterval(id)
        })
    })

    ws.on('message', (msg) => {
        parsed = JSON.parse(msg)
        ws.page = parsed.page
        ws.app = parsed.app
        ws.user_id = parsed.user_id
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
