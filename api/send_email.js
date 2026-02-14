const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173', 'https://personal-website-renovation.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Handle preflight requests
app.options('*', cors());

app.post("/", (req, res) => {
    const {name, from, subject, message} = req.body;

    const fullMessage = `Name: ${name}\nSender's Email: ${from}\nSubject: ${subject}\n\nMessage:\n${message}`;
    
    console.log("full", fullMessage);

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        replyTo: from, 
        to: process.env.EMAIL_TO,
        subject: `Website Contact: ${subject}`,
        text: fullMessage
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            res.status(500).json({ error: "Error sending email" });
        }else{
            console.log("Email sent: ", info.response);
            res.status(200).json({ message: "Email sent successfully" });
        }
    });
});



module.exports = app;