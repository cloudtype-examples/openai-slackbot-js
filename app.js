import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { SocketModeClient } from '@slack/socket-mode';
import openai from 'openai';
import dotenv from 'dotenv';

dotenv.config();

openai.apiKey = process.env.OPENAI_API_KEY;

const appToken = "xapp-1-A051N538KEK-5056183605415-8fe7821f4408f890f0caff4f048cedc03ea0354e2eebf57b7008b91ceaf9b2de";
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
console.log(slackSigningSecret);

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const slackEvents = createEventAdapter("61672949189633c17040e4f46c097cd8");
const socketModeClient = new SocketModeClient({ appToken });

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
  slackEvents.on('message', handleMessage);
  console.log(handleMessage);
})();
