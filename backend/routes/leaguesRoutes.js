const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const leagues = require("../controller/leagueController");
    var router = express.Router();
    const le=require("../controller/user-leagueController");
    router.route("/").get(checkLogin,leagues.getLeagues);
    //get Users Leagues
    router.post("/create",checkLogin,leagues.createLeague);
    router.post("/join",checkLogin,leagues.joinLeague);
    app.use("/api/leagues",router);
  };