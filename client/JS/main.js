const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const logOut = document.querySelector('.log-out')
const roomSelect = document.querySelector('.room-select')
const socket = io()
let currentUser;

//add current year to footer copyright 
const yearSpan = document.querySelector('.date')
const year = new Date().getFullYear()
yearSpan.innerText = year

//check if token or re-direct to login page
window.addEventListener('DOMContentLoaded', () => {
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight
    const token = localStorage.getItem('token')
    if (!token) {
        window.location = '/index.html'
    }
})

//log out button-remove token form local storage
logOut.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location = '/login.html'
})


//get username and room from url
let { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//Set Select Box based on current room from Query Params
roomSelect.value = room

//Change room on Select box Change
roomSelect.addEventListener('change', () => {
    const value = roomSelect.value
    window.location = `/chat.html?username=${username}&room=${value}`
})

//send join chat info to server
socket.emit('joinRoom', { username, room })

//Get room and its users info
socket.on('roomUsers', ({ room, roomUsers }) => {
    outputUsers(roomUsers)
})

//Message from server
socket.on('message', ( message, user ) => {
    outputMessage(message, user)
    //Easy scroll Fix 
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// Bring back old messages on page load/room change 
socket.on('oldmessages', async (messages) => {
    const x = await messages
    x.map((message) => {
        outputMessage(message)
    })
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//Submit Message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    currentUser = socket.id
    //Emit message to server
    socket.emit('chatMessage', msg)

    //clear input and re-focus on the input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Send message to DOM
const outputMessage = (message) => {
    const div = document.createElement('div')
        div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
        <p class="text">
            ${message.text}
        </p>`
                if (message.username === username) {
                div.classList.add('user-message')
                } else {
                div.classList.add('message')
                }
             
    document.querySelector('.chat-messages').appendChild(div)
}

//Send Current Users to the DOM
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li> ${user.username} <i class="fas fa-circle"></i></i> </li>`).join('')}
   `
}
