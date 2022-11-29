const db = require("../models");
const Message=db.messages;
const League = db.leagues;
const User = db.users;
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
exports.sendMessage=async(req,res)=>{
    try{
        const messageData={
            userId:req.user.userId,
            content:req.body.message,
            leagueId:req.body.leagueId
        }
        const message=await Message.create(messageData);
        res.status(200).json({message:"Sent Successfully"})
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}

exports.getSingleMessage=async(req,res)=>{
    try {
        const message=await Message.findOne({
            where:{
                leagueId:req.params.leagueId,
                userId:req.params.userId
            },
            order:[['createdAt','DESC']]
        })
        res.status(200).json({message});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.getAllMessages=async(req,res)=>{
    try {
        const messages=await Message.findAll({
            where:{
                leagueId:req.params.leagueId
            }
        })
        res.status(200).json({messages});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}