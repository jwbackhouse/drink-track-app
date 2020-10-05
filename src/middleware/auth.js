const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const auth = async(req, res, next) => {
  try {
    const token = req.cookies['auth_token'];
    const decoded = jwt.verify(token, 'drinksapp');

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.log('Auth error:', err);
    res.redirect('/');
  }
};

module.exports = auth;
