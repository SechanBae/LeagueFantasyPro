/**
 * Creates database tables based off models
 */
const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.leagues=require("./league.js")(sequelize,Sequelize);
db.teams=require("./team.js")(sequelize,Sequelize);
db.players=require("./player.js")(sequelize,Sequelize);
db.playerPerformances=require("./playerPerformance.js")(sequelize,Sequelize);
db.trades=require("./trade")(sequelize,Sequelize);
db.messages=require("./message")(sequelize,Sequelize);
db.resetPasswords=require("./resetPassword")(sequelize,Sequelize);
db.drafts=require("./draft")(sequelize,Sequelize);
db.teamPerformances=require('./teamPerformance')(sequelize,Sequelize);


/**
 * Creating relationships between models
 */
db.teams.belongsTo(db.leagues,{
  foreignKey:"leagueId",
  as:"leagues"
}); 
db.teams.belongsTo(db.users,{
  foreignKey:"userId",
  as:"users"
});
db.playerPerformances.belongsTo(db.players,{
  foreignKey:"playerId",
  as:"playerPerformances"
});
db.messages.belongsTo(db.users,{
  foreignKey:"userId",
  as:"users"
})
db.messages.belongsTo(db.leagues,{
  foreignKey:"leagueId",
  as:"leagues"
})
db.resetPasswords.belongsTo(db.users,{
  foreignKey:"userId",
  as:"users"
})
db.drafts.belongsTo(db.leagues,{
  foreignKey:"leagueId",
  as:"leagues"
})
db.drafts.belongsTo(db.users,{
  foreignKey:"userId",
  as:"users"
})
db.drafts.belongsTo(db.players,{
  foreignKey:"playerId",
  as:"players"
})
db.teamPerformances.belongsTo(db.teams,{
  foreignKey:"teamId",
  as:"teams"
})

/**
 * Creates admin user if it doesn't exist
 */
const adminData={
  username:"Admin",
  password:"$2a$10$GcLCquYT3uW86bodXAH2euB2Ox.GmAIlbU/SWNfh94aNkQC2gYv4C",
  isAdmin:true
}
const admin = db.users
  .findOne({
    where: {
      username: "Admin",
      isAdmin: true,
    },
  })
  .then((a) => {
    if(!a){
      db.users.create(adminData);
    }
  });

module.exports = db;