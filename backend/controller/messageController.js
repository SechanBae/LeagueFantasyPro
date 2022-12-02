/**
 * Controller file responsible for querying messages model
 */
const db = require("../models");
const Message=db.messages;
const League = db.leagues;
const User = db.users;
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
/** Create message based off user's content and leagueId
 * 
 * @param {request data} req 
 * @param {response data} res 
 */
exports.sendMessage=async(req,res)=>{
    try{
        const messageData={
            userId:req.user.userId,
            content:req.body.content,
            leagueId:req.body.leagueId
        }
        const message=await Message.create(messageData);
        res.status(200).json({message:"Sent Successfully"})
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}
/** Retrieve all messages in the requested leagueId
 * 
 * @param {request data} req 
 * @param {response data} res 
 */
exports.getAllMessages=async(req,res)=>{
    try {
        const messages=await Message.findAll({
            where:{
                leagueId:req.params.leagueId
            },
            include:{
                        
                model:User,
                as:"users",
                attributes:["userId","username"]
            },
            order:[['createdAt','ASC']],
        })
        res.status(200).json({messages});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}