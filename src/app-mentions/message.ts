/**
 * (MESSAGE)
 *
 * ```
 * @rota "[rotation]" free form message for on-call user
 * ```
 *
 * Send message to on-call user via DM with link to channel
 */
export default async function messageRotation(
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
    const pCmd = await utils.parseCmd('message', event, context);
    const rotation = pCmd.rotation;
    // Check if rotation exists
    if (utils.rotationInList(rotation, ec.rotaList)) {
      const rotationObj = await store.getRotation(rotation);
      const oncallUser = rotationObj.assigned;

      if (oncallUser) {
        // If someone is assigned to concierge...
        const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${
          ec.channelID
        }/p${event.ts.replace('.', '')}`;
        const oncallUserDMChannel = utils.getUserID(oncallUser);
        // Send DM to on-call user notifying them of the message that needs their attention
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            oncallUserDMChannel,
            msgText.dmToAssigned(rotation, ec.sentByUserID, ec.channelID, link),
          ),
        );
        // Send message to the channel where help was requested notifying that assigned user was contacted
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.confirmChannelMsg(rotation, ec.sentByUserID),
          ),
        );
        if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
          // Send ephemeral message (only visible to sender) telling them what to do if urgent
          // Do nothing if coming from a slackbot
          await app.client.chat.postEphemeral(
            utils.msgConfigEph(
              ec.botToken,
              ec.channelID,
              ec.sentByUserID,
              msgText.confirmEphemeralMsg(rotation),
            ),
          );
        }
      } else {
        // Rotation is not assigned; give instructions how to assign
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.nobodyAssigned(rotation),
          ),
        );
      }
    } else {
      // Rotation doesn't exist
      await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.msgError(rotation)),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
