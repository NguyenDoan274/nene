var createError = require('http-errors');
var express = require('express');
const { engine } =require ('express-handlebars');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Customer = require('./models/Customer');
const Employee = require('./models/Employee');
const methodOverride = require('method-override');

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayouts: 'layouts',
        partialsDir: path.join(__dirname, 'views', 'partials'),
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
    })
);



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/QuanLyBanSach')
    .then(() => {
        console.log("MongoDB Connected successfully.");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    })



var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var contactRouter = require('./routes/contact');
var usersRouter = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//method override
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, {
        id: user.id,
        role: user instanceof require('./models/Employee') ? 'admin' : 'customer'
    });
});

passport.deserializeUser(async (data, done) => {
    try {
        if (data.role === 'admin') {
            const admin = await Employee.findById(data.id);
            return done(null, admin);
        } else {
            const customer = await Customer.findById(data.id).populate('wishlist');
            return done(null, customer);
        }
    } catch (err) {
        done(err);
    }
});



// You might also need custom middleware to make flash messages available in templates
app.use((req, res, next) => {
    if (req.user && req.user.wishlist) {
        res.locals.wishlists = req.user.wishlist.map(item => item.toObject());
        res.locals.wishlistTotal = req.user.wishlist.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    } else {
        res.locals.wishlists = [];
    }
    res.locals.user = req.user ? req.user.toObject() : null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error'); // Passport.js often uses 'error'
    res.locals.errors = req.flash('errors');
    next();
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/product', productRouter);
app.use('/admin/contact', contactRouter);
app.use('/users', usersRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

module.exports = app;
