const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Drink, drinkSchema } = require('./drinks.js');
const { logSchema } = require('./log.js');

const opts = {
  timestamps: true,
};

// NB need to explicitly create schema in order to use middleware
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Not a valid email address.');
      }
    },
  },
  avatar: {
    type: Buffer,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
  ownDrinks: [drinkSchema],
  log: [logSchema],
}, opts);

// Create instance method (i.e. on individual users) to generate JWT
userSchema.methods.genAuthToken = async function() {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, 'drinksapp');

  user.tokens = user.tokens.concat({ token });
  await user.save();   // not needed

  return token;
};

// Remove sensitive fields from returned object
userSchema.methods.toJSON = function() {
  const user = this.toObject(); // Mongoose method to convert document to plain JS object

  delete user.tokens;
  delete user.password;

  return user;
};

// Create method to find user credentials
userSchema.statics.findUserCreds = async(email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');

  return user;
};

// Document middleware called on save()
userSchema.pre('save', async function(next) {
  const user = this;

  try {
    // Hash plain text password if changed
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }

    // Add 'system drinks' to user document when user created
    if (user.isNew) {
      const systemDrinks = await Drink.find({});
      if (systemDrinks) {
        systemDrinks.forEach(drink => user.ownDrinks.push(drink));
      }
    }

    next();
  }
  catch (err) {
    console.log(err.message);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
