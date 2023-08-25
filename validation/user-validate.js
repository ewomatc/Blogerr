const Joi = require('joi')

const userValidationSchema = Joi.object({
	username: Joi.string()
								.trim()
								.required()
								.min(3)
								.max(10),
	email: Joi.string()
							.trim()
							.email()
							.lowercase()
							.required(),
	password: Joi.string()
								.trim()
								.required()
								.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
								.messages({'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit'})
})

module.exports = userValidationSchema