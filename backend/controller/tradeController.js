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
                "SELECT * FROM trades INNER JOIN teams ON trades.sender=teams.teamId WHERE trades.receiver=? ORDER BY updatedAT DESC",
                {
                  replacements: [req.params.teamId],
                  type: QueryTypes.SELECT,
                }
              );
              var rTrades=[];
              for (let i=0;i<recievedTrades.length;i++){
                var tradeInfo={};
                tradeInfo["wantedPlayer"]=await Player.findByPk(recievedTrades[i].wantedPlayer);
                tradeInfo["offeredPlayer"]=await Player.findByPk(recievedTrades[i].offeredPlayer);
                tradeInfo["sender"]=await Team.findByPk(recievedTrades[i].sender);
                tradeInfo["receiver"]=await Team.findByPk(recievedTrades[i].receiver);
                tradeInfo["trade"]=recievedTrades[i];
                rTrades.push(tradeInfo);
              }
              const sentTrades = await sequelize.query(
                "SELECT * FROM trades INNER JOIN teams ON trades.receiver=teams.teamId WHERE trades.sender=?",
                {
                  replacements: [req.params.teamId],
                  type: QueryTypes.SELECT,
                }
              );
              var sTrades=[];
              for (let i=0;i<sentTrades.length;i++){
                var tradeInfo={};
                tradeInfo["wantedPlayer"]=await Player.findByPk(sentTrades[i].wantedPlayer);
                tradeInfo["offeredPlayer"]=await Player.findByPk(sentTrades[i].offeredPlayer);
                tradeInfo["sender"]=await Team.findByPk(sentTrades[i].sender);
                tradeInfo["receiver"]=await Team.findByPk(sentTrades[i].receiver);
                tradeInfo["trade"]=sentTrades[i];
                sTrades.push(tradeInfo);
              }
            res.status(200).json({rTrades,sTrades})
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
                const player=await Player.findByPk((otherTeams[i].top));
                player["team"]=otherTeams[i].teamName;
                players.push(player);
            }
            if(otherTeams[i].jungle){
                const player=await Player.findByPk((otherTeams[i].jungle));
                player["team"]=otherTeams[i].teamName;
                players.push(player);
            }
            if(otherTeams[i].middle){
                const player=await Player.findByPk((otherTeams[i].middle));
                player["team"]=otherTeams[i].teamName;
                players.push(player);
            }
            if(otherTeams[i].adc){
                const player=await Player.findByPk((otherTeams[i].adc));
                player["team"]=otherTeams[i].teamName;
                players.push(player);
            }
            if(otherTeams[i].support){
                const player=await Player.findByPk((otherTeams[i].support));
                player["team"]=otherTeams[i].teamName;
                players.push(player);
            }
            if(otherTeams[i].sub){
                const player=await Player.findByPk((otherTeams[i].sub));
                player["team"]=otherTeams[i].teamName;
                players.push(player);
            }
        }
        res.status(200).json({players});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
}
exports.createTrade=async(req,res)=>{
    try {
        const receiverTeam=await Team.findOne({
            where:{
                teamName:req.body.receiverTeamName
            }
        });
        tradeData={
            wantedPlayer:req.body.wantedPlayer,
            offeredPlayer:req.body.offeredPlayer,
            sender:req.body.sender,
            receiver:receiverTeam.teamId
        }
        const trade=await Trade.create(tradeData);
        res.status(200).json({trade});
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}
exports.changeStatus=async(req,res)=>{
    try{
        if(req.body.newStatus=="EXPIRED"){
            const trade=await Trade.findByPk(req.body.tradeId);
            trade.status=req.body.newStatus;
            await trade.save();
        }
        else if(req.body.newStatus=="DENIED"){
            const trade=await Trade.findByPk(req.body.tradeId);
            trade.status=req.body.newStatus;
            await trade.save();
        }
        else if(req.body.newStatus=="ACCEPTED"){
            const trade=await Trade.findByPk(req.body.tradeId);
            const sender=await Team.findByPk(trade.sender);
            const offeredPlayer=await Player.findByPk(trade.offeredPlayer);
            var senderRole;
            if(sender[offeredPlayer.position]==offeredPlayer.playerId){
                senderRole=offeredPlayer.position
            }
            else{
                senderRole="sub";
            }
            const receiver=await Team.findByPk(trade.receiver);
            const wantedPlayer=await Player.findByPk(trade.wantedPlayer);
            var receiverRole;
            if(receiver[wantedPlayer.position]==wantedPlayer.playerId){
                receiverRole=wantedPlayer.position
            }
            else{
                receiverRole="sub";
            }
            sender[senderRole]=wantedPlayer.playerId;
            receiver[receiverRole]=offeredPlayer.playerId;
            await Trade.update({status:"EXPIRED"},
                {
                    where:{
                        [Op.and]:[
                            {sender:sender.teamId},
                            {offeredPlayer:offeredPlayer.playerId}
                        ]
                    }
                }
            );
            await Trade.update({status:"EXPIRED"},
                {
                    where:{
                        [Op.and]:[
                            {receiver:sender.teamId},
                            {wantedPlayer:offeredPlayer.playerId}
                        ]
                    }
                }
            );
            
            await Trade.update({status:"EXPIRED"},
                {
                    where:{
                        [Op.and]:[
                            {sender:receiver.teamId},
                            {offeredPlayer:wantedPlayer.playerId}
                        ]
                    }
                }
            );
            await Trade.update({status:"EXPIRED"},
                {
                    where:{
                        [Op.and]:[
                            {receiver:receiver.teamId},
                            {wantedPlayer:wantedPlayer.playerId}
                        ]
                    }
                }
            );
            trade.status=req.body.newStatus;
            await trade.save();
            await sender.save();
            await receiver.save();
            
        }
        res.status(200).json({message:"Trade success"});
    }catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}