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

app.event("message", async ({ message, say }) => {

  console.log(message);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `${message.text}` }
      ],
    });

    console.log(response);
    await say(response.data.choices[0].message.content);
  } catch (err) {
    console.log(err);
    return await say("Error")
  }

});

app.event("app_mention", async ( { message, say }) => {

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `${message.text}` }
      ],
    });

    console.log(response);
    await say(response.data.choices[0].message.content);

  } catch (err) {
    console.log(err);
    return await say("Error")
  }
  
});


(async () => {
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();