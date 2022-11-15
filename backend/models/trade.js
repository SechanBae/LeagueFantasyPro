module.exports = (sequelize, Sequelize) => {
    const Trade = sequelize.define("trade", {
      tradeId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      status:{
        type:Sequelize.STRING,
        defaultValue:"pending"
      },
      requestedPlayer:{
        type:Sequelize.INTEGER
      },
      offeredPlayer:{
        type:Sequelize.INTEGER
      },
      offerTeam:{
        type:Sequelize.INTEGER
      },
      receiveTeam:{
        type:Sequelize.INTEGER
      }
    });
  
    return Trade;
  };