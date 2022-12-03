/**
 * Main file for backend, starts port,routing,database, and websocket
 */
const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
require("./routes/userRoutes")(app);
require("./routes/leaguesRoutes")(app);
require("./routes/draftRoutes")(app);
require("./routes/playerRoutes")(app);
require("./routes/teamRoutes")(app);
require("./routes/performanceRoutes")(app);
require("./routes/tradeRoutes")(app);
require("./routes/messageRoutes")(app);

const __dirname1 = path.resolve();


db.sequelize
  .sync({ alter:true})
  .then(() => {
    console.log("Synced db.");
    /**
     * Creates admin user if it doesn't exist
     */
    const adminData = {
      username: "Admin",
      password: "$2a$10$GcLCquYT3uW86bodXAH2euB2Ox.GmAIlbU/SWNfh94aNkQC2gYv4C",
      isAdmin: true,
    };
    const admin = db.users
      .findOne({
        where: {
          username: "Admin",
          isAdmin: true,
        },
      })
      .then((a) => {
        if (!a) {
          db.users.create(adminData);
        }
      });
      if (process.env.NODE_ENV == "production") {
        app.use(express.static(path.join(__dirname1, "frontend/build")));
      
        app.get("*", (req, res) => {
          res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
        });
      } else {
      }
  })
  .catch((err) => {
    app.get("*",(req,res)=>{
      res.send("Database not working right now try again later");
    })
    console.log("Failed to sync db: " + err.message);
  });

app.set("port", process.env.PORT || 5000);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log("Server started on port 5000"));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
console.log("hello");
io.on("connection", (socket) => {
  console.log("Connected to Socket");
  socket.on("draftPickSubmit", (leagueId) => {
    socket.broadcast.emit("draftPickBroadcast", leagueId);
  });
  socket.on("messageSubmit", (leagueId) => {
    socket.broadcast.emit("messageBroadcast", leagueId);
  });
});
