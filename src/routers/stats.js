const express = require('express');
const stats_controller = require('../controllers/stats.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.get('/stats', auth, stats_controller.get);
// router.post('/stats', auth, stats_controller.post);
// router.get('/stats/:date', auth, stats_controller.date_get);

module.exports = router;
