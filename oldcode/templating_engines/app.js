const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const pug = require('pug');
// const exphbs = require('express-handlebars')

const rootDir = require('./utils/path')

const app = express();

// app.set('view engine', 'pug');
// app.set('views', 'views/pug');

// app.engine('.hbs', exphbs({extname: '.hbs', layoutsDir: 'views/hbs/layout/'}));
// app.set('view engine', '.hbs');  // file extension will be the same as name choosen here
// app.set('views', 'views/hbs');

app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorRoutes);

app.listen(3000, () => {
	console.log('Running');
})