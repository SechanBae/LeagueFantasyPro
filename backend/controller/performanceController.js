const db=require("../models");
const Player=db.players;
const Team=db.teams;
const League=db.leagues;
const PlayerPerformance=db.playerPerformances;
const TeamPerformance=db.teamPerformances;
const { sequelize } = require("../models");
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");
exports.addPerformance=async(req,res)=>{
    console.log(req.body);
    try{
        const performances=await PlayerPerformance.bulkCreate(req.body.performancesJSON);
        const leagues=await League.findAll({
            attributes:["leagueId"],
            where:{
                draftStatus:"FINISHED"
            }
        });
        
        console.log(leagues);
        leagues.forEach(async league => {
            console.log(league.leagueId);
            const teams=await Team.findAll({
                where:{
                    leagueId:league.leagueId
                }
            })
            teams.forEach(async team=>{
            
                const topId=await PlayerPerformance.findOne({
                    where:{
                        week:req.body.week,
                        playerId:team.top
                    }
                })
                const jgId=await PlayerPerformance.findOne({
                    where:{
                        week:req.body.week,
                        playerId:team.jungle
                    }
                })
                const midId=await PlayerPerformance.findOne({
                    where:{
                        week:req.body.week,
                        playerId:team.middle
                    }
                })
                const adcId=await PlayerPerformance.findOne({
                    where:{
                        week:req.body.week,
                        playerId:team.adc
                    }
                })
                const supId=await PlayerPerformance.findOne({
                    where:{
                        week:req.body.week,
                        playerId:team.support
                    }
                })
                const score=topId.totalScore+jgId.totalScore+midId.totalScore+adcId.totalScore+supId.totalScore;
                await TeamPerformance.create({
                    week:req.body.week,
                    top:topId.performanceId,
                    jungle:jgId.performanceId,
                    middle:midId.performanceId,
                    adc:adcId.performanceId,
                    support:supId.performanceId,
                    teamId:team.teamId,
                    score:score
                })
                await team.save();
            })
        });
        const teams=await Team.findAll();
        teams.forEach(async team=>{
            sumScore=await sequelize.query(
                "SELECT SUM(score) as sum FROM teamPerformances WHERE teamId=?",
                {
                  replacements: [team.teamId],
                  type: QueryTypes.SELECT,
                }
              );
            team.points=sumScore[0].sum;
            await team.save();
        })
        res.status(200).json({});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

exports.getPerformances=async(req,res)=>{
    try {
        const teamPerformances=await TeamPerformance.findAll({
            where:{
                teamId:req.params.teamId
            },
            order:[["week","ASC"]]
        });
        
        res.status(200).json({teamPerformances});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
exports.getPlayerPerformances=async(req,res)=>{
    try {
        const player=await Player.findByPk(req.params.playerId);
        const position=player.position;
        console.log(position);
        const performance = await sequelize.query(
            "SELECT * FROM playerPerformances as p INNER JOIN teamPerformances as t ON p.performanceId=t."+position+" WHERE t.teamId=? AND p.playerId=?",
            {
              replacements: [req.params.teamId,req.params.playerId],
              type: QueryTypes.SELECT,
            }
        );
        res.status(200).json({performance});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
exports.getDetailedPerformances=async(req,res)=>{
    try{
        const detailedPerformances=await PlayerPerformance.findAll({
            where:{
                performanceId:{
                    [Op.in]:[req.body.top,req.body.jg,req.body.mid,req.body.adc,req.body.sup]
                }
            },
            include:{
                model:Player,
                as:"playerPerformances",
                attributes:["gameName","position"]
            }            
        })
        res.status(200).json({detailedPerformances});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
exports.finishSeason=async(req,res)=>{
    if(req.user.isAdmin){ 
        try {
            await League.update({isDone:true},{
                where:{
                    isDone:false
                }
            })
            await Player.update({pastPlayer:true},{
                where:{
                    pastPlayer:false
                }
            })
            res.status(200).json({message:"Finished"});
        } catch (error) {
            res.status(400).json({message:error.message});
        }
    }
    else{
        res.status(400).json({message:"You are not an admin"});
    }
}