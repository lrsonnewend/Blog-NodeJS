const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias") //passando referencia do model para uma variável


router.get("/", (req, res) => {
    res.render("admin/index");
})

router.get("/posts", (req, res) => {
    res.send("Página de posts");
})

router.get("/categorias", (req, res) => {
    Categoria.find().sort({data:"desc"}).then((categorias) =>{ //listando categorias existentes
        res.render("admin/categorias", {categorias: categorias});
    }).catch((erro) =>{
        req.flash("erro_msg:", "houve um erro")
        res.redirect("/admin");
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addCategoria")
})

router.post("/categorias/nova", (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido." });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido." });
    }

    if (erros.length > 0) {
        res.render("admin/addCategoria", { erros: erros })
    }

    else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "categoria criada com sucesso.");
            res.redirect("/admin/categorias");
        }).catch((erro) => {
            req.flash("erro_msg", "erro ao salvar categoria.");
            res.redirect("/admin");
        })
    }
})

router.get("/categorias/edit/:id", (req, res) =>{
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render("admin/editCategoria", {categoria:categoria});
    }).catch((erro) =>{
        req.flash("erro_msg", "categoria não encontrada.");
        res.redirect("/admin/categorias");
    })
})

router.post("/categorias/edit", (req, res) =>{
    Categoria.findOne({_id: req.body.id}).then((categoria) =>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        var erros = [];

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Nome inválido." });
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Slug inválido." });
        }

        if (erros.length > 0) {
            res.render("admin/addCategoria", { erros: erros })
        }

        else{
        categoria.save().then(() =>{
            req.flash("success_msg", "editada com sucesso.");
            res.redirect("/admin/categorias");  
        }).catch((erro) =>{
            req.flash("erro_msg", "erro ao salvar categoria editada.");
            res.redirect("/admin/categorias");
        })
    }

    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao editar");
        res.redirect("/admin/categorias");
    })

})

router.post("/categorias/deletar", (req, res) =>{
    Categoria.remove({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "categoria deletada.");
        res.redirect("/admin/categorias");
    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao deletar categoria");
        res.redirect("/admin/categorias");
    })
})

router.get("/postagens", (req, res) =>{
    res.render("admin/postagens");
})

router.get("/postagens/add", (req, res) =>{
    Categoria.find().then((categorias) =>{
        res.render("admin/addPostagem", {categorias: categorias});
    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao cadastrar postagem.");
        res.redirect("/admin");
    })
})

module.exports = router;