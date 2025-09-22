const express = require("express");
const Student = require("../models/Student");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/students
// @desc    Get all students or by division
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { division } = req.query;
    const filter = {};

    if (division && division !== "all") {
      filter.division = division;
    }

    const students = await Student.find(filter)
      .populate("userId", "fullName username")
      .sort({ regNumber: 1 });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching students",
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "userId",
      "fullName username"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching student",
    });
  }
});

// @route   PUT /api/students/:id/attendance
// @desc    Update student attendance
// @access  Private
router.put("/:id/attendance", auth, async (req, res) => {
  try {
    const { presentClasses, totalClasses } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.presentClasses = presentClasses;
    student.totalClasses = totalClasses;
    student.attendancePercentage =
      totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    await student.save();

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Update attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating attendance",
    });
  }
});

module.exports = router;
