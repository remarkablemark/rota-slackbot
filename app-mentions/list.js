/*------------------
  LIST
  @rota list
  Lists all rotations, descriptions, and assignments
------------------*/
module.exports = async (app, ec, utils, msgText, errHandler) => {
  try {
    // If the store is not empty
    if (ec.rotaList && ec.rotaList.length) {
      await app.client.chat.postMessage(
        utils.msgConfig(
          ec.botToken,
          ec.channelID,
          msgText.listReport(ec.rotaList)
        )
      );
    } else {
      // If store is empty
      await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.listEmpty())
      );
    }
  } catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};
