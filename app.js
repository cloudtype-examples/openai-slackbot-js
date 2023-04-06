import * as dotenv from 'dotenv'
dotenv.config()
import pkg from '@slack/bolt';
import openai from 'openai';
const { App, HTTPReceiver } = pkg;


openai.apiKey = process.env.OPENAI_API_KEY;

const httpReceiver = new HTTPReceiver({
    unhandledRequestHandler: (args) => { console.warn('uh oh unhandled request'); }
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: httpReceiver,
  signatureVerification: false,
});

const generateResponse = async (text) => {
  const response = await openai.complete({
    engine: 'davinci',
    prompt: text,
    maxTokens: 60,
  });
  return response.choices[0].text.trim();
};

app.message(async ({ message, say }) => {
  try {
    const response = await generateResponse(message.text);
    await say(response);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('ChatGPT bot is running!');
})();