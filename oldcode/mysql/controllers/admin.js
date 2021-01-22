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

  const result = await req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  });

  // const product = await Product.create({ 
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   // userId: req.user.id
  // });

  // const product = new Product(null, title, imageUrl, description, price);

  // const result = await product.save();
  
  if (!result) console.log('err');
  console.log(result);
  res.redirect('/');
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/');

  const prodId = req.params.productId;
  
  // const product = await Product.findByPk(prodId);
  const [product] = await req.user.getProducts({ where: { id: prodId } });

  if (!product) return res.redirect('/');

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });


 // ---------------------------------------
 // const editMode = req.query.edit;
 //  if (!editMode) {
 //    return res.redirect('/');
 //  }
 //  const prodId = req.params.productId;
 //  Product.findById(prodId, product => {
 //    if (!product) {
 //      return res.redirect('/');
 //    }
 //    res.render('admin/edit-product', {
 //      pageTitle: 'Edit Product',
 //      path: '/admin/edit-product',
 //      editing: editMode,
 //      product: product
 //    });
 //  });
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // const product = await Product.findByPk(prodId);
  const [product] = await req.user.getProducts({ where: { id: prodId } });

  if (!product) console.log('error');

  product.title = updatedTitle;
  product.price = updatedPrice;
  product.description = updatedDesc;
  product.imageUrl = updatedImageUrl;

  const result = await product.save();

  if (!result) return res.redirect('/');
  return res.redirect('/admin/products');


  // --------------------------------------------
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.findAll();

  if (!products) console.log('error');
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findByPk(prodId);

  const result = await product.destroy();
  console.log('Product Deleted');

  res.redirect('/admin/products');

  // Product.destroy({})
  // Product.deleteById(prodId);
};
