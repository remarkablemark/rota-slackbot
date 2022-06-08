/**
 * DELETE
 *
 * ```
 * @rota delete "[rotation]"
 * ```
 *
 * Deletes an existing rotation
 */
export default async function deleteRotation(
  app: any,
  event: any,
  context: any,
  ec: any,
  utils: any,
  store: any,
  msgText: any,
  errHandler: any
) {
  try {
    const pCmd = await utils.parseCmd('delete', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, delete from store completely
      await store.deleteRotation(rotation);
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.deleteConfirm(rotation)
        )
      );
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.deleteError(rotation)
        )
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
