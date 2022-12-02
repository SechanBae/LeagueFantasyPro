/**
 * Model representing playerPerformance object
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const PlayerPerformance = sequelize.define("playerPerformance", {
      performanceId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      week: {
          type: Sequelize.INTEGER
      },
      totalKills:{
        type: Sequelize.INTEGER
      },
      totalDeaths:{
        type: Sequelize.INTEGER 
      },
      totalAssists:{
        type: Sequelize.INTEGER
      },
      totalCS:{
        type: Sequelize.INTEGER
      },
      totalScore:{
        type: Sequelize.INTEGER
      }
    },{timestamps:false});
  
    return PlayerPerformance;
  };