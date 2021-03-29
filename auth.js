const dotenv = require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./model/userModel.js')
const auth = require('express').Router();
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
  })

//AUTH change password 
auth.post('/api/change-password', async (req, res) => {
    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 8) {
		return res.json({
			status: 'error',
			error: 'Password too short, it should be at least 8 characters'
		})
	}

	if (!token) {
		return res.json({ status: 'error', error: 'are you logged in?'})
	}

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(newpassword, 12)

        await user.updateOne({ _id }, { $set: { password }})

        res.json({ status: 'ok'})

    } catch (error) {
        res.json({ status: 'error', error: 'are you logged in?'})
    } 
    res.json({ status: 'ok' })
})

//AUTH jwt
auth.post('/api/login/', async (req,res) => {
    const { username, password } = req.body
	try {
		const user = await User.findOne({ username }).lean()
		if (!user) {
			return res.json({ status: 'Errror', error: 'Invalid Username/Password'})
		}
		if (await bcrypt.compare(password, user.password )){
			const token = jwt.sign({ 
					id: user._id,
					username: user.username 
				}, process.env.JWT_SECRET)
	
			return res.json({ status: 'ok', data: token, name: user.username })
		} 
	} catch (error) {
		return res.json({ status: 'error', error: error.message })
	}


    res.json({ status: 'error', error: 'Invalid Username/Password' })
})

//AUTH register 
auth.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword, email, surname, firstName } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 8) {
		return res.json({
			status: 'error',
			error: 'Password too short, it should be at least 8 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password,
            email,
            surname,
            firstName
		})
		return res.json({ status: 'ok' })
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}
})

//AUTH delete account
auth.post('/api/delete-account', async (req, res) => {
    const { token, username } = req.body

	if(!token){
		return res.json({ status: 'error', error: 'You must be logged in to delete your account'})
	}

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
		const _id = user.id

		if (user.username !== username){
			return res.json({ status: 'error', error: 'You cannot delete an account that isnt yours'})
		}

        await User.findOneAndDelete({ _id })
		
		res.json({ status: 'ok'})

    } catch (error) {
        res.json({ status: 'error', error: 'Nope, That didnt work!'})
    } 
})



module.exports = auth