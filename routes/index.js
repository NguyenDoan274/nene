var express = require('express');
const Customer = require("../models/Customer");
const bcryptjs = require("bcryptjs");
const passport = require('passport');
const Category = require("../models/Category");
const Product = require("../models/Product");
const Contact = require("../models/Contact");
const LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
router.all('/*', function(
    req,
    res,
    next) {
    Category.find({}).then((dbCategory) => {
        categories = dbCategory.map(cat => cat.toObject());
        res.app.locals.layout = 'home';
        next();
    });
})

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user instanceof Customer) {
        return next(); // Proceed if authenticated
    } else {
        res.redirect('/login'); // Redirect to login if authentication fails
    }
}

/* GET home page. */
router.get('/', async (req, res, next) => {
    const [dbCategory, dbProduct] = await Promise.all([
        Category.find({}),
        Product.find({})
    ]);

    res.render('home/index', {
        title: 'home',
        categories: dbCategory.map(c => c.toObject()),
        products: dbProduct.map(p => p.toObject())
    });
});


router.get('/shop', async (req, res) => {
    try {
        const categoryId = req.query.category; // Lấy ID danh mục từ URL (?category=...)
        const author=req.query.author;
        const name=req.query.name;
        let filter= {};
        if (categoryId) {
            filter.category = categoryId;
        }
        if (author) {
            filter.author = author;
        }
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        const [dbCategory, dbProduct] = await Promise.all([
            Category.find({}),
            Product.find(filter).populate('category')
        ]);

        res.render('home/shop', {
            categories: dbCategory.map(c => c.toObject()),
            products: dbProduct.map(p => p.toObject())
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/about', function(req, res, next) {
    res.render('home/about');
});

router.get('/blog', function(req, res, next) {
    res.render('home/blog');
});

router.post('/cart/add/:productId',async (req, res) => {
    let productId = req.params.productId;
    let quantity = parseInt(req.body.quantity) || 1;
    let cart = req.session.cart || {
        items: {},
        totalQty: 0,
        totalPrice: 0
    };

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.redirect('back');
        }

            if (!cart.items[productId]) {
                cart.items[productId] = {
                    product : product.toObject(),
                    quantity: 0
                };
            }
            cart.items[productId].quantity += quantity;
            cart.totalQty +=  quantity;
            cart.totalPrice += product.price * quantity;

            req.session.cart = cart;
        req.flash('success_message', `Đã thêm ${quantity} vào giỏ hàng`);
            res.redirect('back');
    }
    catch (error) {
        res.status(500).send("error");
    }
})

router.get('/cart', function(req, res, next) {
    let cart = req.session.cart;
    let cartProducts = [];
    if (cart) {
        cartProducts = Object.values(cart.items);
    }
    res.render('home/cart', {
        title: 'cart',
        cartProducts,
        totalPrice: cart ? cart.totalPrice : 0,
    });
});

router.get('/checkout', function(req, res, next) {
    res.render('home/checkout');
});

router.get('/contact', function(req, res, next) {
    Contact.find({}).then((dbContact) => {
        contacts = dbContact.map(cat=>cat.toObject());
        res.render('home/contact', {contacts: contacts});
    });
});

router.get('/single-post', function(req, res, next) {
    res.render('home/single-post');
});

router.get('/category', function(req, res, next) {
    Category.find({}).then((dbCategory) => {
        categories = dbCategory.map(cat=>cat.toObject());
        res.render('home/category', { title: 'category', categories: categories});

    });
});

router.get('/single-product/:id', async (req, res,next) => {
    const [dbProducts, dbProduct] = await Promise.all([
        Product.find({}),
        Product.findById(req.params.id).populate('category'),
    ]);
    res.render('home/single-product', {title: 'edit', product: dbProduct.toObject(), products:dbProducts.map (p => p.toObject())});

});


router.get('/category-books/:id', function(req, res, next) {
    Product.find({ category: req.params.id }).populate('category').then((dbProduct) => {
        products = dbProduct.map(pro => pro.toObject());
        Category.find({}).then((dbCategory) => {
            categories = dbCategory.map(cat=>cat.toObject());
        res.render('home/category-books', { title: 'category-books',layout:'home', products:products ,categories:categories });
    });
    });
});

router.post('/wishlist/add/:productId', async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_message', 'Vui lòng đăng nhập để thêm vào wishlist');
        return res.redirect('back');
    }

    let customerId = req.user._id;
    let productId = req.params.productId;
    const customer = await Customer.findById(customerId);

    if (customer.wishlist.includes(productId)) {
        req.flash('error_message', 'Sản phẩm đã có trong wishlist');
        return res.redirect('back');
    }

    Customer.findByIdAndUpdate(customerId, {
        $addToSet: { wishlist: productId }
    }).then(() => {
        req.flash('success_message', 'Đã thêm vào wishlist');
        res.redirect('back');
    });
});

router.post('/wishlist/remove/:productId', (req, res) => {
    let customerId = req.user._id;
    let productId =req.params.productId;
    Customer.findByIdAndUpdate(customerId, {
        $pull: { wishlist: productId }
    }).then(() =>{
        req.flash('success_message', 'Đã xóa khỏi wishlist');
        res.redirect('back');
    });
});



router.get('/login', function(req, res, next) {
    res.render('home/login', { title: 'login'});
});

//APP LOGIN
passport.use('customer-local',new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
    Customer.findOne({email: email}).then(user => {
        if (!user)
            return done(null, false, {message: 'Wrong email!'});

        bcryptjs.compare(password, user.password, (err, matched) => {
            if (err) return err;
            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Wrong password'});
            }
        });

    });
}));
router.post('/login', (req, res, next) => {
    let errors = [];
    if (!req.body.email) {
        errors.push({message: 'E-mail is required'});
    }
    if (!req.body.password) {
        errors.push({message: 'Password is required'});
    }
    if (errors.length > 0) {
        res.render('home/login', {
            title: 'Login',
            errors: errors,
            email: req.body.email,
            password: req.body.password,
        });
    } else {
        passport.authenticate('customer-local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }
});


router.get('/register', function(req, res, next) {
    res.render('home/register', { title: 'register'});
});
router.post('/register', (req, res, next) => {

    let errors = [];
    if (!req.body.firstName) {
        errors.push({message: 'First name is required '});
    }
    if (!req.body.lastName) {
        errors.push({message: 'Last name is required'});
    }
    if (!req.body.email) {
        errors.push({message: 'E-mail is required'});
    }
    if (!req.body.password) {
        errors.push({message: 'Password is required'});
    }
    if(req.body.password != req.body.confirmPassword) {
        errors.push({message: 'Password is not match'});
    }
    if (errors.length > 0) {
        res.render('home/register', {
            title: 'Register',
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });
    } else {
        Customer.findOne({email: req.body.email}).then((user) => {
            if (!user) {
                const newCustomer = new Customer({
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                });
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(newCustomer.password, salt, (err, hash) => {
                        newCustomer.password = hash;
                        newCustomer.save().then(saveUser => {
                            req.flash('success_message', 'Successfully registered!');
                            res.redirect('/login');//or /login
                        });
                    })
                })
            } else {
                req.flash('error_message', 'E-mail is exist!');
                res.redirect('/login');
            }

        });

    }
});

router.get('/forgot-password', function(req, res, next) {
    res.render('home/forgot-password', {title: 'forgot-password'}) ;
});
router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return res.status(500).send(err); // Handle the error appropriately
        }
        res.redirect('/'); // Redirect after logout
    });

});




module.exports = router;
