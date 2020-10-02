const mongoose = require('mongoose');

const drinkLogSchema = new mongoose.Schema({
  drinkId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Drink',
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

const logSchema = new mongoose.Schema({
  date: {
    type: Date,
    // default: Date.now,
    required: true,
  },
  drinks: [drinkLogSchema],
});

const Log = mongoose.model('Log', logSchema);

module.exports = {
  Log,
  logSchema
};
