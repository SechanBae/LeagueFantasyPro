const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const leagues = require("../controller/leagueController");
    var router = express.Router();
    router.route("/").get(checkLogin,leagues.getLeagues);
    router.route("/getLeagueInfo/:leagueId").get(checkLogin,leagues.getLeagueInfo);
    router.route("/getAllLeagues").get(checkLogin,leagues.getLeaguesForJoin);
    router.post("/create",checkLogin,leagues.createLeague);
    router.post("/join",checkLogin,leagues.joinLeague);
    router.put("/startDraft",checkLogin,leagues.startDraft);
    router.put("/finishDraft",checkLogin,leagues.startDraft);
    app.use("/api/leagues",router);
  };