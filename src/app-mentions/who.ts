/**
 * WHO
 *
 * ```
 * @rota "[rotation]" who
 * ```
 *
 * Reports who the assigned user is for a rotation
 */
export default async function whoRotation(
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
    const pCmd = await utils.parseCmd('who', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, display its information
      const rotationObj = await store.getRotation(rotation);
      if (rotationObj.assigned) {
        // If someone is currently assigned, report who
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.whoReport(rotationObj.assigned, rotation),
          ),
        );
      } else {
        // If nobody is assigned
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.nobodyAssigned(rotation),
          ),
        );
      }
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.whoError(rotation)),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
