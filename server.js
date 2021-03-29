const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const User = require('./model/userModel.js')
const MessageModel = require('./model/messageModel.js')
const cors = require('cors')
const auth = require('./auth.js')
const app = express()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)
const io = socketio(server)
const { formatMessage, getMessage, getMessages } = require('./utils/messages.js')
const { getCurrentUser, userJoin, getRoomUsers, userLeave  }  = require('./utils/users.js')
const { response } = require('express')
const moment = require('moment')
const admin = 'Admin'

//Connect to MongoDB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

app.use(bodyParser.json())
app.use(cors())

//set Static folder
app.use(express.static(path.join(__dirname, 'client')))

//The AUTH routes
app.use('/', auth)


//Websockets 
//Run When User Connects
io.on('connection', async (socket) => {
    //get user join info
    socket.on('joinRoom', async ({ username, room }) => {
        const user = userJoin(socket.id, username, room )
        const oldMessages = await getMessages(user.room)
        socket.join(user.room)
        socket.emit('oldmessages', oldMessages)
    
    //Broadcast a message when a user Joins the Room
    socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(admin, `${user.username} has joined the chat`))
    
    // socket.broadcast
    //         .to(user.room)
    //         .emit('message', getMessages(user.room))

    // send users and room info
    io.to(user.room)
    .emit('roomUsers', {
        room: user.room,
        roomUsers: getRoomUsers(user.room)
      })
    })

    //listen for chat messages
    socket.on('chatMessage', async (msg) => {
        const user = getCurrentUser(socket.id)
        console.log(user)
        try {
            MessageModel.create({ 
                username: user.username,
                text: msg,
                time: moment().format('h:mm a'),
                room: user.room
            })
        } catch (error) {
            console.log(error)
        }
        io.to(user.room)
           .emit('message', formatMessage(user.username, msg, user.id), user.username ) 
    })

    //Broadcast when user leave the chat
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room)
              .emit('message', formatMessage(admin, `${user.username} has left the chat!`))
              io.to(user.room)
               // send users and room info
              .emit('roomUsers', {
                  room: user.room,
                  roomUsers: getRoomUsers(user.room)
                })
        }  
    })
})



server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})