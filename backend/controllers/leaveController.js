const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const user = await User.findById(req.user._id);
    if (user.remainingLeaves < totalDays && leaveType !== 'unpaid') {
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    const leave = await Leave.create({
      user: req.user._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my leaves
// @route   GET /api/leave/my
// @access  Private
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leave requests (HR only)
// @route   GET /api/leave/all
// @access  Private/HR
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('user', 'name email department designation')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave status (HR only)
// @route   PUT /api/leave/:id
// @access  Private/HR
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (status === 'approved') {
      const user = await User.findById(leave.user);
      if (leave.leaveType !== 'unpaid') {
        user.usedLeaves += leave.totalDays;
        user.remainingLeaves = user.totalLeaves - user.usedLeaves;
        await user.save();
      }
    }

    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvedDate = new Date();
    leave.comments = comments;
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};