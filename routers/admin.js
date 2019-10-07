const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias") //passando referencia do model para uma variável
require("../models/Posts");
const Postagem = mongoose.model("postagens")
const {isAdmin} = require("../helpers//isAdmin");

router.get("/", isAdmin, (req, res) => {
    res.render("admin/index");
})

router.get("/sobre", (req, res) =>{
    res.render("sobre/about")
})

router.get("/posts", isAdmin, (req, res) => {
    res.send("Página de posts");
})

router.get("/categorias", isAdmin, (req, res) => {
    Categoria.find().sort({data:"desc"}).then((categorias) =>{ //listando categorias existentes
        res.render("admin/categorias", {categorias: categorias});
    }).catch((erro) =>{
        req.flash("erro_msg:", "houve um erro")
        res.redirect("/admin");
    })
})

router.get("/categorias/add",isAdmin, (req, res) => {
    res.render("admin/addCategoria")
})

router.post("/categorias/nova", isAdmin, (req, res) => {

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

router.get("/categorias/edit/:id", isAdmin, (req, res) =>{
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render("admin/editCategoria", {categoria:categoria});
    }).catch((erro) =>{
        req.flash("erro_msg", "categoria não encontrada.");
        res.redirect("/admin/categorias");
    })
})

router.post("/categorias/edit", isAdmin, (req, res) =>{
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

router.post("/categorias/deletar", isAdmin, (req, res) =>{
    Categoria.remove({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "categoria deletada.");
        res.redirect("/admin/categorias");
    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao deletar categoria");
        res.redirect("/admin/categorias");
    })
})

router.get("/postagens", isAdmin, (req, res) =>{
    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) =>{
        res.render("admin/postagens", {postagens: postagens});
    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao listar postagens.");
        res.redirect("/admin")
    })
})

router.get("/postagens/add", isAdmin, (req, res) =>{
    Categoria.find().then((categorias) =>{
        res.render("admin/addPostagem", {categorias: categorias});
    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao cadastrar postagem.");
        res.redirect("/admin");
    })
})

router.post("/postagens/nova", isAdmin, (req, res) =>{
    var erros = [];

    if(req.body.categoria == 0){
        erros.push({texto: "categoria inválida."});
    }

    if(erros.length > 0){
        res.render("admin/addPostagem", {erros: erros})
    }else{
        const novoPost = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novoPost).save().then(() =>{
            req.flash("success_msg", "postagem criada.");
            res.redirect("/admin/postagens");
        }).catch((erro) =>{
            req.flash("erro_msg", "erro ao salvar postagem.");
            res.redirect("/admin/postagens");
        })
    }
})

router.get("/postagens/edit/:id", isAdmin, (req, res) =>{
    Postagem.findOne({_id:req.params.id}).then((postagem) =>{
        Categoria.find().then((categorias) =>{
            res.render("admin/editPost", {categorias: categorias, postagem: postagem});

        }).catch((erro) =>{
            req.flash("erro_msg", "erro ao listar categoria.");
            res.redirect("/admin/postagens");
        })
    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao editar postagem.");
        res.redirect("/admin/postagens");
    })
})

router.post("/postagens/edit", isAdmin, (req, res) =>{
    Postagem.findOne({_id:req.body.id}).then((postagem) =>{
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() =>{
            req.flash("success_msg", "postagem editada.");
            res.redirect("/admin/postagens");
        }).catch((erro) =>{
            req.flash("erro_msg", "erro interno");
            res.redirect("/admin/postagens");
        })

    }).catch((erro) =>{
        req.flash("erro_msg", "erro ao salvar postagem editada.");
        res.redirect("/admin/postagens");
    })
})

router.get("/postagens/deletar/:id", isAdmin, (req, res) =>{
    Postagem.remove({_id: req.params.id}).then(() =>{
        req.flash("success_msg", "postagem deletada.");
        res.redirect("/admin/postagens");
    }).catch((erro) =>{
        req.flash("erro_msg", "erro interno.");
        res.redirect("/admin/postagens")
    })
})

module.exports = router;