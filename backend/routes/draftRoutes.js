/**
 * Routing api calls to draft controller functions
 */
const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const drafts = require("../controller/draftController");
    var router = express.Router();
    router.put("/addPlayer",checkLogin,drafts.addPlayerToTeam);
    router.route("/getDraftOrder/:leagueId").get(checkLogin,drafts.getDraftOrder);
    app.use("/api/drafts",router);
  };