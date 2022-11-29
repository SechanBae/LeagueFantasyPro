const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const teams = require("../controller/teamController");
    var router = express.Router();
    router.route("/getTeam/:teamId").get(checkLogin,teams.getTeam);
    router.delete("/leaveLeague/:leagueId",checkLogin,teams.leaveLeague);
    router.put("/substitutePlayer",checkLogin,teams.subPlayer)
    app.use("/api/teams",router);
  };