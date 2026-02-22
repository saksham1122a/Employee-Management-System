const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Simple test endpoint
app.post('/api/test', (req, res) => {
  console.log('Test endpoint hit:', req.body);
  res.json({ message: 'Test successful', received: req.body });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});
