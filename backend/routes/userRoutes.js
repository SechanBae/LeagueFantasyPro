/**
 * Routing api calls to user controller functions
 */
const express=require("express");
const checkLogin=require("../middleware/authenticateMiddleware.js");
module.exports = app => {
    const users = require("../controller/userController");
    var router = express.Router();
  
    router.post("/signup", users.create);

    router.post("/login", users.findOneLogin);

    router.route("/profile").get(checkLogin,users.getProfile);
    router.put("/changeEmail",checkLogin,users.changeEmail);
    router.put("/changePassword",checkLogin,users.changePassword);
    router.post("/forgotPassword",users.forgotPasswordSendEmail);
    router.put("/resetPassword",users.resetPassword);
    app.use('/api/users', router);
  };