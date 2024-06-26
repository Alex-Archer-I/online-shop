const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const csurf = require('csurf');

const db = require('./database/database');

const createSessionConfig = require('./config/session');

const csurfToken = require('./middlewares/csurf');
const errorHandler = require('./middlewares/error-handler');
const checkAuth = require('./middlewares/check-auth');
const routesProtecter = require('./middlewares/routes-protecter');
const cartMiddleware = require('./middlewares/cart');
const updateCartMiddleware = require('./middlewares/update-cart-prices');
const notFoundPage = require('./middlewares/not-found');

const initailRoutes = require('./routes/initial-routes');
const authRoutes = require('./routes/auth-routes');
const productsRoutes = require('./routes/products-routes');
const adminRoutes = require('./routes/admin-routes');
const cartRoutes = require('./routes/cart-routes');
const ordersRoutes = require('./routes/orders-routes');

const app = express();

let port = 3000;

if (process.env.PORT) {
    port = process.env.PORT;
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets' ,express.static('product-data'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csurf());

app.use(cartMiddleware);
app.use(updateCartMiddleware);

app.use(csurfToken);
app.use(checkAuth);

app.use(initailRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', routesProtecter, ordersRoutes);
app.use('/admin', routesProtecter, adminRoutes);

app.use(notFoundPage);

app.use(errorHandler);

db.connectToDatabase()
.then(() => {
    app.listen(port);
}).catch((error) => {
    console.log('Failed to connect to database');
    console.log(error);
});