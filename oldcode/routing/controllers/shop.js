const Product = require('./../models/product');
const Cart = require('./../models/cart');

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/product-list', {
			prods: products,
			title: 'All Products',
			path: '/products'
		})
	})
}

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId, product => {
		res.render('shop/product-detail', {
			product: product,
			title: product.title,
			path: '/products'
		})
	})
}

exports.getIndex = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/index', {
			prods: products,
			title: 'Shop',
			path: '/'
		})
	})
}

exports.getCart = (req, res, next) => {
	
		res.render('shop/cart', {
			title: 'Cart',
			path: '/cart'
		})
}

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	console.log(prodId);
	Product.findById(prodId, product => {
		Cart.addProduct(prodId, product.price);
	})
	res.redirect('/cart');
}

exports.getCheckout = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/checkout', {
			prods: products,
			title: 'Checkout',
			path: '/checkout'
		})
	})
}

exports.getOrders = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/orders', {
			prods: products,
			title: 'Orders',
			path: '/orders'
		})
	})
}