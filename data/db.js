const Rota = require('./Rota');

/*------------------
  DATABASE / STORE
------------------*/
const store = {
  /**
   * Get rotations
   * @return {object[]} array of existing rotation objects
   */
  getRotations() {
    return Rota.find();
  },

  /**
   * Create new rotation
   * @param {string} rotaname name of new rotation
   * @param {string} description description of new rotation
   * @return {object} newly saved rotation
   */
  newRotation(rotaname, description) {
    return Rota.findOneAndUpdate(
      { name: rotaname },
      {
        name: rotaname,
        description: description,
        assigned: null,
        upsert: true,
      }
    );
  },

  /**
   * Update description for existing rotation
   * @param {string} rotaname updated name of rotation
   * @param {string} description updated description of rotation
   * @return {object} newly updated, saved rotation
   */
  updateDescription(rotaname, description) {
    return Rota.findOneAndUpdate(
      { name: rotaname },
      {
        description,
      }
    );
  },

  /**
   * Save rotation staff to rotation store
   * @param {string} rotaname rotation name
   * @param {string[]} staffArr array of staff user IDs
   *
   */
  saveStaff(rotaname, staffArr) {
    return Rota.findOneAndUpdate(
      { name: rotaname },
      {
        staff: staffArr,
      }
    );
  },

  /**
   * Save user assignment to rotation store
   * @param {string} rotaname rotation name
   * @param {string} usermention user mention string <@UXXXXX>
   * @return {object} saved rotation with new assignment
   */
  saveAssignment(rotaname, usermention) {
    return Rota.findOneAndUpdate(
      { name: rotaname },
      {
        assigned: usermention,
      }
    );
  },

  /**
   * Get rotation object for a specific rotation
   * @param {string} rotaname rotation name
   * @return {object} rotation object
   */
  getRotation(rotaname) {
    return Rota.findOne({ name: rotaname });
  },

  /**
   * Deletes a rotation entirely
   * @param {string} rotaname rotation name
   */
  deleteRotation(rotaname) {
    return Rota.findOneAndRemove({ name: rotaname });
  },
};

module.exports = store;
