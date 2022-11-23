const db = require("../models");
const User = db.users;
const League = db.leagues;
const Team = db.teams;
const Op = db.Sequelize.Op;
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const bcrypt=require("bcrypt");
exports.getLeagues = async (req, res) => {
  console.log(req.user);
  try {
    const leagues = await sequelize.query(
      "SELECT * FROM leagues INNER JOIN teams ON leagues.leagueId=teams.leagueId WHERE teams.userId=?",
      {
        replacements: [req.user.userId],
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({ leagues });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createLeague = async (req, res) => {
  if(!req.body.password){
    const leagueData = {
        host: req.user.username,
        name: req.body.name,
        region: req.body.region,
        isPublic:true
    };
    League.create(leagueData)
    .then((league) => {
      console.log(league.dataValues);
      const teamData = {
        teamName: req.body.teamName,
        leagueId: league.dataValues.leagueId,
        userId: req.user.userId,
      };
      Team.create(teamData).then((team) => {
        console.log(team);
        res.status(200).json({ team });
      });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  }
  else{
    const salt=await bcrypt.genSalt(10);
    const leagueData = {
        host: req.user.username,
        name: req.body.name,
        region: req.body.region,
        password:await bcrypt.hash(req.body.password,salt),
        isPublic:false
    };
    League.create(leagueData)
    .then((league) => {
      console.log(league.dataValues);
      const teamData = {
        teamName: req.body.teamName,
        leagueId: league.dataValues.leagueId,
        userId: req.user.userId,
      };
      Team.create(teamData).then((team) => {
        console.log(team);
        res.status(200).json({ team });
      });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
  }

};
exports.joinLeague = async (req, res) => {
  try {
    const alreadyJoined = await sequelize.query(
      "SELECT * FROM teams WHERE userId=? AND leagueId=?",
      {
        replacements: [req.user.userId, req.body.leagueId],
        type: QueryTypes.SELECT,
      }
    );
    if (alreadyJoined.length) {
      res.status(400).json({ message: "You are already in this league" });
    }
    else {
        const teamData = {
            teamName: req.body.teamName,
            leagueId: req.body.leagueId,
            userId: req.user.userId,
          };
        if(req.body.password){
            const league=await League.findByPk(req.body.leagueId)
            if(league){
                const validPassword=await bcrypt.compare(req.body.password,league.password);
                if(validPassword){
                    Team.create(teamData)
                        .then((team) => {
                        res.status(200).json({ team });
                        })
                        .catch((error) => {
                        res.status(400).json({ message: error.message });
                        });
                }
                else{
                    res.status(401).json({message:"Incorrect Password"});
                }
            }
            else{
                 res.status(401).json({message:"That League doesn't exist anymore."});
            }
        }
        else{
            Team.create(teamData)
            .then((team) => {
              res.status(200).json({ team });
            })
            .catch((error) => {
              res.status(400).json({ message: error.message });
            });
        }
      
      
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getLeaguesForJoin= async (req,res)=>{
    try{
        const leagues = await sequelize.query(
            "SELECT * FROM leagues INNER JOIN teams ON leagues.leagueId=teams.leagueId WHERE leagues.leagueID NOT IN (SELECT leagueId FROM teams WHERE userId=?) GROUP BY leagues.leagueId",
            {
              replacements: [req.user.userId],
              type: QueryTypes.SELECT,
            }
          );
        console.log(leagues);
        res.status(200).json({leagues})
    }catch(error){
        
        res.status(400).json({ message: error.message });
    }
}