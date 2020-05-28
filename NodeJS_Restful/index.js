const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

let app = express();

app.use(bodyParser.urlencoded({extanded: false}));
app.use(bodyParser.json());
app.use(expressValidator());

consign()
    .include('routes')
    .include('utils')
    .into(app); //aqui ele JÁ PASSA 'app' para os arquivos em /routes

app.listen(3000, '127.0.0.1', () =>{
    console.log('servidor rodando!');
});