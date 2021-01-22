const path = require('path');

const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const User = require('./models/user');

const PORT = process.env.PORT;
const uri = 'mongodb+srv://neerajsingh:Qwerty123@myecom.xn6g1.mongodb.net/newcom?retryWrites=true&w=majority';

/* -------------  DB Config ------------ */
const connected = mongoose.connect(uri, {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useFindAndModify: false
});

if (!connected) console.log('error');
if (connected) {
	console.log('connected');
	User.findOne()
		.then(user => {
			if (!user) {
				const user = new User({
					name: 'Neeraj',
					email: 'test@test.com',
					cart: {
						items: []
					}
				});
				user.save();
			}
		});
}

const app = express();
const store = new MongoDBStore({
	uri: uri,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'SECRET', 
	resave: false, 
	saveUninitialized: false,
	store: store
}))

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.listen(3000);