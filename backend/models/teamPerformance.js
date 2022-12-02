/**
 * Model representing teamperformance object
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const TeamPerformance = sequelize.define("teamPerformance", {
      teamPerformanceId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      week: {
          type: Sequelize.INTEGER
      },
      top:{
        type: Sequelize.INTEGER
      },
      jungle:{
        type: Sequelize.INTEGER
      },
      middle:{
        type: Sequelize.INTEGER
      },
      adc:{
        type: Sequelize.INTEGER
      },
      support:{
        type: Sequelize.INTEGER
      },
      score:{
        type: Sequelize.INTEGER
      }
    },{timestamps:false});
  
    return TeamPerformance;
  };