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
      realName: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      team: {
        type: Sequelize.STRING
      },
      avgKPG:{
        type: Sequelize.DECIMAL(3,2)
      },
      avgDPG:{
        type: Sequelize.DECIMAL(3,2)
      },
      avgAPG:{
        type: Sequelize.DECIMAL(3,2)
      },
      avgCSPG:{
        type: Sequelize.DECIMAL(3,2)
      }
    });
  
    return Player;
  };