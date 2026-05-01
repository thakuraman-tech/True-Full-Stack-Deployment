const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.use(auth);

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
router.get('/stats', dashboardController.getStats);

module.exports = router;
