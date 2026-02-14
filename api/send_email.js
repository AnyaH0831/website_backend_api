const nodemailer = require("nodemailer");

// Allowed origins
const allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'https://personal-website-renovation.vercel.app'
];

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

module.exports = async (req, res) => {
    // Get origin from request
    const origin = req.headers.origin;
    
    // Set CORS headers
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
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

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ error: "Error sending email" });
    }

};