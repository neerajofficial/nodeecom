const express = require('express');
const path = require('path');

const rootDir = require('./../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));
	const products = adminData.products;
	// pug
	// res.status(200).render('pug/shop',{
	// 	prods: products,
	// 	title: 'Products',
	// 	path: '/'
	// });
	// hbs
	// res.status(200).render('shop',{
	// 	prods: products,
	// 	title: 'Products',
	// 	path: '/',
	// 	hasProducts: products.length > 0,
	// 	activeShop: true,
	// 	productCss: true
	// });

	res.render('shop', {
		prods: products,
		title: 'All Products',
		path: '/'
	})
})

module.exports = router;