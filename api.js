var express  = require( 'express' ),
    api      = express(),
    mongoose = require( 'mongoose' ),
    config   = require('./config'),
    Visitor  = require('./models/visitor'),
    axios    = require('axios')


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

            console.log('close')

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

    ws.on('message', (msg) => {

        parsed = JSON.parse(msg)
        
        ws.ss = 0
        ws.page = parsed.page
        ws.app = parsed.app
        ws.user_id = parsed.user_id
        ws.resolution = parsed.resolution
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

api.use((err,req,res,next)=>{
    if(err.code === 'LIMIT_FILE_TYPES') {
        res.status(422).json({ error: 'Only images are allowed'})
        return
    }
})

server.listen(port)
console.log( 'http://localhost:', port )
