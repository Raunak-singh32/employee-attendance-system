const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, getAllEmployees } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/employees', protect, adminOnly, getAllEmployees);

module.exports = router;