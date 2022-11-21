const db=require("../models");
const Player=db.players;

exports.addPlayers=async(req,res)=>{
    console.log(req.body.playersJSON);
    Player.bulkCreate(req.body.playersJSON)
        .then(players=>{
            res.status(200).json({players});
        })
        .catch(error=>{
            console.log(error);
            res.status(400).json({message:error});
        })
}