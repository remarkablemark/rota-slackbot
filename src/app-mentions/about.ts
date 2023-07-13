/**
 * ABOUT
 *
 * ```
 * @rota "[rotation]" about
 * ```
 *
 * Provides description and assignment for specified rotation
 */
export default async function aboutRotation(
  app: any,
  event: any,
  context: any,
  ec: any,
  utils: any,
  store: any,
  msgText: any,
  errHandler: any,
) {
  try {
    const pCmd = await utils.parseCmd('about', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, display its information
      const rotationObj = await store.getRotation(rotation);
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.aboutReport(rotation, rotationObj),
        ),
      );
      if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
        // Send ephemeral message with staff (to save notifications)
        // Do nothing if coming from a slackbot
        await app.client.chat.postEphemeral(
          utils.msgConfigEph(
            ec.botToken,
            ec.channelID,
            ec.sentByUserID,
            msgText.aboutStaffEph(rotation, rotationObj.staff),
          ),
        );
      }
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.aboutError(rotation),
        ),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
