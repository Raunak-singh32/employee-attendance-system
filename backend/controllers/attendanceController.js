const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Check In
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (existing && existing.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await Attendance.create({
      user: req.user._id,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check Out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    const diffMs = attendance.checkOut - attendance.checkIn;
    attendance.workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    // Half-day logic: less than 4 hours
    if (attendance.workingHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my attendance
// @route   GET /api/attendance/my
// @access  Private
const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance (HR only)
// @route   GET /api/attendance/all
// @access  Private/HR
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('user', 'name email department designation')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private
const getAttendanceStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const stats = await Attendance.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalWorkingDays = await Attendance.countDocuments({
      user: userId,
      date: { $gte: currentMonth },
      status: { $in: ['present', 'half-day'] }
    });

    const totalHours = await Attendance.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$workingHours' }
        }
      }
    ]);

    res.json({
      stats,
      totalWorkingDays,
      totalHours: totalHours[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceStats
};