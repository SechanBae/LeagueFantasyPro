/**
 * Model representing message object
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
      messageId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      content:{
          type:Sequelize.STRING
      }
    });
  
    return Message;
  };