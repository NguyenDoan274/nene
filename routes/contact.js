var express = require('express');
const Contact = require('../models/Contact');
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
    Contact.find({}).then((dbContact) => {
        contacts = dbContact.map(cat=>cat.toObject());
        res.render('admin/contact/list', {contacts: contacts});
    });

});

router.get('/create', function(req, res, next) {
    res.render('admin/contact/create', { title: 'create' });
});
router.post('/create', function(req, res, next) {
    const newContact = new Contact({
       country : req.body.country,
        address : req.body.address,
        phone : req.body.phone,
        email : req.body.email,
    });
    newContact.save().then(savedContact => {
        res.redirect('/admin/contact');
    });

})
router.get('/edit/:id', function(req, res, next) {
    Contact.findOne({ _id: req.params.id }).then((contact) => {
        res.render('admin/contact/edit', { title: 'edit', contact: contact.toObject() });
    });

});
router.put('/edit/:id', function(req, res, next) {
    Contact.findOne({ _id: req.params.id }).then((contact) => {
       contact.country = req.body.country,
           contact.address = req.body.address,
           contact.phone = req.body.phone,
           contact.email = req.body.email,
        contact.save().then(savedContact => {
            res.redirect('/admin/contact');
        });
    });
});
router.delete('/:id', function(req, res, next) {
    Contact.deleteOne({ _id: req.params.id }).then((deleteContact) => {
        res.redirect('/admin/contact');
    });
});
module.exports = router;
