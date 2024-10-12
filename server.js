var express        = require( 'express' ),
    cors           = require('cors'),
    path           = require('path'),
    api            = express(),
    mongoose       = require( 'mongoose' ),
    config         = require('./config'),
    bodyParser     = require('body-parser'),
    { verboseLog } = require('./utils/logger')

// CORS options for allowing requests from the front-end
verboseLog('[SERVER} CORS options for allowing requests from the front-end')
const corsOptions = {
    origin: '*', // For testing, this allows all origins. You can restrict it to specific URLs later.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
};

api.use(cors(corsOptions));

verboseLog('[SERVER} body-parser')
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

verboseLog('[SERVER} static routes')
api.use('/uploads', express.static(path.join(__dirname, 'uploads')))
api.use('/uploads', express.static(path.join(__dirname, 'static')))

verboseLog('[SERVER} require routes')
require('./routes/routing')(api)


// MongoDB Connection
verboseLog('[SERVER} Connecting to MongoDB')
var port = process.env.PORT || config.port
mongoose.connect(config.database, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
    useCreateIndex: true, 
    serverSelectionTimeoutMS: 5000 
}).then(() => {
    verboseLog('[MONGO} Connected to MongoDB successfully')
}).catch((err) => {
    console.error('[SERVER} MongoDB connection error:', err)
})



// websockets
verboseLog('[SERVER} Setting up web sockets')
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

let online = []

socket.on('connection', (ws, req) => {

    ws.isAlive = true
    ws.on('pong', heartbeat)

    verboseLog('[SOCKET} New WebSocket connection established')

    socket.clients.forEach((ws) => {

        ws.on('close', function () {
            verboseLog('[SOCKET} WebSocket connection closed')


            if(online.indexOf(ws.user) != -1) {
                online.splice(online.indexOf(ws.user), 1)
                verboseLog(`[SOCKET} User ${ws.user} removed from online list`)

                socket.clients.forEach((client) => {
                    if (ws !== client) client.send(JSON.stringify({ type: 'online', online: false, id: ws.user }))
                })
                
            } 


        })

    })

    ws.on('message', (msg) => {

        let parsed
        try {
            parsed = JSON.parse(msg)
        } catch (err) {
            handleError(err)
            return
        }
        verboseLog(`[SOCKET} Received WebSocket message: ${msg}`)

        ws.type = parsed.type

        if (ws.type === 'setUser') {

            ws.user = parsed.user
            verboseLog(`[SOCKET} User set: ${ws.user}`)
            
            online.push(ws.user)
            verboseLog(`[SOCKET} Current online users: ${JSON.stringify(online)}`)

            socket.clients.forEach((client) => {
                online.forEach( user => {
                    client.send(JSON.stringify({ type: 'online', online: true, id: user }))
                })
            })
        }

        if (ws.type === 'chat') {
            verboseLog(`[SOCKET} Handling chat message from user ${parsed.user} in room ${parsed.room}`)

             var message        = new Message()

             message.room       = parsed.room 
             message.user       = parsed.user 
             message.message    = parsed.message
             message.created_at = parsed.created_at 

             message.save( err => {
                handleError(err)
                
                 socket.clients.forEach((client) => {
                     if (client !== ws) {
                        client.send(JSON.stringify( { type: 'message', message }))
                        verboseLog(`[SOCKET} Message sent: ${parsed.message}`)
                     } 
                 })
             })
            
        }

        if( ws.type === 'view' ) {
            verboseLog(`[SOCKET} Page view detected for app ${parsed.app} by user ${parsed.user_id}`)

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
            verboseLog(`[SOCKET} End of view session for IP ${ws.ip}`)

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
                if (ws.user) visitor.user_id = ws.user 
                else visitor.user_id = ws.user_id
                visitor.resolution = ws.resolution

                visitor.save(err => {
                    handleError(err)
                    clearInterval(id)
                    verboseLog(`[SOCKET} [SOCKET} View data added: ${ws.user}`)
                })

            }).catch(err => {
                handleError('ip-api fetch error:')
            })
        }

    })

})

const interval = setInterval(function ping() {
    socket.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            verboseLog('[SOCKET} dead')
            return ws.terminate()
        }

        ws.isAlive = false
        ws.ping(noop)
    })
}, 30000)

server.listen(port)
console.log(`[SERVER] Backend is running at http://localhost:${port}`)
