/**
 * Model representing team object
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define("team", {
      teamId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      teamName: {
          type: Sequelize.STRING
      },
      points: {
          type: Sequelize.INTEGER,
          defaultValue:0
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
      sub:{
        type: Sequelize.INTEGER
      }
    },{timestamps:false});
  
    return Team;
  };