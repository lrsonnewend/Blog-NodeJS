const localStrategy = require("passport-local");
const mongoose = require("mongoose");
const bcp = require("bcryptjs");

//Model de usuário
    require("../models/Usuario");
    const Usuario = mongoose.model("usuarios");

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: "email", passwordField: "senha"}, (email, senha, done)=>{
        Usuario.findOne({email: email}).then((usuario) =>{
            if(!usuario){
                return done(null, false, {message:"Esta conta não existe."});
            }
            bcp.compare(senha, usuario.senha, (erro, check) =>{ //comparando valores encriptados 
                if(check){
                    return done(null, usuario);
                }
                else{
                    return done(null, false, {message: "senha incorreta."});
                }
            }) 
        })
    }))

    //salvando dados de um usuário em uma sessão
        passport.serializeUser((usuario, done) =>{
            done(null, usuario.id)
        })
    
    //procurando usuario pelo id
        passport.deserializeUser((id, done) =>{
            Usuario.findById(id, (erro, usuario) =>{
                done(erro, usuario);
            })
        })

}