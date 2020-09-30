const sharp = require('sharp');
const User = require('../models/users.js');

exports.index = async(req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.genAuthToken();

    await newUser.save();

    res.status(201).send({ newUser, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.login_get = (req, res) => {
  res.render('login_form', { title: 'Login' });
};

exports.login_post = async(req, res) => {
  console.log(req.body);
  try {
    const user = await User.findUserCreds(req.body.email, req.body.password);
    const token = await user.genAuthToken();

    // res.send({ user, token });
    res.redirect('/drinks');
  } catch (err) {
    console.log('login_post err:', err);
    res.render('login_form', { title: 'Login', email: req.body.email, error: err.message });
    // res.status(400).send({ error: err.message });
  }
};

exports.logout = async(req, res) => {
  try {
    // Delete this token only (i.e doesn't log out of all devices)
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.logout_all = async(req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.avatar_post = async(req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize(250, 250)
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}, (err, req, res, next) => { // Express error handling - have to pass all 4 args
  res.status(400).send({ error: err.message });
};

exports.avatar_get = async(req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);

    if (!user) throw new Error('User not found.');

    res.set('Content-Type', 'image/png'); // Configure response headers
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
};

exports.avatar_delete = async(req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.get = (req, res) => {
  res.send(req.user);
};

exports.patch = async(req, res) => {
  const updateFields = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidUpdate = updateFields.every(update => allowedUpdates.includes(update));

  if (!isValidUpdate) return res.status(400).send({ error: 'Invalid operation' });

  try {
    updateFields.forEach(field => req.user[field] = req.body[field]);
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.delete = async(req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


// FOR DEV PURPOSES ONLY
exports.all_get = async(req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
};

exports.all_delete = async(req, res) => {
  try {
    const deleted = await User.deleteMany({});
    deleted.n === 0 ?
      res.status(404).send({ error: 'No users to delete.' }) :
      res.send({ usersDeleted: deleted.n });
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
};
