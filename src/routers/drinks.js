const express = require('express');
const drink_controller = require('../controllers/drinks.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.get('/drinks', auth, drink_controller.all_get);

router.get('/add-drink', auth, drink_controller.create_get);
router.post('/add-drink', auth, drink_controller.create_post);

router.delete('/drinks/all', drink_controller.all_delete); // FOR DEV PURPOSES ONLY

router.get('/drinks/:id', auth, drink_controller.get);
router.post('/drinks/:id', auth, drink_controller.post);
router.delete('/drinks/:id', auth, drink_controller.delete);


module.exports = router;
