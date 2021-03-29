const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
	{
		username: String,
        text: String,
        time: String,
		room: String,
	},
	{ collection: 'messages' }
)

const messageModel = mongoose.model('MessageSchema', MessageSchema)

module.exports = messageModel