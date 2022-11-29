const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const trades = require("../controller/tradeController");
    var router = express.Router();
    router.route("/getTrades/:teamId").get(checkLogin,trades.getTrades);
    router.route("/getAvailablePlayers/:teamId").get(checkLogin,trades.getAvailablePlayers);
    app.use("/api/trades",router);
  };