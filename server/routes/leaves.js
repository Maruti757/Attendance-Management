const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const LeaveApplication = require("../models/LeaveApplication");
const Student = require("../models/Student");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images, PDF, and DOC files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  },
  fileFilter,
});

// @route   POST /api/leaves/submit
// @desc    Submit leave application
// @access  Private (Students only)
router.post("/submit", auth, upload.array("documents", 5), async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;
    const studentUserId = req.user.userId;

    // Find student record
    const student = await Student.findOne({ userId: studentUserId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    // Prepare documents array
    const documents = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        }))
      : [];

    // Create leave application
    const leaveApplication = new LeaveApplication({
      studentId: student._id,
      studentName: student.fullName,
      regNumber: student.regNumber,
      division: student.division,
      reason,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      documents,
    });

    await leaveApplication.save();

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      leaveApplication,
    });
  } catch (error) {
    console.error("Submit leave error:", error);
    res.status(500).json({
      success: false,
      message: "Server error submitting leave application",
    });
  }
});

// @route   GET /api/leaves
// @desc    Get leave applications
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { division, status } = req.query;
    const userId = req.user.userId;

    // Get user details to determine access level
    const user = await User.findById(userId);
    let filter = {};

    if (user.role === "student") {
      // Students can only see their own applications
      const student = await Student.findOne({ userId });
      if (student) {
        filter.studentId = student._id;
      }
    } else if (user.role === "classteacher") {
      // Class teachers can see applications from their division
      filter.division = user.division;
    }
    // Admins can see all applications (no additional filter)

    if (division && division !== "all") {
      filter.division = division;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const leaveApplications = await LeaveApplication.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      leaveApplications,
    });
  } catch (error) {
    console.error("Get leaves error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching leave applications",
    });
  }
});

// @route   PUT /api/leaves/:id/review
// @desc    Review leave application (approve/reject)
// @access  Private (Class teachers and admins only)
router.put("/:id/review", auth, async (req, res) => {
  try {
    const { status, comments } = req.body;
    const reviewerId = req.user.userId;

    // Get reviewer details
    const reviewer = await User.findById(reviewerId);
    if (
      !reviewer ||
      (reviewer.role !== "classteacher" && reviewer.role !== "admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review leave applications",
      });
    }

    // Find leave application
    const leaveApplication = await LeaveApplication.findById(req.params.id);
    if (!leaveApplication) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    // Update leave application
    leaveApplication.status = status;
    leaveApplication.reviewedBy = reviewerId;
    leaveApplication.reviewedByName = reviewer.fullName;
    leaveApplication.reviewDate = new Date();
    leaveApplication.comments = comments || "";

    await leaveApplication.save();

    // If approved, update student attendance
    if (status === "approved") {
      const student = await Student.findById(leaveApplication.studentId);
      if (student) {
        const fromDate = new Date(leaveApplication.fromDate);
        const toDate = new Date(leaveApplication.toDate);
        const leaveDays =
          Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

        student.presentClasses += leaveDays;
        student.updateAttendanceCounts();
        await student.save();
      }
    }

    res.json({
      success: true,
      message: `Leave application ${status} successfully`,
      leaveApplication,
    });
  } catch (error) {
    console.error("Review leave error:", error);
    res.status(500).json({
      success: false,
      message: "Server error reviewing leave application",
    });
  }
});

module.exports = router;
