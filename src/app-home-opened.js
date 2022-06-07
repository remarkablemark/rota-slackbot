const homeBlocks = require('./bot-response/blocks-home');
const store = require('./data/db');

/**
 * APP HOME OPENED
 */
module.exports = function app_home_opened(app) {
  app.event('app_home_opened', async ({ event, context }) => {
    const userID = event.user;
    const storeList = await store.getRotations();
    try {
      // show home view
      await app.client.views.publish({
        token: context.botToken,
        user_id: userID,
        view: {
          type: 'home',
          blocks: homeBlocks(userID, storeList),
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
};
