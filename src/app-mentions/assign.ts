/**
 * ASSIGN
 *
 * ```
 * @rota "[rotation]" assign [@user] [handoff message]
 * ```
 *
 * Assigns a user to specified rotation
 */
export default async function assignRotation(
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
    const pCmd = await utils.parseCmd('assign', event, context);
    const rotation = pCmd.rotation;
    const usermention = pCmd.user;
    const handoffMsg = pCmd.handoff;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // Assign user in store
      await store.saveAssignment(rotation, usermention);
      // Confirm assignment in channel
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.assignConfirm(usermention, rotation),
        ),
      );
      if (handoffMsg) {
        // Send DM to newly assigned user notifying them of the handoff message
        const oncallUserDMChannel = utils.getUserID(usermention);
        const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${
          ec.channelID
        }/p${event.ts.replace('.', '')}`;
        // Send DM to on-call user notifying them of the message that needs their attention
        await app.client.chat.postMessage(
          utils.msgConfigBlocks(
            ec.botToken,
            oncallUserDMChannel,
            msgText.assignDMHandoffBlocks(
              rotation,
              link,
              ec.sentByUserID,
              ec.channelID,
              handoffMsg,
            ),
          ),
        );
        if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
          // Send ephemeral message in channel notifying assigner their handoff message has been delivered via DM
          await app.client.chat.postEphemeral(
            utils.msgConfigEph(
              ec.botToken,
              ec.channelID,
              ec.sentByUserID,
              msgText.assignHandoffConfirm(usermention, rotation),
            ),
          );
        }
      }
    } else {
      // If rotation doesn't exist, send message saying so
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.assignError(rotation),
        ),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
