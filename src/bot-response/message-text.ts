import type { Rota } from '../data/Rota';

/**
 * MESSAGE TEXT
 */

function bold(text: string): string {
  return `*${text}*`;
}

function code(text: string): string {
  return '`' + text + '`';
}

function codeblock(text: string): string {
  return '```' + text + '```';
}

function italic(text: string): string {
  return `_${text}_`;
}

export function newConfirm(rotation: string) {
  return `:sparkles: The ${bold(
    rotation,
  )} rotation has been created. You can now assign someone to be on-call for this rotation or add a staff list. Use ${code(
    '@rota help',
  )} to learn more.`;
}

export function newError(rotation: string) {
  return `:mag_right: The ${bold(
    rotation,
  )} rotation already exists. You can assign someone to be on-call with ${code(
    '@rota "' + rotation + '" assign [@user]',
  )}"'`;
}

export function descConfirm(rotation: string, description: string) {
  return `:writing_hand: The ${bold(
    rotation,
  )} description has been updated to "${description}"`;
}

export function descEmpty(rotation: string) {
  return `:disappointed: I couldn't update the description for ${bold(
    rotation,
  )} because it looks like you didn't provide one.`;
}

export function descError(rotation: string) {
  return (
    ':shrug: I couldn\'t update the description for "' +
    rotation +
    '" because it does not exist. When you create a new rotation, you can include the description: `@rota new "' +
    rotation +
    '" [description]`.'
  );
}

export function staffConfirm(rotation: string) {
  return `:busts_in_silhouette: The ${bold(
    rotation,
  )} rotation staff list has been saved! You can now use ${code(
    '@rota "' + rotation + '" assign next',
  )} to rotate assignments.
When using ${code(
    'next',
  )}, if the currently on-call person is not in the staff list, the assignment will default to the ${italic(
    'first person',
  )} in the rotation.
${italic(
  "(Note: I remove duplicates. If you want someone to do additional shifts, you'll need to do a username assignment.)",
)}`;
}

export function staffEmpty() {
  return `:disappointed: I didn't understand that staff list. To save staff, please make sure you pass me a space-separated list of valid usernames.
${italic(
  "(Note: I can also understand a comma+space separated list, but that's just more typing for you!)",
)}`;
}

export function staffError(rotation: string) {
  return (
    ':shrug: I couldn\'t save staff for "' +
    rotation +
    '" because it does not exist. To create this rotation, first tell me `@rota new "' +
    rotation +
    '" [description]`, _then_ set up staffing.'
  );
}

export function resetStaffConfirm(rotation: string) {
  return `:ghost: The staff list for the ${bold(
    rotation,
  )} rotation has been reset and is empty.`;
}

export function resetStaffError(rotation: string) {
  return (
    ':shrug: I couldn\'t reset the staff list for "' +
    rotation +
    '" because it does not exist. To create this rotation, first tell me `@rota new "' +
    rotation +
    '" [description]`. It will initialize with no staff by default.'
  );
}

export function deleteConfirm(rotation: string) {
  return `:put_litter_in_its_place: The ${bold(
    rotation,
  )} rotation has been deleted.`;
}

export function deleteError(rotation: string) {
  return `:shrug: There is no rotation called "${rotation}." Nothing changed.`;
}

export function aboutReport(rotation: string, rota: Rota) {
  const assignment = rota.assigned
    ? ' (`' + rota.assigned + '`)'
    : ' (_unassigned_)';
  return `:information_source: ${bold(rotation)}: ${
    rota.description
  }${assignment}`;
}

export function aboutStaffEph(rotation: string, staff: string[]) {
  if (!Array.isArray(staff) || !staff.length) {
    return italic('No staff list saved for this rotation.');
  }

  const users: string[] = [];

  for (const user of staff) {
    users.push(`• ${user}`);
  }

  if (users.length) {
    return `:card_index: The following people are on staff for the ${bold(
      rotation,
    )} rotation. ${italic(
      'To save their notifications, this is only visible to you.',
    )}
${users.join('\n')}`;
  }
}

export function aboutError(rotation: string) {
  return `:shrug: I couldn't get any info about "${rotation}" because it does not exist. To create it, use ${code(
    '@rota new "' + rotation + '" [description]',
  )}.`;
}

export function assignConfirm(usermention: string, rotation: string) {
  return `:information_desk_person: ${usermention} is now on-call for the ${bold(
    rotation,
  )} rotation.`;
}

export function assignDMHandoffBlocks(
  rotation: string,
  link: string,
  sentByUserID: string,
  channelID: string,
  handoffMsg: string,
) {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:telephone: You are now on-call for the ${bold(
          rotation,
        )} rotation and have received the following handoff message:`,
      },
    },

    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>${handoffMsg}`,
      },
    },

    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `<${link}|View handoff message> from <@${sentByUserID}> in <#${channelID}>`,
        },
      ],
    },
  ];
}

