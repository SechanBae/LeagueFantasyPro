/**
 * Routing api calls to message controller functions
 */
const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const messages = require("../controller/messageController");
    var router = express.Router();
    router.route("/:leagueId").get(checkLogin,messages.getAllMessages);
    router.post("/sendMessage",checkLogin,messages.sendMessage);
    app.use("/api/messages",router);
  };