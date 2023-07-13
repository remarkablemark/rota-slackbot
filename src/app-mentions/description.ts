/**
 * DESCRIPTION
 *
 * ```
 * @rota "[rotation-name]" description [new description]
 * ```
 *
 * Updates the description for an existing rotation
 */
export default async function descriptionRotation(
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
    const pCmd = await utils.parseCmd('description', event, context);
    const rotation = pCmd.rotation;
    const description = pCmd.description;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      if (!description.length) {
        // If there is no description, send an error message
        // This is unlikely to happen but possible if the user entered a whitespace and nothing else
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.descEmpty(rotation),
          ),
        );
      } else {
        // Rotation exists and description isn't falsey
        // Save to store
        await store.updateDescription(rotation, description);
        // Confirm in channel with message about updating description
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.descConfirm(rotation, description),
          ),
        );
      }
    } else {
      // Rotation doesn't exist; prompt to create it first
      await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.descError(rotation)),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
