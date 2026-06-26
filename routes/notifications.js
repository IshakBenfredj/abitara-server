const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Register push token
router.post('/register-token', notificationController.registerToken);

module.exports = router;
