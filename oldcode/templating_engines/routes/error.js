const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('./../utils/path');

router.use('/', (req, res, next) => {
	// res.sendFile(path.join(rootDir, 'views', '404.html'));
	
	// res.render('pug/404', {
	// 	title: 'Error 404'
	// })

	res.status(404).render('404', {
		title: 'Error 404',
		path: false
	})
})

module.exports = router;