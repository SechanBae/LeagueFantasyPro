const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const leagues = require("../controller/leagueController");
    var router = express.Router();
    
    router.route("/").get(checkLogin,leagues.getLeagues);
    //get Users Leagues

    app.use("/api/leagues",router);
  };