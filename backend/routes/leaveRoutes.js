const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/all', protect, adminOnly, getAllLeaves);
router.put('/:id', protect, adminOnly, updateLeaveStatus);

module.exports = router;