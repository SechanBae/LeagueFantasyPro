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
db.users.belongsToMany(db.leagues,{
  through:"user_league",
  as:"leagues",
  foreignKey:"user_Id"
});
db.leagues.belongsToMany(db.users,{
  through:"user_league",
  as:"users",
  foreignKey:"league_Id"
});
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
module.exports = db;