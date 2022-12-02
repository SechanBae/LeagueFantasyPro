/**
 * Controller file for querying to user related
 */
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt=require("bcrypt");
const ResetPassword=db.resetPasswords;
const sendEmail=require("../util/sendEmail");
const generateToken = require("../util/generateToken");
/**
 * Create user based on register data,
 * hash password
 * @param {request data} req 
 * @param {response data} res 
 */
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
            res.status(200).send(data)
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

/**
 * Log user in if credentials are correct,
 * send JWT token for session verification
 * @param {request data} req 
 * @param {response data} res 
 */
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
        res.status(200).json({"username":username,"isAdmin":user.isAdmin,"userId":user.userId,token:generateToken(user)});
    }
    else{
        res.status(401).json({message:"Incorrect Credentials"});
    }

  }
  else{
    res.status(401).json({message:"Incorrect Credentials"});
  }
};
/**get user data
 * 
 * @param {request data} req 
 * @param {response data} res 
 */
exports.getProfile=async (req,res)=>{
    User.findByPk(req.user.userId)
    .then((user)=>{
        res.status(200).json({user})
    })
    .catch((error)=>{
        res.status(404).json({ message: error.message })
    })
}
/**update email for user
 * 
 * @param {request data} req 
 * @param {response data} res 
 */
exports.changeEmail=async(req,res)=>{
    try {
        const emailTaken=await User.findOne({
            where:{email:req.body.email}
        })
        if(emailTaken){
            res.status(400).json({message:"There is a user with that email"});
        }
        else{
            const user=await User.findByPk(req.user.userId);
            user.email=req.body.email;
            await user.save();
            res.status(200).json({message:"success"})

        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
/**
 * update password
 * @param {request data} req 
 * @param {response data} res 
 */
exports.changePassword=async(req,res)=>{
    const salt=await bcrypt.genSalt(10);
    User.findOne({
        where:{username:req.user.username}
    })
    .then(async (user)=>{
        console.log("hello")
        const valid=await bcrypt.compare(req.body.oldPassword,user.password)
        if (valid){
            user.password=await bcrypt.hash(req.body.password,salt)
            user.save().
                then((save)=>{
                    res.status(200).json({message:"Password has been set correctly"});
                })
        }
        else{
            res.status(401).json({message:"Incorrect Password"});
        }
    })
    .catch((error)=>{
        res.status(404).json({ message: error.message })
    })
}
/**
 * create random token for a user that forgets their password,
 * and send email to link to that token
 * @param {request data} req 
 * @param {response data} res 
 */
exports.forgotPasswordSendEmail=async(req,res)=>{
    try{
        const user=await User.findOne({
            where:{email:req.body.email}
        });
        if(user){
            const randomToken=Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2);
            await ResetPassword.create({
                token:randomToken,
                userId:user.userId
            });
            const sent=sendEmail.sendEmail(randomToken,req.body.email);
            res.status(200).json({message:"An email has been sent to reset your password"});
        }
        else{
            res.status(404).json({message:"Email has not been found"});
        }
    }catch(error){
        res.status(400).json({ message: error.message })
    }
}

/**
 * update password, delete token
 * @param {request data} req 
 * @param {response data} res 
 */
exports.resetPassword=async(req,res)=>{
    try{
        const reset=await ResetPassword.findOne({
            where:{token:req.body.token}
        });
        if(reset){
            const user=await User.findByPk(reset.userId);
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(req.body.password,salt)
            await user.save();
            await ResetPassword.destroy({
                where:{resetPasswordId:reset.resetPasswordId}
            });
            res.status(200).json({message:"Password has been successfully saved"})
        }
        else{
            res.status(404).json({message:"Reset link has expired/doesn't exist"})
        }
    }catch(error){
        res.status(400).json({ message: error.message })
    }
}