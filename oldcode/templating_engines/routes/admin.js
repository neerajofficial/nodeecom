const express = require('express');
const path = require('path');

const rootDir = require('./../utils/path');

const router = express.Router();

const PRODUCTS = [];

router.get('/add-product', (req, res, next) => {
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	// res.render('pug/add-product', {
	// 	title: 'Add New Product',
	// 	path: '/admin/add-product'
	// })
	// res.render('add-product', {
	// 	title: 'Add New Product',
	// 	path: '/admin/add-product',
	// 	activeAddProduct: true,
	// 	productCss: true,
	// 	formsCss: true,
	// })
	res.render('add-product', {
		title: 'Add New Product',
		path: '/admin/add-product'
	})
})

router.post('/add-product', (req, res, next) => {
	PRODUCTS.push({
		title: req.body.title
	})
	
	res.redirect('/');	
})

module.exports = {
	routes: router,
	products: PRODUCTS
}