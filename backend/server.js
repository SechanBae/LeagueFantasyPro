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
require("./routes/leaguesRoutes")(app);
require("./routes/teamRoutes")(app);
require("./routes/playerRoutes")(app);
db.sequelize.sync()
    .then(()=>{
        console.log("Synced db.");
    })
    .catch((err)=>{
        console.log("Failed to sync db: "+err.message);
    });
const server=app.listen(5000, console.log("Server started on port 5000"));

const io =require("socket.io")(server,{
    pingTimeout: 60000,
    cors: {
    origin: "http://localhost:3000",
   
  }
})
console.log("hello");
io.on("connection",(socket)=>{
    console.log("Connected to Socket");
})