/**
 * HELP
 *
 * ```
 * @rota help
 * ```
 *
 * Provides instructions on how to use Rota
 */
export default async function helpRotation(
  app: any,
  ec: any,
  utils: any,
  helpBlocks: any,
  msgText: any,
  errHandler: any
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
}
