require('dotenv').config();
const express = require('express');
const authMiddleware = require('./middleware/auth');
const aiRouterHandler  = require('./handlers/aiRouter');
const replyToLine       = require('./line');

const app = express();
app.use(express.json());

// ตรวจ token ก่อนทุกคำขอ
app.use(authMiddleware);

app.post('/webhook', async (req, res) => {
  const event = req.body.events?.[0];
  if (!event || event.type !== 'message') return res.sendStatus(200);

  try {
    const replyText = await aiRouterHandler(event, req.user);
    await replyToLine(event.replyToken, replyText);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on', PORT));
