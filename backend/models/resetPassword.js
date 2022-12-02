/**
 * Model representing resetpassword object
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const ResetPassword = sequelize.define("resetPassword", {
    resetPasswordId: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    token: {
        type: Sequelize.STRING
    }
  },{timestamps:false});

  return ResetPassword;
};