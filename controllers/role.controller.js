const db = require("../models");
const Role = db.role;

exports.allRoles = (req, res) =>{
    Role.find({}).then((roles)=>{
        return res.send(roles);
    }).catch((erro)=>{
        return res.status(400).json({
            error:true,
            message:"Nenhuma role encontrada!"
        })
    });
};