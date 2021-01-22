const Product = require('../models/product');
const Order = require('./../models/order');

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  if (!products) console.log('error fetching');
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    isAuth: req.session.isLoggedIn
  });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  if (!products) console.log('error fetching');
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
    isAuth: req.session.isLoggedIn
  });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!product) console.log('error fetching');
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products',
    isAuth: req.session.isLoggedIn
  });
}

exports.getCart = async (req, res, next) => {
  const user = await req.session.user
    .populate('cart.items.productId')
    .execPopulate();

  const products = user.cart.items;

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products,
    isAuth: req.session.isLoggedIn
  });
}

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  const product = await Product.findById(prodId);
  const response = await req.session.user.addToCart(product);
  if (!response) console.log('Error to cart');
  res.redirect('/cart');
}

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  const response = await req.session.user.removeFromCart(prodId);

  if (!response) console.log('Error in delete cartItem');
  res.redirect('/cart');
}

exports.postOrder = async (req, res, next) => {
  const user = await req.session.user
    .populate('cart.items.productId')
    .execPopulate();
  
  const products = await user.cart.items.map(i => {
    return {
      quantity: i.quantity, 
      product: { ...i.productId._doc } 
    }
  });

  const order = await new Order({
    user: {
      name: req.session.user.name,
      userId: req.session.user
    },
    products: products
  })

  const result = await order.save();
  if (!result) console.log('error');
  if (result) await req.session.user.clearCart();

  res.redirect('/orders');
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({"user.userId": req.session.user._id});
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
    isAuth: req.session.isLoggedIn
  });
}
