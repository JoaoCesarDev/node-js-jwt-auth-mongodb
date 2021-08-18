const { getRounds } = require("bcryptjs");
const db = require("../models");
const ROLES = db.roles;
const User = db.user;

checkDuplicateUsernameOrEmail = (req,res,next)=>{
    //nome de usuario
    User.findOne({
        username: req.body.username
    }).exec((err,user)=>{
        if(err){
            res.status(500).send({
                message:err
            });
            return;
        }
        if(user){
            res.status(400).send({
                message:"Falhou! Username já está em uso!"
            });
            return;
        }

        //Email
        User.findOne({
            email:req.body.email
        }).exec((err,user)=>{
            if(err){
                res.status(500).send({message:err});
                return;
            }
            if(user){
                res.status(400).send({message:"Falhou! Email já está em uso!"});
                return;
            }
            next();
        });
    });
};

CheckRolesExisted = (req,res,next)=>{
    if(req.body.roles){
        for(let i =0;i<req.body.length;i++){
            if(!Roles.includes(req.body.roles[i])){
                res.status(400).send({
                    message:`Falhou! Role ${req.body.roles[i]} não existe!`
                });
                return;
            }
        }
    }
    next();
};

const verifySignup = {
    checkDuplicateUsernameOrEmail,
    CheckRolesExisted
};

module.exports = verifySignup;