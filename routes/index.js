var conn = require('./../inc/db');
var express = require('express');
var router = express.Router();
var menus = require('./../inc/menus')
var reservations = require('./../inc/reservations')
var contacts = require('./../inc/contacts')
var subscribe = require('./../inc/subscribe')




module.exports = function(io){

  /* GET home page. */
  router.get('/', function(req, res, next) {

    menus.getMenus().then(results=>{

      res.render('index', {
        title: 'Restaurante Saboroso!',
        menus: results,
        isHome: true
      });

    }).catch(err=>{

      console.error(err);

    });
    
  });

  router.get('/contacts', function(req, res, next){

    contacts.render(req, res);
    
  });

  router.post('/contacts', function(req, res, next){

    if(!req.body.name){
      contacts.render(req, res, "Coloque seu nome");
    } else if (!req.body.email){
      contacts.render(req, res, "Coloque seu email");
    } else if (!req.body.message){
      contacts.render(req, res, "Coloque sua mensagem");
    } else {

      contacts.save(req.body).then(results=>{

        req.body = {};

        io.emit('dashboard update');

        contacts.render(req, res, null, "Mensagem enviada com sucesso!");

      }).catch(err=>{

        contacts.render(req, res, err.message);

      });

    }
    
  });

  router.get('/reservations', function(req, res, next){

    reservations.render(req, res);

  });

  router.post('/reservations', function(req, res, next){
  
    if(!req.body.name){
      reservations.render(req, res, 'coloque nome');
    }else if(!req.body.email){
      reservations.render(req, res, 'coloque email');
    }else if(!req.body.people){
      reservations.render(req, res, 'coloque pessoas');
    }else if(!req.body.date){
      reservations.render(req, res, 'coloque data');
    }else if(!req.body.time){
      reservations.render(req, res, 'coloque hora');
    } else {

      reservations.save(req.body).then(results =>{

        req.body = {};

        io.emit('dashboard update');

        reservations.render(req, res, null, "Reserva realizada com sucesso");      

      }).catch(err=>{

        reservations.render(req, res, err.message);

      });

    }

  });

  router.get('/menus', function(req, res, next){

    menus.getMenus().then(results=>{

      res.render('menus',{
        title: 'Menus - Restaurante Saboroso!',
        background: 'images/img_bg_1.jpg',
        h1: 'Saboreie nosso menu!',
        menus: results,
      });

    }).catch(err=>{

      console.error(err);

    });
    
  });

  router.get('/services', function(req, res, next){
    res.render('services',{
      title: 'Serviços - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'É um prazer poder servir!'
    });
  });

  //subscribe
  router.post('/subscribe', function(req, res, next){

    subscribe.save(req.body).then(result=>{

      menus.getMenus().then(menuResults=>{

        subscribe.render(req, res, null, 'Email cadastrado com sucesso!', menuResults);
    
      }).catch(err=>{
    
        console.error(err);
    
      });
      

    }).catch(err=>{

        console.error(err)
      
    })

  })

  return router;

};
