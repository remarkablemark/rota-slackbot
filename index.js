require('dotenv').config();
const { App } = require('@slack/bolt');
// MongoDB
const mongoose = require('mongoose');
const store = require('./data/db');

/*------------------
       ON INIT
------------------*/
// Create Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const port = process.env.PORT || 3000;

/*------------------
      MONGODB
------------------*/
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
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

/*------------------
  APP HOME OPENED
------------------*/
require('./app-home-opened')(app);

/*------------------
    APP MENTIONS
------------------*/
require('./app-mentions')(app, store);

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ Rota is running on ${port}!`);
})();
