const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const teams = require("../controller/teamController");
    var router = express.Router();
    router.put("/addPlayer",checkLogin,teams.addPlayerToTeam);
    app.use("/api/teams",router);
  };