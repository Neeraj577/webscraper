const nodemailer = require("nodemailer");

// ── FILL THESE IN ──────────────────────────────────────────────
const YOUR_EMAIL = "dhakalneptasy@gmail.com"; // your Gmail address
const YOUR_PASSWORD = "qknsyryfmopqabry"; // Gmail App Password (step 4)
// ────

// 1. Create a "transporter" — this is like setting up your mail carrier
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: YOUR_EMAIL,
        pass: YOUR_PASSWORD,
    },
});

// 2. Write your email
const mailOptions = {
    from: YOUR_EMAIL,
    to: "nick.deuja045@gmail.com", // sending to yourself
    subject: "Hello from Node.js!",
    text: "It works! You just sent yourself an email using Node.js 🎉",
};

// 3. Send it!

async function sendMail(body, to = YOUR_EMAIL) {
    const mailOptions = {
        from: YOUR_EMAIL,
        to: to, // ← use it here
        subject: "🔮 Your Daily Horoscope",
        text: body,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Sent! ID:", info.messageId);
}

module.exports = { sendMail };