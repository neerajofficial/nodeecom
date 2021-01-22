const path = require('path');

const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
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

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('600321c47787c2041cc224c3')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000);