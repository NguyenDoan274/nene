    var express = require('express');
    const Employee = require("../models/Employee");
    const bcryptjs = require("bcryptjs");
    const createError = require("http-errors");
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;

    var router = express.Router();
    router.get('/forgot-password', function(req, res, next) {
        res.render('admin/forgot-password', {title: 'forgot-password', layout : false}) ;
    });

    router.get('/login', function(req, res, next) {

        res.render('admin/login', { title: 'login', layout: false });
    });

    //APP LOGIN
    passport.use('local',new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
        Employee.findOne({email: email}).then(admin => {
            if (!admin)
                return done(null, false, {message: 'Wrong email'});
            bcryptjs.compare(password, admin.password, (err, matched) => {
                if (err) return err;
                if (matched) {

                    return done(null, admin);
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
            res.render('admin/login', {
                title: 'Login',
                errors: errors,
                layout : false,
                email: req.body.email,
                password: req.body.password,
            });
        } else {
            passport.authenticate('local', {
                successRedirect: '/admin',
                failureRedirect: '/admin/login',
                failureFlash: true
            })(req, res, next);
        }
    });



    router.get('/register', function(req, res, next) {
        res.render('admin/register', {title: 'register', layout : false}) ;
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
            res.render('admin/register', {
                title: 'Register',
                errors: errors,
                layout : false,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
            });
        } else {
            Employee.findOne({email: req.body.email}).then((user) => {
                if (!user) {
                    const newEmployee = new Employee({
                        email: req.body.email,
                        password: req.body.password,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    });
                    bcryptjs.genSalt(10, function (err, salt) {
                        bcryptjs.hash(newEmployee.password, salt, (err, hash) => {
                            newEmployee.password = hash;
                            newEmployee.save().then(saveUser => {
                                req.flash('success_message', 'Successfully registered!');
                                res.redirect('/admin/login');//or /login
                            });
                        })
                    })
                } else {
                    req.flash('error_message', 'E-mail is exist!');
                    res.redirect('/admin/login');
                }

            });

        }
    });

    function useAuthenticated(req, res, next) {
        if (req.isAuthenticated() && req.user instanceof Employee) {
            return next(); // Proceed if authenticated
        } else {
            res.redirect('/admin/login'); // Redirect to login if authentication fails
        }
    }
    router.get('/logout', (req, res) => {
        req.logOut((err) => {
            if (err) {
                return res.status(500).send(err); // Handle the error appropriately
            }
            res.redirect('/');  // Redirect after logout
        });

    })
    router.all('/*',useAuthenticated ,(req, res, next) => {
        res.app.locals.layout = 'admin'; // Set layout for admin pages
        next();
    });

    /* GET home page. */
    router.get('/',function(req, res, next) {

        res.render('admin/index', { title: 'Admin' });
    });



    router.get('/cards', function(req, res, next) {
        res.render('admin/cards', {title: 'cards'}) ;
    });

    router.get('/blank', function(req, res, next) {
        res.render('admin/blank', {title: 'blank'}) ;
    });

    router.get('/charts', function(req, res, next) {
        res.render('admin/charts', {title: 'charts'}) ;
    });


    // router.post('/login', (req, res) => {
    //     Employee.findOne({email: req.body.email}).then((user) => {
    //         if (user) {
    //             bcryptjs.compare(req.body.password,user.password,(err,matched)=>{
    //                 if(err) return err;
    //                 if(matched){
    //                     isLoggedIn=true;
    //                    return res.render('admin/index', {title: 'Admin'}) ;
    //                 }else {
    //                    //return res.send("Password is incorrect");
    //                   return res.render('admin/error', {title: 'Login error', message: 'Password is incorrect' , layout: false} );
    //                 }
    //             })
    //         }
    //         else
    //         {
    //            return res.render('admin/error', {title: 'Login error', message: 'Email is invalid' , layout: false} );
    //         }
    //     })
    // });


    router.get('/navbar', function(req, res, next) {
        res.render('admin/navbar', {title: 'navbar'}) ;
    });




    // router.post('/register',  (req,res) => {
    //         const newUser = new Employee();
    //         newUser.firstName = req.body.firstName;
    //         newUser.lastName= req.body.lastName;
    //         newUser.email = req.body.email;
    //         newUser.password = req.body.password;
    //         var confirmPassword = req.body.confirmPassword;
    //         if (newUser.password.trim() =="") {
    //             return  res.render('admin/error', {title: 'Register error', message: 'Password is null',layout: false}) ;
    //         }
    //         else if(newUser.password.length < 5) {
    //             return  res.render('admin/error', {title: 'Register error', message: 'Password needs at least 5 character!',layout: false}) ;
    //         }
    //         if (newUser.password != confirmPassword) {
    //            return  res.render('admin/error', {title: 'Register error', message: 'Password does not match',layout: false}) ;
    //         }
    //         bcryptjs.genSalt(10, function (err, salt) {
    //             bcryptjs.hash(newUser.password, salt, function (err, hash) {
    //                 if (err) {return  err}
    //                 newUser.password = hash;
    //                 newUser.save().then(userSave=>
    //                 {
    //                   return  res.render('admin/login', {title: 'login',layout: false}) ;
    //                 }).catch(err => {
    //                    //return res.send();
    //                     return res.render('admin/error', {title: 'Register error', message: 'USER ERROR'+err,layout: false}) ;
    //                 });
    //             });
    //         });
    //     }
    // );


    router.get('/tables', function(req, res, next) {
        res.render('admin/tables', {title: 'tables'}) ;
    });


    router.get('/test', function(req, res, next) {
        res.render('admin/test', {title: 'test'}) ;
    });
    module.exports = router;
