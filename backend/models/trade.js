/**
 * Model representing trade object
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const Trade = sequelize.define("trade", {
      tradeId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      status:{
        type:Sequelize.STRING,
        defaultValue:"PENDING"
      },
      wantedPlayer:{
        type:Sequelize.INTEGER
      },
      offeredPlayer:{
        type:Sequelize.INTEGER
      },
      sender:{
        type:Sequelize.INTEGER
      },
      receiver:{
        type:Sequelize.INTEGER
      }
    });
  
    return Trade;
  };