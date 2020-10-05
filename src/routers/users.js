const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth.js');
const user_controller = require('../controllers/users.js');

const router = new express.Router();
const upload = multer({
  // dest: 'avatars/',  // if no dest specified, buffer is passed to next function
  limits: { fileSize: 1000000 }, // number of bytes
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png)$/)) {
      return cb(new Error('Please choose a jpg or png file.'));
    }
    cb(null, true);
  },
});

router.get('/users/register', user_controller.register_get);
router.post('/users/register', user_controller.register_post);
router.get('/users/login', user_controller.login_get);
router.post('/users/login', user_controller.login_post);
router.post('/users/logout', auth, user_controller.logout);
router.post('/users/logout-all', auth, user_controller.logout_all);

router.get('/users/me', auth, user_controller.get);
router.patch('/users/me', auth, user_controller.patch);
router.delete('/users/me', auth, user_controller.delete);
router.post('/users/me/avatar', auth, upload.single('avatar'), user_controller.avatar_post);
router.delete('/users/me/avatar', auth, user_controller.avatar_delete);
router.get('/users/:id/avatar', user_controller.avatar_get);

// FOR DEV PURPOSES ONLY
router.get('/users', user_controller.all_get);
router.delete('/users', user_controller.all_delete);

router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;
