import Rota from './Rota';

/**
 * DATABASE / STORE
 */

/**
 * Get rotations.
 *
 * @returns - Array of existing rotation objects
 */
export function getRotations() {
  return Rota.find();
}

/**
 * Create new rotation.
 *
 * @param rotaname - Name of new rotation.
 * @param description - Description of new rotation.
 * @returns - Newly saved rotation.
 */
export function newRotation(rotaname: string, description: string) {
  return Rota.findOneAndUpdate(
    { name: rotaname },
    {
      name: rotaname,
      description: description,
      assigned: null,
      upsert: true,
    },
  );
}

/**
 * Update description for existing rotation.
 *
 * @param rotaname - Updated name of rotation.
 * @param description - Updated description of rotation.
 * @returns - Newly updated, saved rotation.
 */
export function updateDescription(rotaname: string, description: string) {
  return Rota.findOneAndUpdate(
    { name: rotaname },
    {
      description,
    },
  );
}

/**
 * Save rotation staff to rotation store.
 *
 * @param rotaname - Rotation name.
 * @param staffs - Staff user IDs.
 */
export function saveStaff(rotaname: string, staffs: string[]) {
  return Rota.findOneAndUpdate(
    { name: rotaname },
    {
      staff: staffs,
    },
  );
}

/**
 * Save user assignment to rotation store.
 *
 * @param rotaname - Rotation name.
 * @param usermention - User mention string <@UXXXXX>.
 * @returns - Saved rotation with new assignment.
 */
export function saveAssignment(rotaname: string, usermention: string) {
  return Rota.findOneAndUpdate(
    { name: rotaname },
    {
      assigned: usermention,
    },
  );
}

/**
 * Get rotation object for a specific rotation.
 *
 * @param rotaname - Rotation name.
 * @returns - Rotation object.
 */
export function getRotation(rotaname: string) {
  return Rota.findOne({ name: rotaname });
}

/**
 * Deletes a rotation entirely.
 *
 * @param rotaname - Rotation name.
 */
export function deleteRotation(rotaname: string) {
  return Rota.findOneAndRemove({ name: rotaname });
}
