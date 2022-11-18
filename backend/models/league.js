module.exports = (sequelize, Sequelize) => {
    const League = sequelize.define("league", {
      leagueId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      host:{
          type:Sequelize.INTEGER
      },
      name: {
          type: Sequelize.STRING
      },
      region: {
          type: Sequelize.STRING
      },
      isStarted:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      isPublic:{
        type:Sequelize.BOOLEAN
      },
      isDone:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      draftDateTime:{
        type:Sequelize.DATE
      }
    });
  
    return League;
  };