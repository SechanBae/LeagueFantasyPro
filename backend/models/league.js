module.exports = (sequelize, Sequelize) => {
    const League = sequelize.define("league", {
      leagueId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      name: {
          type: Sequelize.STRING
      },
      region: {
          type: Sequelize.STRING
      },
      email:{
          type:Sequelize.STRING
      },
      isStarted:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      isPublic:{
          type:Sequelize.BOOLEAN
      },
      draftDateTime:{
        type:Sequelize.DATE
      }
    });
  
    return League;
  };