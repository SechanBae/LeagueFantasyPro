const db=require("../models");
const Player=db.players;
const League=db.leagues;
exports.addPlayers=async(req,res)=>{
    try {
        if(req.user.isAdmin){
            const players=req.body.playersJSON;
            console.log(players);
            if(players){
                players.forEach(async player=>{
                    const p=await Player.findOne({
                        where:{
                            gameName:player.gameName,
                            pastPlayer:false
                        }
                    });
                    if(!p){
                        Player.create(player);
                    }
                })
            }
            res.status(200).json({messsage:"Success"});
        }
        else{

            res.status(400).json({message:"You are not an admin"});
        }
    } catch (error) {
        res.status(400).json({message:error.message});
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