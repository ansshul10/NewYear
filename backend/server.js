const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const sharp = require('sharp');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      name: String,
      selectedQty: String,
      nickname: String,
      loveMsg: String
    }
  ],
  loveNote: { type: String, default: '' },
  totalItems: { type: Number },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Nodemailer Transporter - Proper SMTP Config for Gmail Port 587
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS // Must be Gmail App Password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection on startup
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP Connection Failed:', err.message);
  } else {
    console.log('✅ SMTP Ready - Emails will be sent via port 587');
  }
});

// Mood Route
app.post('/api/mood', async (req, res) => {
  try {
    const { mood, message } = req.body;

    const mailOptions = {
      from: `"Queen's Love" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `Queen's Mood: ${mood} ❤️`,
      html: `
        <div style="font-family: Georgia; padding: 30px; background: #fff0fa; border: 3px solid #FF69B4; border-radius: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #FF1493; text-align: center;">👑 Royal Mood Alert 👑</h2>
          <p style="font-size: 20px; text-align: center;"><strong>Feeling:</strong> ${mood}</p>
          <blockquote style="font-style: italic; color: #666; background: white; padding: 20px; border-left: 5px solid #FF1493; margin: 25px 0;">
            "${message}"
          </blockquote>
          <p style="text-align: center; color: #888; font-size: 14px;">${new Date().toLocaleString('en-IN')}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Mood Error:", error);
    res.status(500).json({ success: false });
  }
});

// Romantic Vault Route
app.post('/api/romantic-reveal', async (req, res) => {
  try {
    const { moodScore, selfObsessionScore, bhau, image, signature, message } = req.body;
    if (!image || !signature) return res.status(400).json({ success: false });

    const imgBuffer = Buffer.from(image.split("base64,")[1], 'base64');
    const sigBuffer = Buffer.from(signature.split("base64,")[1], 'base64');

    const compressedImg = await sharp(imgBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();

    const mailOptions = {
      from: `"Queen's Vault" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "🔥 VAULT OPENED: Queen's Secret Revealed! 🔥",
      html: `
        <div style="background:#000;color:#fff;padding:40px;font-family:Arial;border:5px double #FF1493;border-radius:30px;text-align:center;max-width:700px;margin:auto;">
          <h1 style="color:#FF1493;font-size:40px;">VAULT UNLOCKED ❤️</h1>
          <p style="font-size:22px;">Romantic Mood: <strong>${moodScore}% 🥵</strong></p>
          <p style="font-size:22px;">Beauty Level: <strong>${selfObsessionScore}% ✨</strong></p>
          <p style="font-size:20px;">Demand: <strong>${bhau || 'Pure Love 😇'}</strong></p>
          <p style="font-style:italic;margin:30px;font-size:20px;">"${message}"</p>
          <p style="color:#FF69B4;font-size:24px;">Photo + Signature Attached Below 👇</p>
        </div>
      `,
      attachments: [
        { filename: 'queen_secret.jpg', content: compressedImg },
        { filename: 'royal_signature.png', content: sigBuffer }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Vault Error:", error);
    res.status(500).json({ success: false });
  }
});

// Orders Route
app.post('/api/orders', async (req, res) => {
  try {
    const { items, loveNote } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Basket is empty!" });
    }

    const newOrder = new Order({
      items,
      loveNote: loveNote || "No note ❤️",
      totalItems: items.length
    });
    await newOrder.save();

    const itemsHTML = items.map((item, idx) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px dotted #FF69B4;">
          <strong>${idx + 1}. ${item.nickname || item.name}</strong>
          <br><span style="color:#FF69B4;font-size:14px;">(${item.selectedQty})</span>
          ${item.loveMsg ? `<br><em style="color:#D4AF37;">"${item.loveMsg}"</em>` : ''}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Queen's Treats" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `🎉 NEW ROYAL ORDER! ${items.length} Treat${items.length > 1 ? 's' : ''} Ordered ❤️`,
      html: `
        <div style="max-width:700px;margin:auto;font-family:'Georgia',serif;background:linear-gradient(to bottom,#fff8fb,#ffffff);padding:40px;border:6px double #FF1493;border-radius:30px;">
          <h1 style="color:#FF1493;text-align:center;font-size:36px;">👑 QUEEN'S ORDER RECEIVED 👑</h1>
          <p style="text-align:center;font-size:20px;color:#D4AF37;">
            <strong>Total Items:</strong> ${items.length} ❤️
          </p>
          <div style="background:#fff;padding:25px;border-radius:20px;border:2px solid #FF69B4;margin:30px 0;">
            <h2 style="color:#FF1493;text-align:center;margin-bottom:20px;">Ordered Treats:</h2>
            <table style="width:100%;border-collapse:collapse;">
              ${itemsHTML}
            </table>
          </div>
          ${loveNote ? `
            <div style="background:#f0e6ff;padding:20px;border-radius:15px;border-left:6px solid #FF1493;margin:30px 0;">
              <p style="font-size:18px;font-style:italic;color:#555;margin:0;">
                <strong>💌 Secret Love Note from Queen:</strong><br>"${loveNote}"
              </p>
            </div>
          ` : ''}
          <div style="text-align:center;margin-top:40px;">
            <p style="color:#FF69B4;font-size:24px;font-weight:bold;">Delivery: 6:30 PM - 7:00 PM</p>
            <p style="color:#888;font-size:14px;">Order placed: ${new Date().toLocaleString('en-IN')}</p>
          </div>
          <p style="text-align:center;color:#FF1493;font-size:18px;margin-top:40px;">
            Your delivery partner is already blushing while packing... 😊
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Order placed! Email sent ❤️", orderId: newOrder._id });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Sending from: ${process.env.SMTP_USER}`);
  console.log(`📬 Delivering to: ${process.env.RECEIVER_EMAIL}`);
});
