module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username: {
        type: Sequelize.TEXT
    },
    password: {
        type: Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    },
    isMuted:{
        type:Sequelize.BOOLEAN,
        defaultValue:false

    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false

    }
  },{timestamps:false});

  return User;
};