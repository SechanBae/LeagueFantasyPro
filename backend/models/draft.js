/**
 * model rerepsenting draftpick
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const Draft = sequelize.define("draft", {
      draftId: {
          type: Sequelize.INTEGER,
          autoIncrement:true,
          primaryKey:true
      },
      pickOrder:{
        type:Sequelize.INTEGER
      }   
    },
    {timestamps:false});
  
    return Draft;
  };