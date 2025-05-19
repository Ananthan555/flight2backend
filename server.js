const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure your email transporter (use your real email and app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anandawosome@gmail.com',
    pass: 'zzwrqvqszbqvjsuc' // Use an App Password, not your Gmail password
  }
});

app.post('/send-ticket', async (req, res) => {
  const { email, ticket } = req.body;

  const mailOptions = {
    from: 'YOUR_GMAIL@gmail.com',
    to: email,
    subject: 'Your GCD Airways Ticket',
    html: `
      <h2>Thank you for booking with GCD Airways!</h2>
      <p>Here are your ticket details:</p>
      <pre style="font-size:1.1em">${ticket}</pre>
      <p>We wish you a pleasant journey!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Ticket sent!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
