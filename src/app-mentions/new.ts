/**
 * NEW
 *
 * ```
 * @rota new "[rotation-name]" [optional description]
 * ```
 *
 * Creates a new rotation with description
 */
export default async function newRotation(
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
    const pCmd = await utils.parseCmd('new', event, context);
    const rotation = pCmd.rotation;
    const description = pCmd.description;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // Can't create a rotation that already exists
      await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.newError(rotation)),
      );
    } else {
      // Initialize a new rotation with description
      await store.newRotation(rotation, description);
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.newConfirm(rotation),
        ),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
