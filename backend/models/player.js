module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define("player", {
      playerId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      gameName: {
          type: Sequelize.STRING
      },
      position:{
          type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      team: {
        type: Sequelize.STRING
      },
      avgKPG:{
        type: Sequelize.DECIMAL(6,2)
      },
      avgDPG:{
        type: Sequelize.DECIMAL(6,2)
      },
      avgAPG:{
        type: Sequelize.DECIMAL(6,2)
      },
      avgCSPG:{
        type: Sequelize.DECIMAL(6,2)
      },
      scoreRating:{
        type: Sequelize.DECIMAL(10,2)
      },
      pastPlayer:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      }
    });
  
    return Player;
  };