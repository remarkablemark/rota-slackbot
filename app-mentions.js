const utils = require('./utils/utils');
const helpBlocks = require('./bot-response/blocks-help');
const msgText = require('./bot-response/message-text');
// Commands
const cmdNew = require('./app-mentions/new');
const cmdDescription = require('./app-mentions/description');
const cmdStaff = require('./app-mentions/staff');
const cmdResetStaff = require('./app-mentions/reset-staff');
const cmdDelete = require('./app-mentions/delete');
const cmdAbout = require('./app-mentions/about');
const cmdAssign = require('./app-mentions/assign');
const cmdAssignNext = require('./app-mentions/assign-next');
const cmdWho = require('./app-mentions/who');
const cmdUnassign = require('./app-mentions/unassign');
const cmdList = require('./app-mentions/list');
const cmdHelp = require('./app-mentions/help');
const cmdMessage = require('./app-mentions/message');
// Error handling
const errHandler = require('./utils/error');

/*------------------
    APP MENTIONS
------------------*/
const app_mentions = (app, store) => {
  app.event('app_mention', utils.ignoreMention, async ({ event, context }) => {
    // Event and context data
    const ec = {
      text: event.text, // raw text from the mention
      sentByUserID: event.user, // ID of user who sent the message
      channelID: event.channel, // channel ID
      botToken: context.botToken, // bot access token
      rotaList: await store.getRotations(), // rotations in db
    };
    // Decision logic establishing how to respond to mentions
    const isNew = await utils.isCmd('new', ec.text);
    const isDescription = await utils.isCmd('description', ec.text);
    const isStaff = await utils.isCmd('staff', ec.text);
    const isResetStaff = await utils.isCmd('reset staff', ec.text);
    const isAssign = await utils.isCmd('assign', ec.text);
    const isAssignNext = await utils.isCmd('assign next', ec.text);
    const isWho = await utils.isCmd('who', ec.text);
    const isAbout = await utils.isCmd('about', ec.text);
    const isUnassign = await utils.isCmd('unassign', ec.text);
    const isDelete = await utils.isCmd('delete', ec.text);
    const isHelp = await utils.isCmd('help', ec.text);
    const isList = await utils.isCmd('list', ec.text);
    const testMessage = await utils.isCmd('message', ec.text);
    const isMessage =
      testMessage &&
      !isNew &&
      !isDescription &&
      !isStaff &&
      !isResetStaff &&
      !isAssign &&
      !isAssignNext &&
      !isWho &&
      !isAbout &&
      !isUnassign &&
      !isDelete;

    // @rota new "[rotation]" [optional description]
    if (isNew) {
      cmdNew(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isDescription) {
      // @rota "[rotation]" description [new description]
      cmdDescription(
        app,
        event,
        context,
        ec,
        utils,
        store,
        msgText,
        errHandler
      );
    } else if (isStaff) {
      // @rota "[rotation]" staff [@user @user @user]
      cmdStaff(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isResetStaff) {
      // @rota "[rotation]" reset staff
      cmdResetStaff(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isDelete) {
      // @rota "[rotation]" delete
      cmdDelete(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isAbout) {
      // @rota "[rotation]" about
      cmdAbout(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isAssign) {
      // @rota "[rotation]" assign [@user] [handoff message]
      cmdAssign(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isAssignNext) {
      // @rota "[rotation]" assign next [handoff message]
      cmdAssignNext(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isWho) {
      // @rota "[rotation]" who
      cmdWho(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isUnassign) {
      // @rota "[rotation]" unassign
      cmdUnassign(app, event, context, ec, utils, store, msgText, errHandler);
    } else if (isList) {
      // @rota list
      cmdList(app, ec, utils, msgText, errHandler);
    } else if (isHelp) {
      // @rota help
      cmdHelp(app, ec, utils, helpBlocks, msgText, errHandler);
    } else if (isMessage) {
      // @rota "[rotation]" free form message for on-call user
      cmdMessage(app, event, context, ec, utils, store, msgText, errHandler);
    } else {
      // @rota anything else
      try {
        // console.log('Event: ', event, 'Clean Text: ', utils.cleanText(ec.text));
        await app.client.chat.postMessage(
          utils.msgConfig(
            ec.botToken,
            ec.channelID,
            msgText.didntUnderstand(ec, msgText)
          )
        );
      } catch (err) {
        errHandler(app, ec, utils, err, msgText);
      }
    }
  });
};

module.exports = app_mentions;
