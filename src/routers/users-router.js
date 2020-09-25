const express = require('express');
const User = require('../models/users.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.post('/users', async(req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.genAuthToken();

    await newUser.save();

    res.status(201).send({ newUser, token });
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/users/login', async(req, res) => {
  try {
    const user = await User.findUserCreds(req.body.email, req.body.password);
    const token = await user.genAuthToken();

    res.send({ user, token });
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post('/users/logout', auth, async(req, res) => {
  try {
    // Delete this token only (i.e doesn't log out of all devices)
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  }
  catch (err) {
    res.status(500).send();
  }
});

router.post('/users/logout-all', auth, async(req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  }
  catch (err) {
    res.status(500).send();
  }
})

router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

router.patch('/users/me', auth, async(req, res) => {
  const updateFields = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidUpdate = updateFields.every(update => allowedUpdates.includes(update));

  if (!isValidUpdate) return res.status(400).send({ error: 'Invalid operation' });

  try {
    updateFields.forEach(field => req.user[field] = req.body[field]);
    await req.user.save();

    res.send(req.user);
  }
  catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/users/me', auth, async(req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  }
  catch (err) {
    res.status(500).send(err);
  }
});


// FOR DEV PURPOSES ONLY
router.get('/users', async(req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  }
  catch (err) {
    res.status(404).send();
  }
});

router.delete('/users', async(req, res) => {
  try {
    const deleted = await User.deleteMany({});
    deleted.n === 0 ?
      res.status(404).send({ error: 'No users to delete.' }) :
      res.send({ usersDeleted: deleted.n });
  }
  catch (err) {
    res.status(404).send(err);
  }
});



module.exports = router;
