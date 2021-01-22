const Product = require('./../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/product-list', {
			prods: products,
			title: 'All Products',
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
	Product.fetchAll(products => {
		res.render('shop/cart', {
			prods: products,
			title: 'Cart',
			path: '/cart'
		})
	})
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