import { config } from 'dotenv';

config();

export const mongoUri = process.env.MONGO_URI;
export const port = Number(process.env.PORT) || 3000;
export const slackBotToken = process.env.SLACK_BOT_TOKEN;
export const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
