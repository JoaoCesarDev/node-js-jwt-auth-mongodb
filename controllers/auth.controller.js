const config = require("../Config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req,res)=>{
    const user = new User({
        username: req.body.username,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err,user)=>{
        if(err){
            res.status(500).send({message:err});
            return;
        }

        if(req.body.roles){
            Role.find(
                {
                name:{$in:req.body.roles}
                },
            (err,roles)=>{
                if(err){
                    res.status(500).send({
                        message:err
                    });
                    return;
                }

            user.roles = roles.map(role => role._id);
            user.save(err => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({
                    message:"Usuário foi registrado com Sucesso!"
                });
            });
            }
        );
    } else {
        Role.findOne({name:"user"},(err,role)=>{
            if(err){
                res.status(500).send({
                    message:err
                });
                return;
            }
            user.roles = [role._id];
            user.save(err=>{
                if(err){
                    res.status(500).send({
                        message:err
                    });
                    return;
                }
            res.send({message:"Usuário foi registrado com Sucesso!"});
            });
        });
    }
});
};

exports.signin = (req,res)=>{
    User.findOne({
        username:req.body.username
    })
    .populate("roles","-__V")
    .exec((err,user)=>{
        if(err){
            res.status(500).send({
                message:err
            });
            return;
        }
        if(!user){
            return res.status(404).send({
                message:"Usuário não encontrado."
            });
        }
        
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!passwordIsValid){
            return res.status(401).send({
                accessToken:null,
                message:"Senha Inválida!"
            });
        }

        var token = jwt.sign({id:user.id},config.secret,{
            expiresIn: 86400 // 24 horas
        });

        var authorities = [];

        for(let i = 0;i < user.roles.length; i++){
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    });
};
exports.allUsers = (req,res)=>{
   
    User.find({}, 'username email roles').populate('roles').exec((erro,users)=>{
        if(erro){
            res.status(500).send({
                message:erro
            });
            return;
        }
        res.send({
           users
        });
    });
};
exports.findOne=(req,res)=>{
    const id = req.params.id;
    User.findById(id).then(user=>{  
        if(!user)
            res.status(404).send({message:"Não foi enconcontrado o Usuário com o " + id});
        else res.send(user);
    }).catch(err =>{
        res.status(500)
        .send({ message: "Não foi enconcontrado o Usuário com o" + id });
    });
};
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      User.findByIdAndUpdate(id, req.body,{ useFindAndModify: false })
      .then(data => {
        
        res.send({ message: "Usuario foi atualizado com sucesso." });
     
    }).catch(err => {
        res.status(500).send({
          message: "Error ao atualizar o usuário com o id: " + id
        });
        });
};
exports.allRoles = (req, res) =>{
    Role.find({}).then(roles => {
         res.send({ roles: roles.docs });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Não foram encontrados as roles!",
        });
    });
};
exports.deleteUser = (req,res)=>{
    const id = req.params.id;
    User.findByIdAndRemove(id,{ useFindAndModify: false })
        .then(data=>{
            if (!data) {
                res.status(404).send({
                  message: `Não pode Deletar o usuário com o id=${id}.`
                });
              } else {
                res.send({
                  message: "Usuário foi excluido com sucesso!"
                });
              }
        })
        .catch(err => {
            res.status(500).send({
              message: "Não pode Deletar o usuário com o id=" + id
            });

        });
};