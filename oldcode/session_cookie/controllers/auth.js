const User = require('./../models/user');

exports.getLogin = (req, res, next) => {
	console.log(req.session.isLoggedIn);
	// const isLoggedIn = req.get('Cookie').split('=')[1];
	res.render('auth/login', {
    	path: '/login',
    	pageTitle: 'Login Page',
    	isAuth: false	
  	});
}

exports.postLogin = (req, res, next) => {
	// res.setHeader('Set-Cookie', 'loggedIn=true');
	User.findById('600321c47787c2041cc224c3')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect('/');		
		})
		.catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/')
	})
}