/**
 * A controller file that is responsible for making queries to the draft model
 */
const db = require("../models");
const Team=db.teams;
const Player=db.players;
const User=db.users;
const Draft=db.drafts;
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");

/**Get order of draft
 * 
 * @param {request data} req 
 * @param {response data} res 
 */
exports.getDraftOrder=async(req,res)=>{
    try{
        const pickOrder=await Draft.findAll({
            where:{
                leagueId:req.params.leagueId
            },
            order:[["pickOrder","ASC"]],
            include:[{
                model:User,
                as:"users",
                attributes:["username"]
              },
              {
                model:Player,
                as:"players",
                attributes:["playerId","gameName"]
              }
            ]
        })
        res.status(200).json({pickOrder});
    }catch(error){
        res.status(400).json({message:"Failed"});
    }
}

/** Add player to user's team
 *  Update draft order
 * @param {request data} req 
 * @param {response data} res 
 */
exports.addPlayerToTeam=async(req,res)=>{
    try{
        const team=await Team.findOne({
            where:{
                userId:req.user.userId,
                leagueId:req.body.leagueId
            }
        })
        var availableRoles=[];
        if(team.top==null){
            availableRoles.push("top");
        }if(team.jungle==null){
            availableRoles.push("jungle");
        }if(team.middle==null){
            availableRoles.push("middle");
        }if(team.adc==null){
            availableRoles.push("adc");
        }if(team.support==null){
            availableRoles.push("support");
        }
        const player=await Player.findByPk(req.body.playerId);
        const role=availableRoles.find(role=>role==player.position);
        console.log(role);
        if(role){
            team[role]=player.playerId;
            await team.save();
            const draft=await Draft.findByPk(req.body.draftId);
            draft.playerId=req.body.playerId;
            await draft.save();
            res.status(200).json({team});
        }
        else if(team.sub==null){
            console.log("subtime");
            team.sub=player.playerId;
            await team.save(); 
            const draft=await Draft.findByPk(req.body.draftId);
            draft.playerId=req.body.playerId;
            await draft.save();
            res.status(200).json({team});
        }
        else{
            res.status(400).json({message:"You cannot pick another player in this role"});
        }
        
    }catch(error){
        res.status(400).json({message:"Failed"});
    }
}