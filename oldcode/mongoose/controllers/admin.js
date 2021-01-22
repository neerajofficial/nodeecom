const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = await new Product({
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl,
    userId: req.user
  });

  const result = await product.save();
  if (!result) console.log('err');

  console.log('Created Product');
  res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  // const products = await Product.find()
  //   .select('title price -_id')
  //   .populate('userId', 'name -_id');
  // console.log(products);

  const products = await Product.find()
  if (!products) console.log('error fetching');
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!product) return res.redirect('/');
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  })
}

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = await Product.findById(prodId);
  product.title = updatedTitle;
  product.price = updatedPrice;
  product.imageUrl = updatedImageUrl;
  product.description = updatedDesc;
  const result = await product.save();
  
  console.log('UPDATED PRODUCT!');
  res.redirect('/admin/products');
}

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const response = await Product.findByIdAndRemove(prodId);
  if (response) console.log('DESTROYED PRODUCT');
  res.redirect('/admin/products');
};