//Carregando módulos
    const express = require("express");
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    //const mongoose = require("mongoose");
    const app = express();

//Configurações
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    
    //Handlebars
        app.engine("handlebars", handlebars({defaultLayout: "main"}));
        app.set("view engine", "handlebars");

    //Mongoose



//Rotas


//Outros
    const porta = 8081;
    app.listen(porta, () =>{
        console.log("servidor conectado.")
    })