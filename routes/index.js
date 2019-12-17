var conn = require('./../inc/db');
var express = require('express');
var router = express.Router();
var menus = require('./../inc/menus')
var reservations = require('./../inc/reservations')

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
  res.render('contacts',{
    title: 'Contatos - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1: 'Diga um oi!'
  });
  
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
    res.send(req.body);
  }

  

});

router.get('/services', function(req, res, next){
  res.render('services',{
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});


module.exports = router;
