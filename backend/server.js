const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sharp = require('sharp');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

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

// Resend Setup
const resend = new Resend(process.env.RESEND_API_KEY);

// --- API ROUTES ---

// 1. Mood Route
app.post('/api/mood', async (req, res) => {
  try {
    const { mood, message } = req.body;
    console.log(`📩 Sending Mood Email: ${mood}`);

    const response = await resend.emails.send({
      from: 'Queen Love <onboarding@resend.dev>',
      to: [process.env.RECEIVER_EMAIL],
      subject: `Queen's Mood: ${mood} ❤️`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #fff0fa; border: 2px solid #FF1493; border-radius: 15px;">
          <h2 style="color: #FF1493;">👑 Mood Alert</h2>
          <p><strong>Feeling:</strong> ${mood}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p style="font-size: 12px; color: #888;">Time: ${new Date().toLocaleString('en-IN')}</p>
        </div>
      `
    });

    console.log("✅ Resend Success:", response);
    res.json({ success: true, id: response.id });
  } catch (error) {
    console.error("❌ Mood Email Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Romantic Vault Route
app.post('/api/romantic-reveal', async (req, res) => {
  try {
    const { moodScore, selfObsessionScore, bhau, image, signature, message } = req.body;
    
    if (!image || !signature) {
      return res.status(400).json({ success: false, message: "Missing image or signature" });
    }

    // Clean base64 strings
    const imgBase64 = image.includes("base64,") ? image.split("base64,")[1] : image;
    const sigBase64 = signature.includes("base64,") ? signature.split("base64,")[1] : signature;

    const imgBuffer = Buffer.from(imgBase64, 'base64');
    const compressedImg = await sharp(imgBuffer)
      .resize({ width: 1000 })
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log("📩 Sending Vault Email...");

    const response = await resend.emails.send({
      from: 'Queen Vault <onboarding@resend.dev>',
      to: [process.env.RECEIVER_EMAIL],
      subject: "🔥 VAULT OPENED: Queen's Secret! 🔥",
      html: `
        <div style="background:#000; color:#fff; padding:30px; border-radius:20px; text-align:center;">
          <h1 style="color:#FF1493;">VAULT UNLOCKED ❤️</h1>
          <p>Romantic Mood: ${moodScore}%</p>
          <p>Demand: ${bhau}</p>
          <p><i>"${message}"</i></p>
        </div>
      `,
      attachments: [
        { filename: 'secret_pic.jpg', content: compressedImg.toString('base64') },
        { filename: 'signature.png', content: sigBase64 }
      ]
    });

    console.log("✅ Vault Success:", response);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Vault Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Orders Route
app.post('/api/orders', async (req, res) => {
  try {
    const { items, loveNote } = req.body;
    const newOrder = new Order({ items, loveNote, totalItems: items.length });
    await newOrder.save();

    const itemsHTML = items.map(item => `<li>${item.name} (${item.selectedQty})</li>`).join('');

    const response = await resend.emails.send({
      from: 'Queen Treats <onboarding@resend.dev>',
      to: [process.env.RECEIVER_EMAIL],
      subject: `🎉 NEW ROYAL ORDER!`,
      html: `<h2>Order Received</h2><ul>${itemsHTML}</ul><p>Note: ${loveNote}</p>`
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Order Error:", error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
