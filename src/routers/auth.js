const express = require('express');
const auth_controller = require('../controllers/auth.js');

const router = new express.Router();

router.get('/login', auth_controller.index);

router.get('/register', auth_controller.register);

router.get('*', (req, res) => {
  res.render('404');
});


module.exports = router;
