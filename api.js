var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    config   = require('./config'),
    Visitor = require('./models/visitor')


require('./routes/routing')(api)

api.use('/uploads', express.static('uploads'))

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

    socket.clients.forEach((ws) => {

        var id = setInterval(function () {
            ws.ss++
        }, 1000)

        const index = req.connection.remoteAddress.lastIndexOf(':')
        const ip = req.connection.remoteAddress.substr(index + 1, req.connection.remoteAddress.length)
        ws.ip = ip

        ws.on('close', function () {
            
            let visitor = new Visitor()
            visitor.ip = ws.ip
            visitor.date = moment().unix()
            visitor.seconds = ws.ss 
            visitor.page = ws.page 
            visitor.app = ws.app 
            visitor.user_id = ws.user_id
            visitor.save( err => {
                if(err) {
                    error(res.err)
                    return
                }
                console.log('---------------')
                console.log('ip:', visitor.ip)
                console.log('date:', visitor.date)
                console.log('seconds:', visitor.seconds)
                console.log('page:', visitor.page)
                console.log('app:', visitor.app)
                console.log('user_id:', visitor.user_id)

                console.log('---------------')
            })
            ws.secondsOnServer = 0
            clearInterval(id)
            clearInterval(interval)
        })
    })

    ws.on('message', (msg) => {

        parsed = JSON.parse(msg)
        
        ws.ss = 0
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
