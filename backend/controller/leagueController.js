const db = require("../models");
const User = require("../models/user");
const League = db.leagues;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
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

    }
    
}
