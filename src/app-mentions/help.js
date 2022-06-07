/**
 * HELP
 *
 * ```
 * @rota help
 * ```
 *
 * Provides instructions on how to use Rota
 */
module.exports = async function helpRotation(
  app,
  ec,
  utils,
  helpBlocks,
  msgText,
  errHandler
) {
  try {
    await app.client.chat.postMessage({
      token: ec.botToken,
      channel: ec.channelID,
      blocks: helpBlocks(),
    });
  } catch (error) {
    errHandler(app, ec, utils, error, msgText);
  }
};
