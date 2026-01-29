var express = require('express');
const Category = require('../models/Category');
const Employee = require("../models/Employee");
var router = express.Router();

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user instanceof Employee) {
        return next();
    } else {
        res.redirect('/admin/login');
    }
}

router.all('/*',useAuthenticated, (req, res, next) => {
    res.app.locals.layout = 'admin'; // Set layout for admin pages
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
    Category.find({}).then((dbCategory) => {
        categories = dbCategory.map(cat=>cat.toObject());
        res.render('admin/category/list', {categories: categories});
    });

});

router.get('/create', function(req, res, next) {
    res.render('admin/category/create', { title: 'create' });
});
router.post('/create', function(req, res, next) {
    const newCategory = new Category({
        name: req.body.name,
        image: req.body.image,
        status: req.body.status,
    });
    newCategory.save().then(savedCategory => {
        res.redirect('/admin/category');
    });

})
router.get('/edit/:id', function(req, res, next) {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render('admin/category/edit', { title: 'edit', category: category.toObject() });
    });

});
router.put('/edit/:id', function(req, res, next) {
    Category.findOne({ _id: req.params.id }).then((category) => {
        category.name = req.body.name;
        category.image = req.body.image;
        category.status = req.body.status;
        category.save().then(savedCategory => {
             res.redirect('/admin/category');
        });
    });
});
router.delete('/:id', function(req, res, next) {
    Category.deleteOne({ _id: req.params.id }).then((deleteCategory) => {
        res.redirect('/admin/category');
    });
});
module.exports = router;
