const express = require('express');
const drink_controller = require('../controllers/drinks.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.post('/drinks', auth, drink_controller.post);

router.get('/drinks', auth, drink_controller.all_get);

router.get('/drinks/:id', auth, drink_controller.get);

router.patch('/drinks/:id', auth, drink_controller.patch);

router.delete('/drinks/:id', auth, drink_controller.delete);


// FOR DEV PURPOSES ONLY
router.delete('/drinks', drink_controller.all_delete);

module.exports = router;
