import * as dotenv from 'dotenv'
dotenv.config()
import pkg from '@slack/bolt';
const { App } = pkg;
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});


app.message('Test', async ({ message, say }) => {
  await say(`Test: <@${message.user}>`);
});

app.event("message", async ({ event, say }) => {

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${event.text}`,
    temperature: 0.9,
    max_tokens: 300,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

  console.log(response);
  say(response.data.choices[0].text);
});

(async () => {
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();