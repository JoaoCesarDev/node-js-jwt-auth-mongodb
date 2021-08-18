const express = require('express');
const bodyParser = require('body-parser');
//const cors = require('cors');
const dbConfig = require("./Config/config.db");
const app = express();

/*var corsOptions = {
    origin:"*"
};*/

//app.use(cors(corsOptions)); 

app.use(express.json());

app.use(express.urlencoded({extended: true}));



const db = require("./models");
const Role = db.role;

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Conectado com Sucesso ao MongoDB.");
    initial();
  })
.catch(err=>{
    console.error("Erro de Conexão",err);
    process.exit();
});

app.get("/",(req,res)=>{
    res.json({message:"Well Come To JCRF app."});
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`);
});

function initial(){
    Role.estimatedDocumentCount((err,count)=>{
        if(!err && count === 0){
            new Role({
                name:"user"
            }).save(err=>{
                if(err){
                    console.log("erro",err);
                }
                console.log("adicionado 'user' à coleção de Regras ");
            });
            new Role({
                name:"comum"
            }).save(err=>{
                if(err){
                    console.log("erro",err);
                }
                console.log("adicionado 'comum' à coleção de Regras ");
            });
            new Role({
                name:"admin"
            }).save(err=>{
                if(err){
                    console.log("erro",err);
                }
                console.log("adicionado 'admin' à coleção de Regras ");
            });
        }
    });
}


