/**
 * Controller file responsbile for making queries to playerperformance/teamperformance
 */
const db=require("../models");
const Player=db.players;
const Team=db.teams;
const League=db.leagues;
const PlayerPerformance=db.playerPerformances;
const TeamPerformance=db.teamPerformances;
const { sequelize } = require("../models");
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");
/** Check that it is admin from data from middleware.
 * Create playerperformances based off csv file 
 * Create teamperformaces for each team based on their lineup chosen
 * Update the team's points
 * @param {request data} req 
 * @param {response data} res 
 */
exports.addPerformance=async(req,res)=>{
    if(req.user.isAdmin){
        try{
        const performances=req.body.performancesJSON;
        performances.forEach(async performance => {
            
            const p=await Player.findOne({
                where:{
                    gameName:performance.gameName,
                    pastPlayer:false
                }
            });
            console.log(await p);
            if(p){
                await PlayerPerformance.create({
                playerId:p.playerId,
                week:performance.week,
                totalKills:performance.totalKills,
                totalDeaths:performance.totalDeaths,
                totalAssists:performance.totalAssists,
                totalCS:performance.totalCS,
                totalScore:performance.totalScore,
            })
            }
            
        });
        const leagues=await League.findAll({
            attributes:["leagueId"],
            where:{
                draftStatus:"FINISHED",
                isDone:false
            }
        });
        
        console.log(leagues);
        await leagues.forEach(async league => {
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
                const alreadyPlayed=await TeamPerformance.count({
                    where:{
                        week:req.body.week
                    }
                });
                if(!alreadyPlayed){
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
                team.points+=score;
                await team.save();
                }
                
                
            })
        });
        res.status(200).json({});
    }catch(error){
        res.status(400).json({message:error.message});
    }
    }else{
        res.status(400).json({message:"You do not have permission"});
    }
    
}

/**
 * Get teamperformances for a given team
 * @param {request data} req 
 * @param {response data} res 
 */
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
/**
 * Get playerperformances for a member in a team
 * @param {request data} req 
 * @param {response data} res 
 */
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

/**
 * Get all performances of players for a set of team
 * @param {request data} req 
 * @param {response data} res 
 */
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
/**Check that user is admin through middleware data
 * update all leagues that have finishhed drafing to isDone
 * Delete any leagues/teams that have not finished drafting
 * and set all players to pastPlayer true
 * @param {request data} req 
 * @param {response data} res 
 */
exports.finishSeason=async(req,res)=>{
    if(req.user.isAdmin){ 
        try {
            await League.update({isDone:true},{
                where:{
                    isDone:false,
                    draftStatus:"FINISHED"
                }
            })
            await Player.update({pastPlayer:true},{
                where:{
                    pastPlayer:false
                }
            })
            await League.destroy({
                where:{
                    isDone:false,
                    draftStatus:"PENDING"
                }
            })
            await League.destroy({
                where:{
                    isDone:false,
                    draftStatus:"ONGOING"
                }
            })
            await Team.destory({
                where:{
                    leagueId:{
                        [Op.is]:null,
                    }
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