/**
 * STAFF
 *
 * ```
 * @rota "[rotation-name]" staff [@user @user @user]
 * ```
 *
 * Staffs a rotation by passing a space-separated list of users
 * Also allows comma-separated lists; fairly robust against extra spaces/commas
 */
export default async function staffRotation(
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
    const pCmd = await utils.parseCmd('staff', event, context);
    const rotation = pCmd.rotation;
    const staff = pCmd.staff;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      if (!staff.length) {
        // If staff array is empty, send an error message
        // This is unlikely to happen but possible if there's a really malformed command
        await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.staffEmpty()),
        );
      } else {
        // Rotation exists and parameter staff list isn't empty
        // Save to store
        await store.saveStaff(rotation, staff);
        // Confirm in channel with message about using assign next
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.staffConfirm(rotation),
          ),
        );
      }
    } else {
      // Rotation doesn't exist; prompt to create it first
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.staffError(rotation),
        ),
      );
    }
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
}
