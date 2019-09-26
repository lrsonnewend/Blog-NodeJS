//Carregando módulos
    const express = require("express");
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    const mongoose = require("mongoose");
    const app = express();
    const admin = require("./routers/admin");
    const path = require("path");
    const session = require("express-session");
    const flash = require("connect-flash");
//Configurações    
    //Sessao
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        })) //criando middleares
        app.use(flash())
    
    //Middleware
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg"); //criando variável global
            res.locals.erro_msg = req.flash("erro_msg"); //criando variável global
            next(); //passa a requisição adiante
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    
    //Handlebars
        app.engine("handlebars", handlebars({defaultLayout: "main"}));
        app.set("view engine", "handlebars");

    //Mongoose
    mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/posts").then(() =>{
            console.log("conectado ao mongo");
        }).catch((erro) =>{
            console.log("erro na conexao: "+erro);
        })

    //Public
        app.use(express.static(path.join(__dirname,"public")));

//Rotas
    app.use("/admin", admin);



//Outros
    const porta = 8081;
    app.listen(porta, () =>{
        console.log("servidor conectado.")
    })