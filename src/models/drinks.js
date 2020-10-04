const mongoose = require('mongoose');

const opts = {
  toJSON: { virtuals: true }, // pass virtual fields into Express
  toObject: { virtuals: true },
};

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['wine', 'beer', 'cider', 'spirits', 'other'],
    required: true,
  },
  abv: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: Number,
    required: true,
    mix: 0,
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, opts);

drinkSchema.virtual('units').get(function() {
  return Math.round((this.abv * this.size / 1000) * 10) / 10;
});

const Drink = mongoose.model('Drink', drinkSchema);

module.exports = {
  Drink,
  drinkSchema,
};
