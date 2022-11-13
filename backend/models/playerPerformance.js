module.exports = (sequelize, Sequelize) => {
    const playerPerformance = sequelize.define("playerPerformance", {
      performanceId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      week: {
          type: Sequelize.INTEGER
      },
      totalKills:{
        type: Sequelize.DECIMAL(3,2)
      },
      totalDeaths:{
        type: Sequelize.DECIMAL(3,2)
      },
      totalAssists:{
        type: Sequelize.DECIMAL(3,2)
      },
      totalCS:{
        type: Sequelize.DECIMAL(3,2)
      }
    });
  
    return PlayerPerformance;
  };