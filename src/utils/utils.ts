/**
 * UTILITIES
 */

export const regex = {
  // @rota new "[new-rotation-name]" [optional description]
  // Create a new rotation
  new: /^<@(U[A-Z0-9]+?)> (new) "([a-z0-9-]+?)"(.*)$/g,

  // @rota "[rotation]" description [description]
  // Update description for an existing rotation
  description: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (description)(.*)$/g,

  // @rota "[rotation]" staff [@username, @username, @username]
  // Accepts a space-separated list of usernames to staff a rotation
  // List of mentions has to start with <@U and end with > but can contain spaces, commas, multiple user mentions
  staff: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (staff) (<@U[<@>A-Z0-9,\s]+?>)$/g,

  // @rota "[rotation]" reset staff
  // Removes rotation staff list
  'reset staff': /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (reset staff)$/g,

  // Capture user ID only from
  // <@U03LKJ> or <@U0345|name>
  userID: /^<@([A-Z0-9]+?)[a-z|._-]*?>$/g,

  // @rota "[rotation]" assign [@username] [optional handoff message]
  // Assigns a user to a rotation
  assign: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (assign) (<@U[A-Z0-9]+?>)(.*)$/g,

  // @rota "[rotation]" assign next [optional handoff message]
  // Assigns a user to a rotation
  'assign next': /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (assign next)(.*)$/g,

  // @rota "[rotation]" who
  // Responds stating who is on-call for a rotation
  who: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (who)$/g,

  // @rota "[rotation]" about
  // Responds with description and mention of on-call for a rotation
  // Sends ephemeral staff list (to save everyone's notifications)
  about: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (about)$/g,

  // @rota "[rotation]" unassign
  // Unassigns rotation
  unassign: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (unassign)$/g,

  // @rota delete "[rotation]"
  // Removes the rotation completely
  delete: /^<@(U[A-Z0-9]+?)> (delete) "([a-z0-9-]+?)"$/g,

  // @rota help
  // Post help messaging
  help: /^<@(U[A-Z0-9]+?)> (help)$/g,

  // @rota list
  // List all rotations in store
  list: /^<@(U[A-Z0-9]+?)> (list)$/g,

  // @rota "[rotation]" any other message
  // Message does not contain a command
  // Sends message text
  message: /^<@(U[A-Z0-9]+?)> "([a-z0-9-]+?)" (.*)$/g,
};

type Command = keyof typeof regex;

/**
 * Clean up message text so it can be tested / parsed.
 *
 * @param msg - Original message text.
 * @returns - Trimmed and cleaned message text.
 */
export function cleanText(msg: string): string {
  const cleanMsg = msg
    .replace('Reminder: ', '')
    .replace("_(sent with '/gator')_", '')
    .replace(/\|[a-z0-9._-]+?>/g, '>') // Remove username if present in mentions
    .replace(/“/g, '"')
    .replace(/”/g, '"') // Slack decided to use smart quotes (ugh)
    .trim();
  return cleanMsg;
}

/**
 * Get user ID from mention.
 *
 * @param usermention - User mention <@U324SDF> or <@U0435|some.user>.
 * @returns - User ID U324SDF.
 */
export function getUserID(usermention: string): string {
  return [...usermention.matchAll(new RegExp(regex.userID))][0][1];
}

/**
 * See if a rotation exists (by name).
 *
 * @param rotaname - Name of rotation to check if exists.
 * @param list - List of existing rotation names.
 * @returns - Does the rotation exist?
 */
export function rotationInList(
  rotaname: string,
  list: { name: string }[]
): boolean {
  if (list && list.length) {
    return list.filter((rotation) => rotation.name === rotaname).length > 0;
  }
  return false;
}

/**
 * Test message to see if its format matches expectations for specific command.
 * Need to new RegExp to execute on runtime.
 *
 * @param cmd - Command.
 * @param input - Mention text.
 * @returns - Does text match an existing command?
 */
export function isCmd(cmd: Command, input: string): boolean {
  const msg = cleanText(input);
  return new RegExp(regex[cmd]).test(msg);
}

/**
 * Parse app mention command text.
 *
 * @param cmd - Text command.
 * @param event - Event.
 * @param context - Context.
 * @returns - Object containing rotation, command, user, data.
 */
