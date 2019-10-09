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
    require("./models/Posts");
    const Postagem = mongoose.model("postagens");
    require("./models/Categoria");
    const Categoria = mongoose.model("categorias");
    const usuarios = require("./routers/usuario");
    const passport = require("passport");
    require("./config/autent")(passport);
    const db = require("./config/db");

//Configurações    
    //Sessao
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        
    //passport
        app.use(passport.initialize());
        app.use(passport.session());
    
    //flash
        app.use(flash());
    
    //Middleware
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg"); //criando variável global
            res.locals.erro_msg = req.flash("erro_msg"); //criando variável global
            res.locals.error = req.flash("error"); //criando variável global
            res.locals.user = req.user || null; //armazena os dados do usuário autenticado
            //req.user  -> passport cria automaticamente. É usado para armazenas dados do usuário que estará logado.
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
        mongoose.connect(db.mongoURI).then(() =>{
            console.log("conectado ao mongo");
        }).catch((erro) =>{
            console.log("erro na conexao: "+erro);
        })

    //Public
        app.use(express.static(path.join(__dirname,"public")));

//Rotas
    app.get("/", (req, res) =>{
        Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) =>{
            res.render("index", {postagens: postagens});
        }).catch((erro) =>{
            req.flash("erro_msg", "erro interno.");
            res.redirect("/404");
        })
    })

    app.get("/categorias", (req, res) =>{
        Categoria.find().then((categorias) =>{
            res.render("categorias/indexCateg", {categorias: categorias});
        }).catch((erro) =>{
            req.flash("erro_msg", "erro ao listar categorias.");
            res.redirect("/");
        })
    })

    app.get("/categorias/:slug", (req, res) =>{
        Categoria.findOne({slug:req.params.slug}).then((categoria) =>{
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens) =>{
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                }).catch((erro) =>{
                    req.flash("erro_msg", "erro ao listar posts.");
                    res.redirect("/categorias");
                })
            }            
            else{
                req.flash("erro_msg", "categoria nao existe.");
                res.redirect("/categorias");
            }

        }).catch((erro) =>{
            req.flash("erro_msg", "erro interno.");
            res.redirect("/categorias");
        })
    })
    

    app.get("/404", (req, res) =>{
        res.send("erro 404");
    })

    app.get("/postagem/:slug", (req, res) =>{
        Postagem.findOne({slug: req.params.slug}).then((postagem) =>{
            if(postagem){
                res.render("./postagem/indexPost", {postagem: postagem});
            }else{
                req.flash("erro_msg", "postagem não existe.");
                res.redirect("/");

            }
        }).catch((erro) =>{
            req.flash("erro_msg", "erro interno.");
            res.redirect("/");
        })
    })
    
    app.use("/admin", admin);
    app.use("/usuarios", usuarios);



//Outros
    //configurando servidor
    
        const porta = process.env.porta || 8081; //configurando variável de ambiente do node para o heroku
        app.listen(porta, () =>{
            console.log("servidor conectado.")
        })