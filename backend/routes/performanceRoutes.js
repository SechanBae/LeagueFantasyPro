const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const performances = require("../controller/performanceController");
    var router = express.Router();
    router.post("/addPerformances",performances.addPerformance);
    router.route("/getPerformances/:teamId").get(checkLogin,performances.getPerformances);
    router.route("/getPlayerPerformance/:playerId/:teamId").get(checkLogin,performances.getPlayerPerformances);
    router.post("/getDetailedPerformances",checkLogin,performances.getDetailedPerformances);
    app.use("/api/performances",router);
  };