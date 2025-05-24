// ===== server.js =====
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// --------- 1. รับ webhook event จาก LINE -----------
app.post('/webhook', async (req, res) => {
  try {
    // NOTE: ตรงนี้ขึ้นกับรูปแบบ event LINE (อาจต้องแปลง structure ตามที่ใช้จริง)
    const event = req.body.events && req.body.events[0];
    if (!event || event.type !== "message") return res.sendStatus(200);

    const userId = event.source.userId;
    const userText = event.message.text;

    // --------- 2. ส่งข้อความเข้า Dialogflow ----------
    const dialogflowRes = await detectIntentDialogflow(userText, userId);

    // --------- 3. ส่งข้อความตอบกลับ LINE -------------
    const replyText = dialogflowRes.data.fulfillmentText || "ขออภัย เกิดข้อผิดพลาด";
    await replyToLine(event.replyToken, replyText);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// --------- ฟังก์ชันยิงไป Dialogflow (V2 API) -------------
async function detectIntentDialogflow(text, userId) {
  // เปลี่ยน PROJECT_ID และ ENDPOINT ตาม agent ที่ใช้งานจริง
  const DIALOGFLOW_URL = process.env.DIALOGFLOW_URL || "https://dialogflow-endpoint-domain/webhook";
  // หรือถ้าใช้ Dialogflow API โดยตรง ต้องยิง Detect Intent API (ดู doc ของ Dialogflow)
  return axios.post(DIALOGFLOW_URL, {
    queryInput: {
      text: { text, languageCode: "th" }
    },
    queryParams: {
      session: userId
    }
  });
}

// --------- ฟังก์ชันส่งข้อความกลับ LINE -------------
async function replyToLine(replyToken, replyText) {
  return axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken,
      messages: [{ type: "text", text: replyText }]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('LINE Webhook listening on', PORT));
