const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')


	// generate token
	exports.generateAccessToken = (userId, userRole) =>	{
		return new Promise((resolve, reject) => {
			const payload = {
				user: userId,
				role: userRole
			}
			const secret = process.env.SECRET
			const options = {
				issuer: 'blogerr.com',
				audience: userId,
				expiresIn: '1d'
			}

			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.error(err.message)
					reject(createError.InternalServerError())
				}
				resolve(token)
			})
		})
	}

	
exports.verifyAccessToken = (req, res, next) => {
		//check if headers even exist
		if (!req.headers['authorization']) {
			return next(createError.Unauthorized())
		}
		
		/* ---------------------------------------------------------//
		||	The structure of the authorization header								//
		||	|			Key						|					Value								|   	//
		||	|	authorization			|	Bearer tokenjuhbfhghbggfhdb	|			//
		||	|										|															|			//
		|| ---------------------------------------------------------*/

		//get the token from the second value of the authorization array
		const token = req.headers['authorization'].split(' ')[1]

		jwt.verify(token, process.env.SECRET, (err, user) => {
			if (err) {
				if(err.name === 'JsonWebToken') {
					next(createError.Unauthorized())
				}
				next(createError.Unauthorized(err.message))
			}
			
			req.user = user
			

			next()
		})
	}


// restrict access by role

exports.checkRole = (role) => {
	return (req, res, next) => {
		const user = req.user
		if (user.role !== role) {
			throw createError.Forbidden('You do not have permission to access this resource')
		}
		next()
	}
}
