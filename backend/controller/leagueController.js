const db = require("../models");
const User = db.users;
const League = db.leagues;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
const { sequelize, leagues } = require("../models");
exports.getLeagues=async (req,res)=>{
    console.log(req.user);
    try{
        const leagues=await sequelize.query("SELECT * FROM leagues INNER JOIN user_league ON leagues.leagueId=user_league.league_Id WHERE user_league.user_Id=?",
        {
            replacements:[req.user.userId],
            type:QueryTypes.SELECT
        });
        res.status(200).json({leagues});
    }catch(error){
        res.status(404).json({message:"No Leagues Found"});
    }
    
}

exports.createLeague=async(req,res)=>{
    const leagueData={
        host:req.user.userId,
        name:req.body.name,
        region:req.body.region
    }
    try {
        League.create(leagueData)
            .then(league=>{
                User.findByPk(req.user.userId)
                    .then(user=>{
                        league.addUser(user)
                        res.status(200).json({league});
                    })
            })
            .catch(error=>{
                res.status(400).json({message:error.message});
            });
    } catch (error) {
        res.status(400).json({message:"Failed"});
    }
}
exports.joinLeague=async(req,res)=>{
    console.log(req.user);
    console.log(req.body);
    try{
        const alreadyJoined=await sequelize.query("SELECT * FROM user_league WHERE user_Id=? AND league_Id=?",
        {
            replacements:[req.user.userId,req.body.leagueId],
            type:QueryTypes.SELECT
        })
        if(alreadyJoined.length){
            res.status(400).json({message:"You are already in this league"});
        }
        League.findByPk(req.body.leagueId)
            .then(league=>{
                User.findByPk(req.user.userId)
                .then(user=>{
                    league.addUser(user);
                    res.status(200).json({league});
                })
            })
            .catch(error=>{
                res.status(400).json({message:error.message});
            })
    }
    catch(error){
        res.status(400).json({message:"Bad Request"});
    }
}