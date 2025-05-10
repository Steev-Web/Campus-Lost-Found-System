const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: String,
  locationFound: String,
  dateFound: { type: Date, default: Date.now },
  claimed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', ItemSchema);
