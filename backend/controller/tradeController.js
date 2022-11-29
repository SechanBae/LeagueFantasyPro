const db = require("../models");
const Trade=db.trades;
const League = db.leagues;
const Player = db.players;
const User = db.users;
const Team=db.teams;
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

exports.getTrades=async(req,res)=>{
    try {
        const team=await Team.findByPk(req.params.teamId);
        if(team.userId=req.user.userId){
            const recievedTrades = await sequelize.query(
                "SELECT * FROM trades INNER JOIN teams ON trades.sender=teams.teamId WHERE trades.receiver=?",
                {
                  replacements: [req.params.teamId],
                  type: QueryTypes.SELECT,
                }
              );
              const sentTrades = await sequelize.query(
                "SELECT * FROM trades INNER JOIN teams ON trades.receiver=teams.teamId WHERE trades.sender=?",
                {
                  replacements: [req.params.teamId],
                  type: QueryTypes.SELECT,
                }
              );
            res.status(200).json({recievedTrades,sentTrades})
        }
        else{
            res.status(400).json({message:"This is Not Your Team"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
}
exports.getAvailablePlayers=async(req,res)=>{
    try {
        const team=await Team.findByPk(req.params.teamId);
        const league=await League.findByPk(team.leagueId);
        const otherTeams=await Team.findAll({
            where:{
                leagueId:league.leagueId,
                teamId:{
                    [Op.ne]:req.params.teamId
                }
            }
        });
        var players=[];
        for(let i=0;i<otherTeams.length;i++){
            if(otherTeams[i].top){
                players.push(await Player.findByPk((otherTeams[i].top)));
            }
            if(otherTeams[i].jungle){
                players.push(await Player.findByPk((otherTeams[i].jungle)));
                
            }
            if(otherTeams[i].middle){
                players.push(await Player.findByPk((otherTeams[i].middle)));
                
            }
            if(otherTeams[i].adc){
                players.push(await Player.findByPk((otherTeams[i].adc)));
                
            }
            if(otherTeams[i].support){
                players.push(await Player.findByPk((otherTeams[i].support)));
                
            }
            if(otherTeams[i].sub){
                players.push(await Player.findByPk((otherTeams[i].sub)));
            }
        }
        res.status(200).json({players});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
}
