const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const players = require("../controller/playerController");
    var router = express.Router();
    router.post("/addPlayers",players.addPlayers);
    router.route("/getPlayers/:leagueId").get(checkLogin,players.getPlayers);
    app.use("/api/players",router);
  };