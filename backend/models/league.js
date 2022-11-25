module.exports = (sequelize, Sequelize) => {
    const League = sequelize.define("league", {
      leagueId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      host:{
          type:Sequelize.STRING
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
      password:{
        type:Sequelize.STRING
      },
      isDone:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      draftDateTime:{
        type:Sequelize.DATE
      }
    },
    {timestamps:false});
  
    return League;
  };