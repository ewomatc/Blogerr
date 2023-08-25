const createError = require('http-errors')
const {ObjectId} = require('mongoose').Types
const User = require('../models/user')
const userValidationSchema = require('../validation/user-validate')
const {generateAccessToken} = require('../auth/jwt-auth')
const {verifyAccessToken} = require('../auth/jwt-auth')


//get all users
exports.get_user_list = async(req, res, next) => {
	try {
		const users = await User.find().select('-password')

		if(!users) {
			throw createError.NotFound('No users were found')
		}
		res.status(200).json({users})
	} catch (error) {
		next(error)
	}
}


//register new user
exports.register_user = async(req, res, next) => {
	try {

		const { username, email, password } = req.body

		//validate request body
		const result = await userValidationSchema.validateAsync(req.body)
		//check for existing user
		const userExists = await User.findOne({ email: result.email })
		if (userExists) {
			throw createError.Conflict(`${result.email} is already registered`)
		}

		//create user
		const user = new User({
			username: result.username,
			email: result.email,
			password: result.password
		})

		const savedUser = await user.save()
		
		const accessToken = await generateAccessToken(savedUser.id, savedUser.role)

		res.status(201).json({accessToken, savedUser})

	} catch (error) {
		next(error)
	}
}


//login user
exports.login_user = async(req, res, next) => {
	try {
		const result = await userValidationSchema.validateAsync(req.body)

		//check if the user with given email exists
		const user = await User.findOne({ email: result.email })
		if(!user) {
			throw createError.NotFound('User not registered')
		}

		//compare given password with hashed password in database
		const passwordMatch = await user.verifyPassword(result.password)
		if(!passwordMatch) {
			throw createError.Unauthorized('email or password is incorrect')
		} 

		const accessToken = await generateAccessToken(user.id, user.role)

		res.status(200).json({accessToken})
	} catch (error) {
		next(error)
	}
}

// get a user profile by id
exports.get_user_profile = async (req, res, next) => {
	try {
		const idOrName = req.params.idOrName

		// initialize user variable
		let user
		// check if it's a valid mongoose id that was passed in the params
		// use it to find the user or treat it as a name to find the user by
		if(ObjectId.isValid(idOrName)) {
			user = await User.findById(idOrName).select('-password')
		} else {
			user = await User.findOne({ username: idOrName }).select('-password')
		}

		if(!user) {
			throw createError.NotFound('User not found')
		}

		res.status(200).json({user})
		
	} catch (error) {
		next(error)
	}
}

exports.get_user_count = async (req, res, next) => {
	try {
		const userCount = await User.countDocuments()

		if (!userCount) {
			throw createError.NotFound('No user found')
		}
		
		res.status(200).json({userCount})

	} catch (error) {
		next(error)
	}
}

// update user's profile
exports.update_profile = async (req, res, next) => {
	const userIdFromToken = req.user.user
	const userIdFromRequest = req.params.id

	if (ObjectId.isValid(userIdFromToken, userIdFromRequest)) {
		if(userIdFromRequest !== userIdFromToken) {
			return res.status(403).json({error: 'Forbidden from accessing this profile'})
		}
	}

	const {username, email} = req.body;

	try {
		const user = await User.findByIdAndUpdate(userIdFromRequest, req.body, {new: true}).select('-password')

		if(!user) {
			throw createError.NotFound('Your profile was not found')
		}

		res.status(200).json({ user })

	} catch (error) {
		next(error)
	}
}