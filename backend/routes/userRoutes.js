const express=require("express");
module.exports = app => {
    const users = require("../controller/userController");
    var router = express.Router();
  
    router.post("/signup", users.create);

    router.post("/login", users.findOneLogin);
  
    app.use('/api/users', router);
  };