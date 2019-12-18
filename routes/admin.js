var conn = require('./../inc/db')
var express = require('express')
var router = express.Router()
var users = require('./../inc/users')


//middleware
router.use(function(req, res, next){

    if(['/login'].indexOf(req.url) === -1 && !req.session.user)
        res.redirect('/admin/login');
    else
        next();

});

router.get('/logout', function(req, res, next){

    delete req.session.user;
    res.redirect('/admin/login');

});

router.get('/', function(req, res, next){
    res.render('admin/index', {
        activeUrl: req.url
    });
});
router.get('/index', function(req, res, next){
    res.render('admin/index', {
        activeUrl: req.url
    });
});

router.get('/login', function(req, res, next){    
    users.render(req, res, null);
});

router.post('/login', function(req, res, next){

    if(!req.body.email)
        users.render(req, res, "Insira email");
    else if(!req.body.password)
        users.render(req, res, "Insira senha");
    else{

        users.login(req.body.email, req.body.password).then(user=>{

            req.session.user = user;
            res.redirect("/admin");

        }).catch(err=>{
            
            users.render(req, res, err.message);

        });

    }

});

router.get('/contacts', function(req, res, next){
    res.render('admin/contacts',{
        activeUrl: req.url
    });
});

router.get('/emails', function(req, res, next){
    res.render('admin/emails',{
        activeUrl: req.url
    });
});

router.get('/menus', function(req, res, next){
    res.render('admin/menus',{
        activeUrl: req.url
    });
});

router.get('/reservations', function(req, res, next){
    res.render('admin/reservations', {
        date:{},
        activeUrl: req.url
    });
});

router.get('/users', function(req, res, next){
    res.render('admin/users',{
        activeUrl: req.url
    });
});

module.exports = router;
