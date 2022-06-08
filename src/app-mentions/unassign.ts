/**
 * UNASSIGN
 *
 * ```
 * @rota "[rotation]" unassign
 * ```
 *
 * Clears the assignment for a rotation
 */
export default async function unassignRotation(
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
    const pCmd = await utils.parseCmd('unassign', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      const rotationObj = await store.getRotation(rotation);
      // If rotation exists, check if someone is assigned
      if (rotationObj.assigned) {
        // If someone is currently assigned, clear
        await store.saveAssignment(rotation, null);
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.unassignConfirm(rotation)
          )
        );
      } else {
        // If nobody is assigned
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.unassignNoAssignment(rotation)
          )
        );
      }
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.unassignError(rotation)
        )
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
