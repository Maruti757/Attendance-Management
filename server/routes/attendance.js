const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/attendance/mark
// @desc    Mark daily attendance
// @access  Private
router.post("/mark", auth, async (req, res) => {
  try {
    const { date, subject, division, attendanceData } = req.body;
    const facultyId = req.user.userId;

    // Get faculty details
    const faculty = await User.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Get all students in the division
    const students = await Student.find({ division });

    const updates = [];

    for (const student of students) {
      const status = attendanceData[student._id] || "absent";

      // Check if attendance for this date and subject already exists
      const existingRecord = student.attendance.find(
        (record) =>
          record.date.toDateString() === new Date(date).toDateString() &&
          record.subject === subject
      );

      if (!existingRecord) {
        // Add new attendance record
        student.attendance.push({
          date: new Date(date),
          subject,
          status,
          markedBy: facultyId,
          markedByName: faculty.fullName,
        });

        // Update counts
        student.updateAttendanceCounts();
        await student.save();

        updates.push({
          studentId: student._id,
          studentName: student.fullName,
          status,
        });
      }
    }

    res.json({
      success: true,
      message: "Attendance marked successfully",
      updates,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking attendance",
    });
  }
});

// @route   GET /api/attendance/stats
// @desc    Get attendance statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const { division } = req.query;
    const filter = division && division !== "all" ? { division } : {};

    const students = await Student.find(filter);

    const totalStudents = students.length;
    const averageAttendance =
      students.length > 0
        ? Math.round(
            students.reduce(
              (sum, student) => sum + student.attendancePercentage,
              0
            ) / students.length
          )
        : 0;
    const shortageStudents = students.filter(
      (student) => student.attendancePercentage < 75
    ).length;

    res.json({
      success: true,
      stats: {
        totalStudents,
        averageAttendance,
        shortageStudents,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching statistics",
    });
  }
});

module.exports = router;
