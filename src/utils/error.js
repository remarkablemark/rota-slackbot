/**
 * Posts error message.
 */
module.exports = async function handleError(app, ec, utils, error, msgText) {
  console.error(error);
  await app.client.chat.postMessage(
    utils.msgConfig(ec.botToken, ec.channelID, msgText.error(error))
  );
};
