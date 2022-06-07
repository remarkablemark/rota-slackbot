/**
 * RESET STAFF
 *
 * ```
 * @rota "[rotation]" reset staff
 * ```
 *
 * Removes rotation staff
 */
module.exports = async function resetStaffRotation(
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
    const pCmd = await utils.parseCmd('reset staff', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, set staff to an empty array
      await store.saveStaff(rotation, []);
      // Send message to confirm staff has been reset
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.resetStaffConfirm(rotation)
        )
      );
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.resetStaffError(rotation)
        )
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
};
