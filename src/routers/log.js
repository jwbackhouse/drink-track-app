const express = require('express');
const log_controller = require('../controllers/log.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.get('/log', auth, log_controller.get);
router.post('/log', auth, log_controller.post);
router.get('/log/:date', auth, log_controller.date_get);

module.exports = router;
