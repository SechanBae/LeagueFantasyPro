const jwt =require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const checkLogin=async function(req,res,next){
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];

            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            const user=await User.findByPk(decoded.id.userId,{attributes:['userId','username','email','isAdmin']});
            console.log(user);
            req.user=user.dataValues;
            next();
        }
        catch(error){
            res.status(401).json({message:"Invalid Token. Please logout and login again"});
            console.log(error);
        }
    }
    if(!token){
        res.status(401);
    }
}

module.exports=checkLogin;