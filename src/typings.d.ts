/// <reference types="node" />

// eslint-disable-next-line no-unused-vars
declare namespace NodeJS {
  // eslint-disable-next-line no-unused-vars
  interface ProcessEnv {
    readonly MONGO_URI: string;
    readonly NODE_ENV: 'development' | 'production';
    readonly PORT: string;
    readonly SLACK_BOT_TOKEN: string;
    readonly SLACK_SIGNING_SECRET: string;
  }
}
