const { body } = require('express-validator');

const title = () => {
	return body('title')
		.isString()
		.isLength({ min: 3 })
		.trim()
}

const url = () => {
	return body('imageUrl')
		.isURL()
}
const decimal = () => {
	return body('price')
		.isFloat()
}

const textarea = () => {
	return body('description')
		.isLength({ min: 5, max: 100 })
		.trim()
}

exports.product = [
	title(),
	url(),
	decimal(),
	textarea()
]