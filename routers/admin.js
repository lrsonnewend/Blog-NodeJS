const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias") //passando referencia do model para uma variável


router.get("/", (req, res) =>{
    res.render("admin/index");
})

router.get("/posts", (req, res) =>{
    res.send("Página de posts");
})

router.get("/categorias", (req, res) =>{
    res.render("admin/categorias");
})

router.get("/categorias/add", (req, res) =>{
    res.render("admin/addCategoria")
})

router.post("/categorias/nova", (req, res) =>{
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() =>{
        console.log("categoria salva");
    }).catch((erro) =>{
        console.log("erro ao salvar categoria."+erro);
    })
})

module.exports = router;