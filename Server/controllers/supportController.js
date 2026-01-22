const nodemailer = require("nodemailer");
const SupportMessage = require("../Models/support");

// Create transporter once
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

exports.sendSupportEmail = async (req, res) => {
    let { name, email, message } = req.body;

    name = name?.trim();
    email = email?.trim();
    message = message?.trim();

    if (!email || !message) {
        return res.status(400).json({
            error: "Email and message are required",
            type: "user",
        });
    }

    try {
        // 1️⃣ Save message first (guarantees no loss)
        const supportMessage = await SupportMessage.create({
            name,
            email,
            message,
            user: req.user?._id || null, // optional if authenticated
        });

        // 2️⃣ Send email
        await transporter.sendMail({
            from: `"Support Form" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: "Support Request / Help",

            text: `
New Support Message

Name: ${name || "N/A"}
Email: ${email}

Message:
${message}
      `,

            html: `
        <h3>New Support Message</h3>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
        });

        res.status(200).json({
            success: true,
            id: supportMessage._id,
        });
    } catch (err) {
        console.error("Support email error:", err);
        res.status(500).json({
            error: "Failed to send support message",
            type: "server",
        });
    }
};
