const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json());

// Root route for base URL
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Endpoint to send ticket email
app.post('/send-ticket', async (req, res) => {
  const { email, ticket } = req.body;
  if (!email || !ticket) {
    return res.status(400).json({ success: false, message: "Missing email or ticket" });
  }

  // Use environment variables for credentials!
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,      // Set in Render environment
      pass: process.env.EMAIL_PASS       // Set in Render environment
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your GCD Airways Ticket',
      html: `<h2>Your Ticket Details</h2><pre>${ticket}</pre>`
    });
    res.json({ success: true, message: "Ticket sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Other endpoints
app.post('/api/flights/search', (req, res) => {
  const { from, to, departureDate } = req.body;
  if (!from || !to || !departureDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.json([{
    route: [
      { from: from, to: "Mumbai", departureTime: "09:00", arrivalTime: "11:30" },
      { from: "Mumbai", to: to, departureTime: "12:00", arrivalTime: "14:00" }
    ]
  }]);
});

app.post('/api/bookings', (req, res) => {
  res.json({ status: "Confirmed" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
