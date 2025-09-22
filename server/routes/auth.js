const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const router = express.Router();

// Predefined credentials
const PREDEFINED_CREDENTIALS = {
  admin: { username: "admin", password: "admin123" },
  faculty: { username: "faculty", password: "faculty123" },
  classteacher: { username: "classteacher", password: "teacher123" },
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check predefined credentials first (for admin, faculty, classteacher)
    if (role !== "student") {
      const predefined = PREDEFINED_CREDENTIALS[role];
      if (
        predefined &&
        predefined.username === username &&
        predefined.password === password
      ) {
        return res.json({
          success: true,
          needsRegistration: true,
          role,
          message: "Please complete your registration",
        });
      }
    }

    // Check registered users
    const user = await User.findOne({ username: username.toLowerCase(), role });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        subject: user.subject,
        subjects: user.subjects,
        division: user.division,
        regNumber: user.regNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      username,
      password,
      role,
      subject,
      subjects,
      division,
      regNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        ...(regNumber ? [{ regNumber }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this username or registration number",
      });
    }

    // Validate registration number for students
    if (role === "student") {
      if (!regNumber || !regNumber.match(/^REG\d{3}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid registration number format. Use REG001 to REG360",
        });
      }

      const regNum = parseInt(regNumber.replace("REG", ""));
      if (regNum < 1 || regNum > 360) {
        return res.status(400).json({
          success: false,
          message: "Registration number must be between REG001 and REG360",
        });
      }
    }

    // Create new user
    const userData = {
      fullName,
      username: username.toLowerCase(),
      password,
      role,
    };

    if (role === "faculty") {
      userData.subject = subject;
      userData.division = division;
    } else if (role === "classteacher") {
      userData.subjects = subjects;
      userData.division = division;
    } else if (role === "student") {
      userData.regNumber = regNumber;
      // Division will be auto-assigned by the pre-save hook
    }

    const user = new User(userData);
    await user.save();

    // Create student record if role is student
    if (role === "student") {
      const student = new Student({
        userId: user._id,
        fullName: user.fullName,
        regNumber: user.regNumber,
        division: user.division,
      });
      await student.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        subject: user.subject,
        subjects: user.subjects,
        division: user.division,
        regNumber: user.regNumber,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

module.exports = router;