export function assignHandoffConfirm(usermention: string, rotation: string) {
  return `Your handoff message for the ${bold(
    rotation,
  )} rotation has been sent to ${usermention} via direct message.`;
}

export function assignNextError(rotation: string) {
  return (
    ":shrug: I couldn't assign the next person in the *" +
    rotation +
    '* rotation because there is nobody in the rotation staff list.\nTo set staff, use `@rota "' +
    rotation +
    '" staff [@user1 @user2 @user3]`.\nThen you can use `@rota "' +
    rotation +
    '" assign next [optional handoff message]` to rotate to the next user on staff.\nIf you don\'t want to use a staff list, assign someone directly by username: `@rota "' +
    rotation +
    '" assign [@user] [optional handoff message]`.'
  );
}

export function assignError(rotation: string) {
  return `:shrug: I couldn't complete this assignment because "${rotation}" does not exist. To create it, use ${code(
    '@rota new "' + rotation + '" [description]',
  )}.`;
}

export function listReport(list: Rota[]) {
  const rotations: string[] = [];

  function assignment(item: Rota) {
    if (!item.assigned) {
      return `(${italic('unassigned')})`;
    }
    return `(${italic(item.assigned)})`;
  }

  for (const rotation in list) {
    const rota = list[rotation];
    rotations.push(
      `• ${bold(rota.name)}: ${rota.description} ${assignment(rota)}`,
    );
  }

  return `:clipboard: Here are all the rotations I know about:
${rotations.join('\n')}`;
}

export function listEmpty() {
  return ':clipboard: There are no rotations saved right now. To create one, tell me `@rota new "[rotation-name]" [description]`.';
}

export function whoReport(usermention: string, rotation: string) {
  return (
    ':bust_in_silhouette: `' +
    usermention +
    '` is on duty for the *' +
    rotation +
    '* rotation. To notify them directly, use `@rota "' +
    rotation +
    '" [message]`.'
  );
}

export function nobodyAssigned(rotation: string) {
  return (
    ':ghost: Nobody is currently assigned to the *' +
    rotation +
    '* rotation. To assign someone, use `@rota "' +
    rotation +
    '" assign [@user] [optional handoff message]` or assign the next person in the rotation staff list with `@rota "' +
    rotation +
    '" assign next [optional handoff message]`.'
  );
}

export function whoError(rotation: string) {
  return (
    ':shrug: I couldn\'t find any on-call user because "' +
    rotation +
    '" does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`. You can then assign someone using `@rota "' +
    rotation +
    '" assign [@user] [optional handoff message]`.'
  );
}

export function unassignConfirm(rotation: string) {
  return `:ghost: The ${bold(
    rotation,
  )} rotation has been unassigned. Nobody is on duty.`;
}

export function unassignNoAssignment(rotation: string) {
  return `:shrug: There is currently nobody assigned to the ${bold(
    rotation,
  )} rotation. Nothing changed.`;
}

export function unassignError(rotation: string) {
  return (
    ':shrug: I couldn\'t clear this assignment because "' +
    rotation +
    '" does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`.'
  );
}

export function confirmChannelMsg(rotation: string, sentByUserID: string) {
  if (sentByUserID) {
    return `:speech_balloon: The on-call user for ${bold(
      rotation,
    )} has been notified about <@${sentByUserID}>'s message.`;
  }

  return `:speech_balloon: The on-call user for ${bold(
    rotation,
  )} has been notified.`;
}

export function confirmEphemeralMsg(rotation: string) {
  return `:mantelpiece_clock: The person currently on-call for ${bold(
    rotation,
  )} will respond at their earliest convenience. Keep in mind: they might be busy or outside working hours.
:rotating_light: If it's ${bold(
    'very urgent',
  )} and nobody replies within 15 minutes, ping the appropriate ${code(
    '[@usergroup]',
  )}.`;
}

export function dmToAssigned(
  rotation: string,
  sentByUserID: string,
  channelID: string,
  link: string,
) {
  if (sentByUserID) {
    return `Hi there! <@${sentByUserID}> needs your attention in <#${channelID}> (${link}) because you're on-call for the ${bold(
      rotation,
    )} rotation.\n\n`;
  }

  return `Hi there! You've received a message in <#${channelID}> (${link}) because you're on-call for the ${bold(
    rotation,
  )} rotation.\n\n`;
}

export function msgError(rotation: string) {
  return `:shrug: I couldn't tell anyone about the message because "${rotation}" does not exist. To create it, use ${code(
    '@rota new "' + rotation + '" [description]',
  )}.`;
}

export function didntUnderstand(ec: any, msgText: any) {
  return `:thinking_face: I'm sorry, I didn't understand that. To see my full capabilities and learn how to format commands, type ${code(
    '@rota help',
  )}.
Undecipherable message text: ${code(JSON.stringify(msgText, null, 2))}
Response log:
${codeblock(JSON.stringify(ec, null, 2))}`;
}

export function error(message: string) {
  return `:cry: I'm sorry, I couldn't do that because an error occurred:
${codeblock(message)}`;
}
