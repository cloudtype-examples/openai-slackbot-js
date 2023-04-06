import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { SocketModeClient } from '@slack/socket-mode';
import openai from 'openai';
import dotenv from 'dotenv';

dotenv.config();

openai.apiKey = process.env.OPENAI_API_KEY;

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;


const webClient = new WebClient(SLACK_BOT_TOKEN);
const eventAdapter = createEventAdapter('');
const socketModeClient = new SocketModeClient({ appToken: SLACK_APP_TOKEN });

const generateResponse = async (text) => {
  const response = await openai.complete({
    engine: 'davinci',
    prompt: text,
    maxTokens: 60,
  });
  console.log(response);
  return response.choices[0].text.trim();
};

const handleMessage = async (event) => {
  try {
    const { text, channel } = event;
    const response = await generateResponse(text);
    await webClient.chat.postMessage({
      channel,
      text: response,
    });
  } catch (error) {
    console.error(error);
  }
};


(async () => {
  await socketModeClient.start();
  eventAdapter.on('message', handleMessage);
  console.log(handleMessage);
})();
