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
            const player=await Player.findByPk((team.top));
            player["team"]=team.teamName;
            teamPlayers.push(player);
        }
        if(team.jungle){
            const player=await Player.findByPk((team.jungle));
            player["team"]=team.teamName;
            teamPlayers.push(player);
        }
        if(team.middle){
            const player=await Player.findByPk((team.middle));
            player["team"]=team.teamName;
            teamPlayers.push(player);
        }
        if(team.adc){
            const player=await Player.findByPk((team.adc));
            player["team"]=team.teamName;
            teamPlayers.push(player);
        }
        if(team.support){
            const player=await Player.findByPk((team.support));
            player["team"]=team.teamName;
            teamPlayers.push(player);
        }
        if(team.sub){
            const player=await Player.findByPk((team.sub));
            player["team"]=team.teamName;
            teamPlayers.push(player);
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