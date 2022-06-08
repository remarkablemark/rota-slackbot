import homeBlocks from './bot-response/blocks-home';
import * as store from './data/db';

/**
 * APP HOME OPENED
 */
export default function app_home_opened(app: any) {
  app.event('app_home_opened', async ({ event, context }: any) => {
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
}