export function parseCmd(cmd: Command, event: any, context: any) {
  // Match text using regex associated with the passed command
  const [result] = [...cleanText(event.text).matchAll(new RegExp(regex[cmd]))];

  // If not a properly formatted command, return null
  // This should trigger error messaging
  if (!Array.isArray(result) || !result[1].includes(context.botUserId)) {
    return null;
  }

  // Regex returned expected match appropriate for the command
  // Command begins with rota bot mention
  switch (cmd) {
    // Rotation, command, usermention, freeform text
    case 'assign':
      return {
        rotation: result[2],
        command: result[3],
        user: result[4],
        handoff: result[5].trim(),
      };

    // Rotation, command, freeform text
    case 'assign next':
      return {
        rotation: result[2],
        command: result[3],
        handoff: result[4].trim(),
      };

    // Rotation, command, list of space-separated usermentions
    // Proofed to accommodate use of comma+space separation and minor whitespace typos
    case 'staff': {
      const getStaffs = (staff: string) => {
        const cleanedStaff = staff
          .replace(/,/g, '')
          .replace(/></g, '> <')
          .trim();
        const staffs = cleanedStaff.split(' ');
        const noEmpty = staffs.filter((item) => !!item !== false); // Remove falsey values
        const noDupes = new Set(noEmpty); // Remove duplicates
        const cleanedStaffs = [...noDupes]; // Convert set back to array
        return cleanedStaffs;
      };

      return {
        rotation: result[2],
        command: result[3],
        staff: getStaffs(result[4]),
      };
    }

    // Rotation, command, parameters
    case 'new': {
      const description = result[4];
      return {
        rotation: result[3],
        command: result[2],
        description: description
          ? description.trim()
          : '(_no description provided_)',
      };
    }

    // Command, rotation
    case 'delete':
      return {
        rotation: result[3],
        command: result[2],
      };

    // Rotation, command
    case 'description':
      return {
        rotation: result[2],
        command: result[3],
        description: result[4].trim(),
      };

    // Rotation, command
    case 'about':
    case 'unassign':
    case 'who':
    case 'reset staff':
      return {
        rotation: result[2],
        command: result[3],
      };

    // Command
    case 'help':
    case 'list':
      return {
        command: result[2],
      };

    // Rotation, message
    // Command-less freeform message
    case 'message':
      return {
        command: cmd,
        rotation: result[2],
        message: result[3],
      };
  }
}

/**
 * Config object for Slack messages.
 *
 * @param botToken - Bot token for Slack access.
 * @param channelID - Channel id to post message in.
 * @param text - Message text.
 * @returns - Configuration object.
 */
export function msgConfig(botToken: string, channelID: string, text: string) {
  return {
    token: botToken,
    channel: channelID,
    text: text,
  };
}

/**
 * Config object for Slack messages using block kit UI.
 *
 * @param botToken - Bot token for Slack access.
 * @param channelID - Channel id to post message in.
 * @param blocks - Composed message array.
 * @returns - Configuration object.
 */
export function msgConfigBlocks(
  botToken: string,
  channelID: string,
  blocks: Record<string, string>
) {
  return {
    token: botToken,
    channel: channelID,
    blocks: blocks,
  };
}

/**
 * Config object for ephemeral Slack messages.
 *
 * @param botToken - Bot token for Slack access.
 * @param channelID - Channel id to post message in.
 * @param user - User to show ephemeral message to.
 * @param text - Message text.
 * @returns - Configuration object.
 */
export function msgConfigEph(
  botToken: string,
  channelID: string,
  user: string,
  text: string
) {
  return {
    token: botToken,
    channel: channelID,
    user: user,
    text: text,
  };
}

/**
 * Message middleware: ignore some kinds of messages.
 * A bit hacky to catch inconsistencies in Slack API
 * (Customer service was contacted; unreliable behavior confirmed).
 *
 * @param event - Event.
 * @returns - Continue if not ignored message type.
 */
export async function ignoreMention({
  message,
  event,
  next,
}: any): Promise<void> {
  const disallowedSubtypes = ['channel_topic', 'message_changed'];
  const ignoreSubtypeEvent = disallowedSubtypes.indexOf(event.subtype) > -1;
  const ignoreSubtypeMessage =
    message &&
    message.subtype &&
    disallowedSubtypes.indexOf(message.subtype) > -1;
  const ignoreEdited = !!event.edited;
  // If mention should be ignored, return
  if (ignoreSubtypeEvent || ignoreSubtypeMessage || ignoreEdited) {
    return;
  }
  // If mention should be processed, continue
  await next();
}
