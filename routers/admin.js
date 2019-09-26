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
    res.render("admin/categorias");
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

module.exports = router;