exports.get404 = (req, res, next) => {
	res.status(404).render('404', {
		title: 'Error 404',
		path: false
	})
}