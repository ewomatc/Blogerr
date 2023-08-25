const joi = require('joi')

const postValidationSchema = joi.object({
	title: joi.string()
						.trim()
						.required()
						.min(3),
	content: joi.string()
						.trim()
						.required()
						.min(5)
})

module.exports = postValidationSchema