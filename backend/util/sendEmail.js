const nodemailer=require("nodemailer");
const Transport = require("nodemailer-sendinblue-transport");
require("dotenv").config();
exports.sendEmail=async(token,email)=>{
    const transporter = nodemailer.createTransport(
        new Transport({apiKey:process.env.EMAILAPI})
    );
    let info = await transporter.sendMail({
        from: '"LeagueFantasyPasswordRecovery" <leaguefantasypassrecovery@example.com>', 
        to: email,
        subject: "Password Reset Request",
        html: "<p>You have requested a password reset<a href='localhost:3000/passwordReset/"+token+"'> click here</a></p>",
      });
    return info;
}