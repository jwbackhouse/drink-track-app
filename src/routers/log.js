const express = require('express');
const log_controller = require('../controllers/log.js');

const router = new express.Router();

router.get('/log', log_controller.index);

module.exports = router;
