/**
 * MESSAGE TEXT
 */

exports.newConfirm = function newConfirm(rotation) {
  return (
    ':sparkles: The *' +
    rotation +
    '* rotation has been created. You can now assign someone to be on-call for this rotation or add a staff list. Use `@rota help` to learn more.'
  );
};

exports.newError = function newError(rotation) {
  return (
    ':mag_right: The *' +
    rotation +
    '* rotation already exists. You can assign someone to be on-call with `@rota "' +
    rotation +
    '" assign [@user]`.'
  );
};

exports.descConfirm = function descConfirm(rotation, description) {
  return `:writing_hand: The *${rotation}* description has been updated to "${description}"`;
};

exports.descEmpty = function descEmpty(rotation) {
  return `:disappointed: I couldn't update the description for *${rotation}* because it looks like you didn't provide one.`;
};

exports.descError = function descError(rotation) {
  return (
    ':shrug: I couldn\'t update the description for "' +
    rotation +
    '" because it does not exist. When you create a new rotation, you can include the description: `@rota new "' +
    rotation +
    '" [description]`.'
  );
};

exports.staffConfirm = function staffConfirm(rotation) {
  return (
    ':busts_in_silhouette: The *' +
    rotation +
    '* rotation staff list has been saved! You can now use `@rota "' +
    rotation +
    '" assign next` to rotate assignments.\nWhen using `next`, if the currently on-call person is not in the staff list, the assignment will default to the _first person_ in the rotation.\n_(Note: I remove duplicates. If you want someone to do additional shifts, you\'ll need to do a username assignment.)_'
  );
};

exports.staffEmpty = function staffEmpty() {
  return `:disappointed: I didn't understand that staff list. To save staff, please make sure you pass me a space-separated list of valid usernames.\n_(Note: I can also understand a comma+space separated list, but that's just more typing for you!)_`;
};

exports.staffError = function staffError(rotation) {
  return (
    ':shrug: I couldn\'t save staff for "' +
    rotation +
    '" because it does not exist. To create this rotation, first tell me `@rota new "' +
    rotation +
    '" [description]`, _then_ set up staffing.'
  );
};

exports.resetStaffConfirm = function resetStaffConfirm(rotation) {
  return `:ghost: The staff list for the *${rotation}* rotation has been reset and is empty.`;
};

exports.resetStaffError = function resetStaffError(rotation) {
  return (
    ':shrug: I couldn\'t reset the staff list for "' +
    rotation +
    '" because it does not exist. To create this rotation, first tell me `@rota new "' +
    rotation +
    '" [description]`. It will initialize with no staff by default.'
  );
};

exports.deleteConfirm = function deleteConfirm(rotation) {
  return `:put_litter_in_its_place: The *${rotation}* rotation has been deleted.`;
};

exports.deleteError = function deleteError(rotation) {
  return `:shrug: There is no rotation called "${rotation}." Nothing changed.`;
};

exports.aboutReport = function aboutReport(rotation, rotationObj) {
  const assignment = rotationObj.assigned
    ? ' (`' + rotationObj.assigned + '`)'
    : ' (_unassigned_)';
  return `:information_source: *${rotation}*: ${rotationObj.description}${assignment}`;
};

exports.aboutStaffEph = function aboutStaffEph(rotation, staff) {
  if (staff && staff.length) {
    let str = '';
    for (const user of staff) {
      str = str + `• ${user}\n`;
    }
    if (str.length) {
      return (
        `:card_index: The following people are on staff for the *${rotation}* rotation. _To save their notifications, this is only visible to you._\n` +
        str
      );
    }
  }
  return '_No staff list saved for this rotation._';
};

exports.aboutError = function aboutError(rotation) {
  return (
    ':shrug: I couldn\'t get any info about "' +
    rotation +
    '" because it does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`.'
  );
};

exports.assignConfirm = function assignConfirm(usermention, rotation) {
  return `:information_desk_person: ${usermention} is now on-call for the *${rotation}* rotation.`;
};

exports.assignDMHandoffBlocks = function assignDMHandoffBlocks(
  rotation,
  link,
  sentByUserID,
  channelID,
  handoffMsg
) {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:telephone: You are now on-call for the *${rotation}* rotation and have received the following handoff message:`,
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
};

exports.assignHandoffConfirm = function assignHandoffConfirm(
  usermention,
  rotation
) {
  return `Your handoff message for the *${rotation}* rotation has been sent to ${usermention} via direct message.`;
};

exports.assignNextError = function assignNextError(rotation) {
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
};

exports.assignError = function assignError(rotation) {
  return (
    ':shrug: I couldn\'t complete this assignment because "' +
    rotation +
    '" does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`.'
  );
};

