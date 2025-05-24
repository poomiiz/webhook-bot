const axios = require('axios');
module.exports = async function detectIntent(text, sessionId) {
  const URL = process.env.DIALOGFLOW_URL;
  const res = await axios.post(URL, {
    queryInput: { text: { text, languageCode: 'th' } },
    queryParams:{ session: sessionId }
  });
  return res.data;  // { queryResult: { intent, queryText, parameters, ... } }
};
