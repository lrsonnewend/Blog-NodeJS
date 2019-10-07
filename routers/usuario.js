//Carregando módulos
    const express = require("express");
    const router = express.Router();
    const mongoose = require("mongoose");
    require("../models/Usuario");
    const Usuario = mongoose.model("usuarios");
    const bcp  = require("bcryptjs");
    const passport = require("passport");


//Rotas

    router.get("/registro", (req, res) =>{
        res.render("usuarios/registro");
    })

    router.post("/registro", (req, res) =>{
        var erros = []
        
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido."});
        }

        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "Email inválido."});
        }

        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: "Senha inválida."});
        }

        if(req.body.senha.length < 5){
            erros.push({texto: "Senha fraca."});
        }

        if(req.body.senha != req.body.senha2){
            erros.push({texto: "As senhas são diferentes."});
        }

        if(erros.length > 0){
            res.render("usuarios/registro", {erros: erros});
        }else{
            Usuario.findOne({email: req.body.email}).then((usuario) =>{
                if(usuario){
                    req.flash("erro_msg", "Email já cadastrado.");
                    res.redirect("/usuarios/registro");
                }else{
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    })

                    //Encriptando senha (hash)
                        bcp.genSalt(10, (erro, salt) =>{
                            bcp.hash(novoUsuario.senha,salt, (erro, hash) =>{
                                if(erro){
                                    req.flash("erro_msg", "erro ao salvar usuario.");
                                    res.redirect(" /usuarios/registro");
                                }

                                novoUsuario.senha = hash;
                                novoUsuario.save().then(() =>{
                                    req.flash("success_msg", "usuario cadastrado.");
                                    res.redirect("/");
                                }).catch((erro) =>{
                                    req.flash("erro_msg", "erro ao cadastrar usuário.");
                                    res.redirect("/usuarios/registro");
                                })
                            })
                        })
                }
            }).catch((erro) =>{
                req.flash("erro_msg", "erro interno.");
                res.redirect("/");
            })
        }
    })

    router.get("/login", (req, res) =>{
        res.render("usuarios/login");
    })

    router.post("/login", (req, res, next) =>{
        passport.authenticate("local", {
            successRedirect:  "/", //caminho a redirecionar caso autenticação tenha sucesso 
            failureRedirect: "/usuarios/login", //caminho a redirecionar caso autenticação falhe 
            failureFlash: true //habilitando mensagens flash
        })(req, res, next)
    })

    router.get("/logout", (req, res) =>{
        req.logout();
        req.flash("success_msg", "logout realizado.");
        res.redirect("/");
    })

module.exports = router;