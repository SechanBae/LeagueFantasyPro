const db=require("../models");
const Team=db.teams;
const Player=db.players;
const League=db.leagues;
const Op = db.Sequelize.Op;
exports.leaveLeague=async(req,res)=>{
    try{
        console.log("hello");
        const league=await League.findByPk(req.params.leagueId);
        console.log(league);
        if(league.draftStatus!="PENDING"){
            res.status(400).json({message:"Draft has started, you cannot leave anymore"})
        }
        else{
            if(req.user.username!=league.host){
                const team=await Team.findOne({
                    where:{
                        userId:req.user.userId,
                        leagueId:req.params.leagueId
                    }
                })
                await team.destroy();
                res.status(200).json({message:"Left League"});
            }
            else{
                await league.destroy()
                await Team.destroy({
                    where:{
                        leagueId:null
                    }
                })
                res.status(200).json({message:"Left League"});
            }
        }
    }catch(error){
        console.log(error);
        res.status(400).json({message:"Failed"});
    }
}
exports.getTeam=async(req,res)=>{
    try{
        const team=await Team.findByPk(req.params.teamId);
        const teamPlayers=[];
        if(team.top){
            teamPlayers.push(await Player.findByPk(team.top))
        }
        if(team.jungle){
            teamPlayers.push(await Player.findByPk(team.jungle))
        }
        if(team.middle){
            teamPlayers.push(await Player.findByPk(team.middle))
        }
        if(team.adc){
            teamPlayers.push(await Player.findByPk(team.adc))
        }
        if(team.support){
            teamPlayers.push(await Player.findByPk(team.support))
        }
        if(team.sub){
            teamPlayers.push(await Player.findByPk(team.sub))
        }
        res.status(200).json({team,teamPlayers});
    }catch(error){
        res.status(400).json({message:"Failed"});
    }
}
exports.subPlayer=async(req,res)=>{
    try{
        const team=await Team.findByPk(req.body.teamId);
        const subPlayer=await Player.findByPk(team.sub);
        const position=subPlayer.position;
        const temp=team[position];
        team[position]=subPlayer.playerId;
        team.sub=temp;
        await team.save()
        res.status(200).json({message:"Subbed"});
    }catch(error){
        res.status(400).json({message:"Failed"});
    }
}