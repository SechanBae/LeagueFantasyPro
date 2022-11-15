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
      jg:{
        type: Sequelize.INTEGER
      },
      mid:{
        type: Sequelize.INTEGER
      },
      bot:{
        type: Sequelize.INTEGER
      },
      sup:{
        type: Sequelize.INTEGER
      },
      sub:{
        type: Sequelize.INTEGER
      }
    });
  
    return Team;
  };