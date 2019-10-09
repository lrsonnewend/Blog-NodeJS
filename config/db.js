//arquivo para monitorar o tipo de conexão
//quando for pelo heroku ou local

if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI: "mongodb+srv://blogdb:<password>@clusterblog-xqpbz.mongodb.net/test?retryWrites=true&w=majority"
    }
}

else{
    module.exports = {
        mongoURI: "mongodb://localhost/posts"
    }
}