exports.listReport = function listReport(list) {
  let msgStr = '';
  const assignment = (item) => {
    return item.assigned ? ' (`' + item.assigned + '`)' : ' (_unassigned_)';
  };
  for (const rotation in list) {
    const rota = list[rotation];
    msgStr =
      msgStr + `• *${rota.name}*: ${rota.description}${assignment(rota)}\n`;
  }
  return `:clipboard: Here are all the rotations I know about:\n${msgStr}`;
};

exports.listEmpty = function listEmpty() {
  return ':clipboard: There are no rotations saved right now. To create one, tell me `@rota new "[rotation-name]" [description]`.';
};

exports.whoReport = function whoReport(usermention, rotation) {
  return (
    ':bust_in_silhouette: `' +
    usermention +
    '` is on duty for the *' +
    rotation +
    '* rotation. To notify them directly, use `@rota "' +
    rotation +
    '" [message]`.'
  );
};

exports.nobodyAssigned = function nobodyAssigned(rotation) {
  return (
    ':ghost: Nobody is currently assigned to the *' +
    rotation +
    '* rotation. To assign someone, use `@rota "' +
    rotation +
    '" assign [@user] [optional handoff message]` or assign the next person in the rotation staff list with `@rota "' +
    rotation +
    '" assign next [optional handoff message]`.'
  );
};

exports.whoError = function whoError(rotation) {
  return (
    ':shrug: I couldn\'t find any on-call user because "' +
    rotation +
    '" does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`. You can then assign someone using `@rota "' +
    rotation +
    '" assign [@user] [optional handoff message]`.'
  );
};

exports.unassignConfirm = function unassignConfirm(rotation) {
  return `:ghost: The *${rotation}* rotation has been unassigned. Nobody is on duty.`;
};

exports.unassignNoAssignment = function unassignNoAssignment(rotation) {
  return `:shrug: There is currently nobody assigned to the *${rotation}* rotation. Nothing changed.`;
};

exports.unassignError = function unassignError(rotation) {
  return (
    ':shrug: I couldn\'t clear this assignment because "' +
    rotation +
    '" does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`.'
  );
};

exports.confirmChannelMsg = function confirmChannelMsg(rotation, sentByUserID) {
  if (sentByUserID) {
    return `:speech_balloon: The on-call user for *${rotation}* has been notified about <@${sentByUserID}>'s message.`;
  } else {
    return `:speech_balloon: The on-call user for *${rotation}* has been notified.`;
  }
};

exports.confirmEphemeralMsg = function confirmEphemeralMsg(rotation) {
  return (
    ':mantelpiece_clock: The person currently on-call for *' +
    rotation +
    "* will respond at their earliest convenience. Keep in mind: they might be busy or outside working hours.\n:rotating_light: If it's *very urgent* and nobody replies within 15 minutes, ping the appropriate `[@usergroup]`."
  );
};

exports.dmToAssigned = function dmToAssigned(
  rotation,
  sentByUserID,
  channelID,
  link
) {
  if (sentByUserID) {
    return `Hi there! <@${sentByUserID}> needs your attention in <#${channelID}> (${link}) because you're on-call for the *${rotation}* rotation.\n\n`;
  } else {
    return `Hi there! You've received a message in <#${channelID}> (${link}) because you're on-call for the *${rotation}* rotation.\n\n`;
  }
};

exports.msgError = function msgError(rotation) {
  return (
    ':shrug: I couldn\'t tell anyone about the message because "' +
    rotation +
    '" does not exist. To create it, use `@rota new "' +
    rotation +
    '" [description]`.'
  );
};

exports.didntUnderstand = function didntUnderstand(ec, msgText) {
  return (
    ":thinking_face: I'm sorry, I didn't understand that. To see my full capabilities and learn how to format commands, type `@rota help`.\nUndecipherable message text: `" +
    JSON.stringify(msgText, null, 2) +
    '`\nResponse log:\n```' +
    JSON.stringify(ec, null, 2) +
    '```'
  );
};

exports.error = function error(err) {
  return (
    ":cry: I'm sorry, I couldn't do that because an error occurred:\n```" +
    err +
    '```'
  );
};
