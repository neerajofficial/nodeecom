const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * from products')
// 	.then(data => {
// 		console.log(data);
// 	})
// 	.catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
	const user = await User.findByPk(1);
	if (!user) console.log('No user');
	req.user = user;
	next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart); 
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
	// .sync({ force: true })
	.sync()
	.then(() => {
		return User.findByPk(1);
	})
	.then(user => {
		if (!user) return User.create({ 
			name: 'Neeraj', email: 'xyz@test.com'
		});

		return user;
	})
	.then(user => {
		// console.log(user);
		return user.createCart();
	})
	.then(cart => {
		app.listen(3000)
	})
	.catch(err => console.log(err));


