/**
 * Posts error message.
 */
export default async function handleError(
  app: any,
  ec: any,
  utils: any,
  error: any,
  msgText: any,
): Promise<void> {
  console.error(error);
  await app.client.chat.postMessage(
    utils.msgConfig(ec.botToken, ec.channelID, msgText.error(error)),
  );
}
