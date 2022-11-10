const express=require("express");
module.exports = app => {
    const users = require("../controller/userController");
    var router = express.Router();
  
    // Create a new Tutorial
    router.post("/signup", users.create);

    // Retrieve a single Tutorial with id
    router.post("/login", users.findOneLogin);
  
  
    app.use('/api/users', router);
  };