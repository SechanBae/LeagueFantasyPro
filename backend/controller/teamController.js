const db = require("../models");
const Team=db.teams;
const Player=db.players;
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
exports.checkTeamLeague=async(req,res)=>{
    try{

    }catch(error){
        
    }
}
exports.addPlayerToTeam=async(req,res)=>{
    try{
        res.send(200).json({message:"Success"});
        
    }catch(error){

        res.send(400).json({message:"Failed"});
    }
}