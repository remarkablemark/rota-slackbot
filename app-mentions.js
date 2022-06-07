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

/**
 * APP MENTIONS
 */
module.exports = function app_mentions(app, store) {
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
    const [
      isNew,
      isDescription,
      isStaff,
      isResetStaff,
      isAssign,
      isAssignNext,
      isWho,
      isAbout,
      isUnassign,
      isDelete,
      isHelp,
      isList,
      testMessage,
    ] = Promise.all([
      utils.isCmd('new', ec.text),
      utils.isCmd('description', ec.text),
      utils.isCmd('staff', ec.text),
      utils.isCmd('reset staff', ec.text),
      utils.isCmd('assign', ec.text),
      utils.isCmd('assign next', ec.text),
      utils.isCmd('who', ec.text),
      utils.isCmd('about', ec.text),
      utils.isCmd('unassign', ec.text),
      utils.isCmd('delete', ec.text),
      utils.isCmd('help', ec.text),
      utils.isCmd('list', ec.text),
      utils.isCmd('message', ec.text),
    ]);

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

    switch (true) {
      // @rota new "[rotation]" [optional description]
      case isNew:
        cmdNew(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota "[rotation]" description [new description]
      case isDescription:
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
        break;

      // @rota "[rotation]" staff [@user @user @user]
      case isStaff:
        cmdStaff(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota "[rotation]" reset staff
      case isResetStaff:
        cmdResetStaff(
          app,
          event,
          context,
          ec,
          utils,
          store,
          msgText,
          errHandler
        );
        break;

      // @rota "[rotation]" delete
      case isDelete:
        cmdDelete(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota "[rotation]" about
      case isAbout:
        cmdAbout(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota "[rotation]" assign [@user] [handoff message]
      case isAssign:
        cmdAssign(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota "[rotation]" assign next [handoff message]
      case isAssignNext:
        cmdAssignNext(
          app,
          event,
          context,
          ec,
          utils,
          store,
          msgText,
          errHandler
        );
        break;

      // @rota "[rotation]" who
      case isWho:
        cmdWho(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota "[rotation]" unassign
      case isUnassign:
        cmdUnassign(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota list
      case isList:
        cmdList(app, ec, utils, msgText, errHandler);
        break;

      // @rota help
      case isHelp:
        cmdHelp(app, ec, utils, helpBlocks, msgText, errHandler);
        break;

      // @rota "[rotation]" free form message for on-call user
      case isMessage:
        cmdMessage(app, event, context, ec, utils, store, msgText, errHandler);
        break;

      // @rota anything else
      default:
        // console.log('Event: ', event, 'Clean Text: ', utils.cleanText(ec.text));
        try {
          await app.client.chat.postMessage(
            utils.msgConfig(
              ec.botToken,
              ec.channelID,
              msgText.didntUnderstand(ec, msgText)
            )
          );
        } catch (error) {
          errHandler(app, ec, utils, error, msgText);
        }
        break;
    }
  });
};
