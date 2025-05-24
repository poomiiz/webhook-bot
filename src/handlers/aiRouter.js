const dialogflow = require('./dialogflow');
const { callGPT4o, callLlama3 } = require('../llmClients');

const aiModelPerIntent = {
  'Default Fallback Intent': 'gpt-4o',
  'ask_ai':                  'llama3',
};

module.exports = async function aiRouter(event, user) {
  const userText = event.message.text;
  const sessionId = event.source.userId;
  // 1. ตรวจสอบว่า match กับ intent ใน Dialogflow ไหม
  const dfData = await dialogflow(userText, sessionId);
  const intentName = dfData.queryResult.intent.displayName;

  let answer;
  if (aiModelPerIntent[intentName]) {
    // 2a. เลือกโมเดลตาม intent
    const model = aiModelPerIntent[intentName];
    if (model === 'gpt-4o')     answer = await callGPT4o(userText);
    else if (model === 'llama3') answer = await callLlama3(userText);
  } else if (shouldUseDialogflowOnly(intentName)) {
    // 2b. ถ้าเป็น canned intent ตอบ template จาก dfData
    answer = dfData.queryResult.fulfillmentText;
  } else {
    // 2c. free-form → ส่ง LLM โดยตรง
    answer = await callGPT4o(userText);
  }

  return answer;
};
