const express = require('express');
const drink_controller = require('../controllers/drinks.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.get('/drinks', auth, drink_controller.all_get);
router.get('/add-drink', auth, drink_controller.create_get);
router.post('/add-drink', auth, drink_controller.create_post);
router.delete('/drinks/all', drink_controller.all_delete); // FOR DEV PURPOSES ONLY
router.get('/drinks/:id', auth, drink_controller.drink_get);
router.put('/drinks/:id', auth, drink_controller.drink_put);
router.delete('/drinks/:id', auth, drink_controller.drink_delete);

module.exports = router;
