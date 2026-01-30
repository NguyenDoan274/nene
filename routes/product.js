var express = require('express');
const Product = require('../models/Product');
const Employee = require("../models/Employee");
const Category = require("../models/Category");
var router = express.Router();

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user instanceof Employee) {
        return next();
    } else {
        res.redirect('/admin/login');
    }
}

router.all('/*',useAuthenticated ,(req, res, next) => {
    res.app.locals.layout = 'admin'; // Set layout for admin pages
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find({}).populate('category').then((dbProduct) => {
        products = dbProduct.map(pro=>pro.toObject());
        res.render('admin/product/list', {products: products});
    });

});

router.get('/create', function(req, res, next) {
    Category.find({}).then((dbCategory) => {
        categories = dbCategory.map(cat=>cat.toObject());
        res.render('admin/product/create', { title: 'create', categories: categories });
    });

});
router.post('/create', function(req, res, next) {
    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        quantity: req.body.quantity,
        author: req.body.author,
        description: req.body.description,
        category: req.body.categoryId,
    });
    newProduct.save().then(savedProduct => {
        res.redirect('/admin/product');
    });

})
router.get('/edit/:id', function(req, res, next) {
    Product.findOne({ _id: req.params.id }).then((product) => {
        Category.find({}).then((dbCategory) => {
            categories = dbCategory.map(cat=>cat.toObject());
            res.render('admin/product/edit', { title: 'edit', product: product.toObject(), categories: categories });
        });

    });

});
router.put('/edit/:id', function(req, res, next) {
    Product.findOne({ _id: req.params.id }).then((product) => {
        product.name = req.body.name;
        product.image = req.body.image;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.author = req.body.author;
        product.description = req.body.description;
        product.category = req.body.categoryId;
        product.save().then(savedProduct => {
            res.redirect('/admin/product');
        });
    });
});
router.delete('/:id', function(req, res, next) {
    Product.deleteOne({ _id: req.params.id }).then((deleteProduct) => {
        res.redirect('/admin/product');
    });
});
module.exports = router;
