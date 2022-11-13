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
      }
    });
  
    return Team;
  };