const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true, 
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	}
})


//hash the password
userSchema.pre('save', async function(next) {
	try {
		const passwordHash = await bcrypt.hash(this.password, 10)
		this.password = passwordHash
		next()
	} catch (error) {
		next(error)
	}
})


//compare hashed password to login
userSchema.methods.verifyPassword = async function(password) {
	try {
		return await bcrypt.compare(password, this.password)
	} catch (error) {
		next(error)
	}
}


const User = mongoose.model('User', userSchema)

module.exports = User;