const mongoose = require('mongoose')
const User = require('./user')

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 3,
		required: true
	},
	content: {
		type: String,
		min: 5,
		required: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User
	}},
	{ timestamps: true }
	)

module.exports = mongoose.model('Post', postSchema)