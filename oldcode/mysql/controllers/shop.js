const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  
  const products = await Product.findAll();

  if (!products) console.log('error fetch');

  res.render('shop/index', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products'
  }); 

  // const products = await Product.fetchAll();
  // if (!products) console.log('error fetch');
  // const [rows, fieldData] = products;
  // res.render('shop/product-list', {
  //   prods: rows,
  //   pageTitle: 'All Products',
  //   path: '/products'
  // });  
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  const product = await  Product.findByPk(prodId);

  if (!product) console.log('error fetch');

  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products'
  });

  // --------------------- Way 2 -------------------------
  // const products = await Product.findAll({ 
  //   where: {
  //     id: prodId
  //   }
  // });

  // if (!products) console.log('error fetch');

  // res.render('shop/product-detail', {
  //   product: products[0],
  //   pageTitle: products[0].title,
  //   path: '/products'
  // });

  // --------------------- Old Way -----------------------
  // if (!product) console.log('error fetch');
  
  // const [row, fieldData] = product;

  // res.render('shop/product-detail', {
  //   product: row[0],
  //   pageTitle: row[0].title,
  //   path: '/products'
  // });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.findAll();

  if (!products) console.log('error fetch');

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  }); 

  // const products = await Product.fetchAll();

  // if (!products) console.log('error fetch');

  // const [rows, fieldData] = products;

  // res.render('shop/index', {
  //   prods: rows,
  //   pageTitle: 'Shop',
  //   path: '/'
  // });
};

exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  if (!cart) console.log('Cart error');

  const cartProducts = await cart.getProducts();
  if (!cartProducts) console.log('Cart Products error');

  console.log(cartProducts);

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: cartProducts
  });

 
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  const cart = await req.user.getCart();
  if (!cart) console.log('Cart error');

  const [ cartProduct ] = await cart.getProducts({ where: { id: prodId } });

  let newQuantity = 1;
  const product = await Product.findByPk(prodId);
  
  if (!cartProduct) {
    cart.addProduct(product, { through: {
      quantity: newQuantity
    } })
  } else {
    const oldQuantity = cartProduct.cartItem.quantity;
    newQuantity = oldQuantity + 1;
    cart.addProduct(product, { through: {
      quantity: newQuantity
    } })
  }

  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
   
  const cart = await req.user.getCart();
  if (!cart) console.log('Cart error');

  const [cartProduct] = await cart.getProducts({where: { id: prodId }});

  if (!cartProduct) console.log('Cart Products error');

  const result = await cartProduct.cartItem.destroy();

  res.redirect('/cart');
  
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
