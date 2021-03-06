if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const http = require('http').Server(app)
const mongoose = require('mongoose')
const path = require('path')
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
const cors = require('cors')
const SocketController = require('./controllers/SocketController')
const ConversationRoute = require('./routes/ConversationRoute')

// setup options
app.use(express.static(path.join(__dirname,'..','client','build')))
app.use(express.urlencoded({limit: '10mb', extended: false}))
app.use(express.json())
app.use(cors())
// Connect DB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to MongoDB'))

// Routers
app.use('/conversation', ConversationRoute)

// Socket
io.of('/chat').on('connection', SocketController.handleChatSocket)
io.of('/video-call').on('connection', SocketController.handleVideoCallSocket)

// Listen on port
http.listen(process.env.PORT, () => {
    console.log('Message server is listening on port ' + process.env.PORT);
})