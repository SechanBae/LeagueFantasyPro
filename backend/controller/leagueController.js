const db = require("../models");
const User = db.users;
const League = db.leagues;
const Team=db.teams;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
exports.getLeagues=async (req,res)=>{
    console.log(req.user);
    try{
        const leagues=await sequelize.query("SELECT * FROM leagues INNER JOIN teams ON leagues.leagueId=teams.leagueId WHERE teams.userId=?",
        {
            replacements:[req.user.userId],
            type:QueryTypes.SELECT
        });
        res.status(200).json({leagues});
    }catch(error){
        res.status(404).json({message:error.message});
    }
    
}

exports.createLeague=async(req,res)=>{
    const leagueData={
        host:req.user.userId,
        name:req.body.name,
        region:req.body.region
    };

    try {
        League.create(leagueData)
            .then(league=>{
                console.log(league.dataValues);
                const teamData={
                    teamName:req.body.teamName,
                    leagueId:league.dataValues.leagueId,
                    userId:req.user.userId
                }   
                Team.create(teamData)
                    .then(team=>{
                        console.log(team)
                        res.status(200).json({team});
                })
                    
            })
            .catch(error=>{
                res.status(400).json({message:error.message});
            });
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
exports.joinLeague=async(req,res)=>{
    console.log(req.user);
    console.log(req.body);
    try{
        const alreadyJoined=await sequelize.query("SELECT * FROM teams WHERE userId=? AND leagueId=?",
        {
            replacements:[req.user.userId,req.body.leagueId],
            type:QueryTypes.SELECT
        })
        if(alreadyJoined.length){
            res.status(400).json({message:"You are already in this league"});
        }
        else{
            const teamData={
                teamName:req.body.teamName,
                leagueId:req.body.leagueId,
                userId:req.user.userId
            }
            Team.create(teamData)
                .then(team=>{
                    res.status(200).json({team});
                })
                .catch(error=>{
                    res.status(400).json({message:error.message})
                })
        }
        
        
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
}