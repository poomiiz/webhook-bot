const axios = require('axios');
module.exports = async function replyToLine(replyToken, text) {
  return axios.post(
    'https://api.line.me/v2/bot/message/reply',
    { replyToken, messages:[{ type:'text', text }] },
    { headers:{
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type':'application/json'
    }}
  );
};
