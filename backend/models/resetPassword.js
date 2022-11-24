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
  });

  return ResetPassword;
};