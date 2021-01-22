// const PRODUCTS = [];
const Product = require('./../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('add-product', {
		title: 'Add New Product',
		path: '/admin/add-product'
	})
}

exports.postAddProduct = (req, res, next) => {
	// PRODUCTS.push({
	// 	title: req.body.title
	// })

	const product = new Product(req.body.title);
	product.save();

	res.redirect('/');	
}

exports.getProducts = (req, res, next) => {
	// const products = Product.fetchAll();
	Product.fetchAll(products => {
		res.render('shop', {
			prods: products,
			title: 'All Products',
			path: '/'
		})
	})
}