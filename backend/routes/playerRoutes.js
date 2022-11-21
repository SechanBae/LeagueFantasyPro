const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const players = require("../controller/playerController");
    var router = express.Router();
    router.post("/addPlayers",players.addPlayers);
    app.use("/api/players",router);
  };