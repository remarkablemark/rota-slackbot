import { App } from '@slack/bolt';
import mongoose from 'mongoose';

import appHomeOpened from './app-home-opened';
import appMentions from './app-mentions';
import * as store from './data/db';
import { mongoUri, port, slackBotToken, slackSigningSecret } from './utils/env';

/**
 * ON INIT
 */
// Create Bolt app
const app = new App({
  token: slackBotToken,
  signingSecret: slackSigningSecret,
});

/**
 * MONGODB
 */
// Connect to MongoDB
mongoose.connect(mongoUri);
const db = mongoose.connection;

// Capture connection errors
db.on('error', (error) => {
  // console.error(`MongoDB Connection Error. Please make sure that ${process.env.MONGO_URI} is running.`);
  throw error;
});

// Open connection
db.once('open', () => {
  console.info('Connected to MongoDB');
  // console.info('Connected to MongoDB:', process.env.MONGO_URI);
});

/**
 * APP HOME OPENED
 */
appHomeOpened(app);

/**
 * APP MENTIONS
 */
appMentions(app, store);

/**
 * START APP
 */
app
  .start(port)
  .then(() => {
    console.log(`⚡️ Rota is running on ${port}!`);
  })
  .catch((error) => {
    throw error;
  });
