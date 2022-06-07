/**
 * DELETE
 *
 * ```
 * @rota delete "[rotation]"
 * ```
 *
 * Deletes an existing rotation
 */
module.exports = async function deleteRotation(
  app,
  event,
  context,
  ec,
  utils,
  store,
  msgText,
  errHandler
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
};
