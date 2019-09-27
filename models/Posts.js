const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId, //armazena um id de uma categoria
        ref: "categorias",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", Posts);