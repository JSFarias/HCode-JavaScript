var conn = require('./../inc/db')
var express = require('express')
var router = express.Router()
var users = require('./../inc/users')
var admin = require('./../inc/admin')
var menus = require('./../inc/menus')
var reservations = require('./../inc/reservations')
var contacts = require('./../inc/contacts')
var emails = require('./../inc/emails')
var moment = require('moment')



module.exports = function(io){

    moment.locale('pt-BR');

    //middleware
    router.use(function(req, res, next){

        if(['/login'].indexOf(req.url) === -1 && !req.session.user)
            res.redirect('/admin/login');
        else
            next();

    });


    //logout
    router.get('/logout', function(req, res, next){

        delete req.session.user;
        res.redirect('/admin/login');

    });

    //home
    router.get('/', function(req, res, next){

        admin.dashboard().then(data=>{
            res.render('admin/index', admin.getParams(req, {
                data 
            }));
        }).catch(err=>{

            console.error(err);

        });
        
    });

    router.get('/dashboard', function(req, res, next){

        reservations.dashboard().then(data=>{
            res.send(data);
        }).catch(err=>{
            console.error(err);
        })

    })


    //login
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


    //contacts
    router.get('/contacts', function(req, res, next){
        contacts.getContacts().then(data=>{
            res.render('admin/contacts',admin.getParams(req, {
                data
            }));
        }).catch(err=>{
            console.log(err)
        });    
    });

    router.delete('/contacts/:id', function(req, res, next){
        contacts.delete(req.params.id).then(results=>{
            
            io.emit('dashboard update');
            res.send(results)
            
        }).catch(err=>{
            res.send(err)
        });
    });


    //emails
    router.get('/emails', function(req, res, next){

        emails.getEmails().then(data=>{
            res.render('admin/emails',admin.getParams(req, {data}));
        }).catch(err=>{
            res.send(err);
        });
        
    });

    router.delete('/emails/:id', function(req, res, next){

        emails.delete(req.params.id).then(result=>{

            io.emit('dashboard update');
            res.send(result);
            
        }).catch(err=>{
            res.send(err);
        });

    })


    //menus
    router.get('/menus', function(req, res, next){

        menus.getMenus().then(data=>{

            res.render('admin/menus',admin.getParams(req,{
                data
            }));

        }).catch(err=>{
            console.error(err);
        });    

    });

    router.post('/menus', function(req, res, next){

        menus.save(req.fields, req.files).then(results=>{

            io.emit('dashboard update');
            res.send(results);
            
        }).catch(err=>{
            res.send(err);
        });

    });

    router.delete('/menus/:id', function(req, res, next){

        menus.delete(req.params.id).then(results=>{

            io.emit('dashboard update');
            res.send(results);            

        }).catch(err=>{

            res.send(err);
            
        });

    });


    //reservations
    router.get('/reservations', function(req, res, next){
        
        reservations.getReservations(req).then(pag=>{

                res.render('admin/reservations', admin.getParams(req, {
                    date: {
                        start: req.query.start,
                        end: req.query.end
                    }, 
                    data: pag.data,
                    moment,
                    links: pag.links
                }));
                
        });    
        
    });

    router.get('/reservations/chart', function(req, res, next){

        req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

        reservations.chart(req).then(chartData=>{
            res.send(chartData);
        }).catch(err=>{
            console.log('ERR***', err)
        })

    });

    router.post('/reservations', function(req, res, next){

        reservations.save(req.body).then(results=>{

            io.emit('dashboard update');
            res.send(results);
            
        }).catch(err=>{
            res.send(err);
        });
        
    });

    router.delete('/reservations/:id', function(req, res, next){

        reservations.delete(req.params.id).then(results=>{

            io.emit('dashboard update');
            res.send(results);
            
        }).catch(err=>{
            res.send(err);
        });
        
    });



    //users
    router.get('/users', function(req, res, next){

        users.getUsers().then(data=>{
            res.render('admin/users', admin.getParams(req, {data}));
        });
        
    });

    router.post('/users', function(req, res, next){

        users.save(req.fields).then(results=>{

            io.emit('dashboard update');
            res.send(results);
            
        }).catch(err=>{
            res.send(err);
        });

    });

    router.post('/users/password-change', function(req, res, next){

        users.changePassword(req.fields).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({
                error: err
            });
        });

    });

    router.delete('/users/:id', function(req, res, next){

        users.delete(req.params.id).then(results=>{

            io.emit('dashboard update');
            res.send(results);
            
        }).catch(err=>{
            res,send(err);
        });

    });

    return router;
}

