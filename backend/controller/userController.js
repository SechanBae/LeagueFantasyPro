const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt=require("bcrypt");
const generateToken = require("../util/generateToken");
exports.create = async (req, res) => { 
    const isAvailable=await User.count({
        where:{
            [Op.or]:[
                {username:req.body.username},
                {email:req.body.email}
            ]
        }
    });
    if(!isAvailable){
        const salt=await bcrypt.genSalt(10);
        const user={
            username:req.body.username,
            password:await bcrypt.hash(req.body.password,salt),
            email:req.body.email
        };
        User.create(user)
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message
            });
        });
    }
    else{
        res.status(403).send({
            message:"Account with username/email already exists"
        })
    }
    
  
};

exports.findOneLogin = async (req, res) => {
  const username=req.body.username;
  const password=req.body.password;
  const user=await User.findOne({
    where:{username:username}
  });
  if(user){
    const validPassword=await bcrypt.compare(password,user.password);
    console.log(user);
    if(validPassword){
        
        res.status(200).json({"username":username,"isAdmin":user.isAdmin,token:generateToken(user)});
    }
    else{
        res.status(401).json({message:"Incorrect Credentials"});
    }

  }
  else{
    res.status(401).json({message:"Incorrect Credentials"});
  }
};
