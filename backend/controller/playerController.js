const db=require("../models");
const Player=db.players;
const League=db.leagues;
exports.addPlayers=async(req,res)=>{
    if(req.user.isAdmin){
        Player.bulkCreate(req.body.playersJSON)
        .then(players=>{
            res.status(200).json({players});
        })
        .catch(error=>{
            console.log(error);
            res.status(400).json({message:error.message});
        })
    }
    else{
        res.status(400).json({message:"You are not an admin"});
    }
}
exports.getPlayers=async(req,res)=>{
    try{
        const league=await League.findByPk(req.params.leagueId);
        const players=await Player.findAll({
            where:{
                pastPlayer:false,
                region:league.region
            }
        });
        res.status(200).json({players});
    }catch(error){
        
        res.status(400).json({message:error.message});
    }
}