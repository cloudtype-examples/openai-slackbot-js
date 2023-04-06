import * as dotenv from 'dotenv'
dotenv.config()
import pkg from '@slack/bolt';
import openai from 'openai';
const { App } = pkg;


// Set up the OpenAI API credentials
openai.apiKey = process.env.OPENAI_API_KEY;


// Initialize the Slack Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Define the function to generate a response from the ChatGPT API
const generateResponse = async (text) => {
  const response = await openai.complete({
    engine: 'davinci',
    prompt: text,
    maxTokens: 60,
  });
  return response.choices[0].text.trim();
};

// Define the function to handle incoming Slack messages
app.message(async ({ message, say }) => {
  try {
    const response = await generateResponse(message.text);
    await say(response);
  } catch (error) {
    console.error(error);
  }
});

// Start the Slack Bolt app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('ChatGPT bot is running!');
})();