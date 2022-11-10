const express = require("express");
const mysql=require("mysql2");
const cors=require("cors");
const userRoutes=require("./routes/userRoutes");
const db=require("./models");

const app=express();
var corsOptions={
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions));
app.use(express.json());
require("./routes/userRoutes")(app);
db.sequelize.sync({force:true})
    .then(()=>{
        console.log("Synced db.");
    })
    .catch((err)=>{
        console.log("Failed to sync db: "+err.message);
    });
app.listen(5000, console.log("Server started on port 5000"));