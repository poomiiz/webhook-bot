// server.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log(req.body); // รับ event จาก Dialogflow หรือ LINE
  // process ข้อมูล & ตอบกลับ
  res.json({ reply: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on', PORT));
