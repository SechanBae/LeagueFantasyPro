const db=require("../models");
const User=db.user;
const League=db.league;

exports.create=(req,res)=>{
    return League.create({
        name:req.body.name,
        region:req.body.region
    })
        .then((league)=>{
            console.log(league);
        })
        .catch((err)=>{
            console.log(err);
        })
}

