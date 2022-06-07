const mongoose = require('mongoose');

/**
 * ROTA SCHEMA
 */
const rotaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  assigned: String,
  staff: [String],
});

module.exports = mongoose.model('Rota', rotaSchema);
