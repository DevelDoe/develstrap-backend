var express  = require( 'express' ),
    path     = require('path'),
    api      = express(),
    mongoose = require( 'mongoose' ),
    config   = require('./config'),
    Visitor  = require('./models/visitor'),
    axios    = require('axios'),
    Message = require('./models/message')


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

const debugSocket = false

socket.on('connection', (ws, req) => {

    ws.isAlive = true
    ws.on('pong', heartbeat)

    if (debugSocket) console.log('open socket')

    socket.clients.forEach((ws) => {

        ws.on('close', function () {
            clearInterval(interval)
            if (debugSocket) console.log('closing socket')
        })

        ws.send(JSON.stringify({user: ws.user}))

    })

    ws.on('message', (msg) => {

        parsed = JSON.parse(msg)

        ws.type = parsed.type

        if (debugSocket) console.log('message type', ws.type)

        if (ws.type === 'setUser') {
            ws.user = parsed.user
            if (debugSocket) console.log('user:', ws.user)
        }

        if (ws.type === 'chat') {

             var message        = new Message()

             message.room       = parsed.room 
             message.user       = parsed.user 
             message.message    = parsed.message
             message.created_at = parsed.created_at 

             message.save( err => {
                 if( err ) {
                     console.log(err)
                     return
                 }
                 if (debugSocket) console.log('message added:', message)
                 socket.clients.forEach((client) => {
                     if (client !== ws) client.send(JSON.stringify(message))
                 })
             })
            
        }

        if( ws.type === 'view' ) {
            const index = req.connection.remoteAddress.lastIndexOf(':')
            const ip = req.connection.remoteAddress.substr(index + 1, req.connection.remoteAddress.length)
            ws.ip = ip
            ws.ss = 0
            ws.page = parsed.page
            ws.app = parsed.app
            ws.user_id = parsed.user_id
            ws.resolution = parsed.resolution

            var id = setInterval(function () {
                ws.ss++
            }, 1000)
        }

        if( ws.type === 'endview') {
            axios.get('http://ip-api.com/json/' + ws.ip).then(res => {

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
                        console.log(err)
                        return
                    }
                    clearInterval(id)
                    if (debugSocket) console.log('view data added:', visitor)
                })

            }).catch(err => {
                console.log('ip-api fetch error:')
            })
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
