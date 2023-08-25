const createError = require('http-errors')
const Post = require('../models/post')
const postValidationSchema = require('../validation/post-validate')

// get all posts
exports.get_all_posts = async (req, res, next) => {
	try {
		const posts = await Post.find().populate('author')
	
		if (!posts) {
			throw createError.NotFound('No posts found')
		}
	
		res.status(200).json({posts})
	} catch (error) {
		next(error)
	}
}

// get a single post
exports.get_one_post = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id)

		if(!post) {
			res.status(404).json({ error: 'Post not found' })
		}
		res.status(200).json({post})
	} catch (error) {
		next(error)
	}
}

// create a post (only the user)
exports.create_post = async (req, res, next) => {
	try {
		
	} catch (error) {
		next(error)
	}
}