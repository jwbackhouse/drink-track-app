const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/users.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();
const upload = multer({
  // dest: 'avatars/',  // if no dest specified, buffer is passed to next function
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png)$/)) {
      return cb(new Error('Please choose a jpg or png file.'));
    }

    cb(null, true);
  },
});

router.post('/users', async(req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.genAuthToken();

    await newUser.save();

    res.status(201).send({ newUser, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/users/login', async(req, res) => {
  try {
    const user = await User.findUserCreds(req.body.email, req.body.password);
    const token = await user.genAuthToken();

    res.send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
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
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post('/users/logout-all', auth, async(req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
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
});

router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

router.get('/users/:id/avatar', async(req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);

    if (!user) throw new Error('User not found.');

    res.set('Content-Type', 'image/png'); // Configure response headers
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
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
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/users/me', auth, async(req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.delete('/users/me/avatar', auth, async(req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// FOR DEV PURPOSES ONLY
router.get('/users', async(req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.delete('/users', async(req, res) => {
  try {
    const deleted = await User.deleteMany({});
    deleted.n === 0 ?
      res.status(404).send({ error: 'No users to delete.' }) :
      res.send({ usersDeleted: deleted.n });
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});



module.exports = router;
