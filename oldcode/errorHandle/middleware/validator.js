const { check, body } = require('express-validator');
const User = require('./../models/user');

const emailExists = (value) => {
	return  User.findOne({email: value})
		.then(userDoc => {					
			if (userDoc) {
			   	return Promise.reject('Email already exists.')
			}
		})
}

const email = () => {
	return check('email')
		.isEmail()
		.withMessage('Invalid Email Address')
		.normalizeEmail()
		.custom((value, {req}) => {
			// if (value === 'test@test.com') throw new Error('This is not allowed');
			// return true;
			return emailExists(value)
		})
}

const password = () => {
	return body(
		'password',
		'Please enter a password with numbers and text and min 5' 
		)
		.isLength({ min: 4 })
		.isAlphanumeric()
		.trim()
}

const confirmPassword = () => {
	return body('confirmPassword')
		.trim()
		.custom((value, {req}) => {
			if (value !== req.body.password) throw new Error('Password not matching');
			return true
		})
}

exports.signup = [
	email(),
	password(),
	confirmPassword()
]

const emailExists2 = (value) => {
	return  User.findOne({email: value})
		.then(userDoc => {					
			if (!userDoc) {
			   	return Promise.reject('Email doesn\'t exists.')
			}
		})
}

const email2 = () => {
	return check('email')
		.isEmail()
		.withMessage('Invalid Email Address')
		.normalizeEmail()
		.custom((value, {req}) => {
			// if (value === 'test@test.com') throw new Error('This is not allowed');
			// return true;
			return emailExists2(value)
		})
}

exports.login = [
	email2()
]