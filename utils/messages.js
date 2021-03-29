const monent = require('moment')
const MessageModel = require('../model/messageModel')

const formatMessage = (username, text, id) => {
    return {
        id,
        username,
        text,
        time: monent().format('h:mm a')
    }
}


const getMessages = async (room) => {
    const messages = await MessageModel.find({
        room: room
    })
    return messages
}

module.exports = {
    formatMessage,
    getMessages
}