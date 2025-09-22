const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    markedByName: {
      type: String,
      required: true,
    },
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    regNumber: {
      type: String,
      required: true,
      unique: true,
    },
    division: {
      type: String,
      enum: ["A1", "A2", "A3", "A4", "A5", "A6"],
      required: true,
    },
    attendance: [attendanceRecordSchema],
    totalClasses: {
      type: Number,
      default: 0,
    },
    presentClasses: {
      type: Number,
      default: 0,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate attendance percentage before saving
studentSchema.pre("save", function (next) {
  if (this.totalClasses > 0) {
    this.attendancePercentage = Math.round(
      (this.presentClasses / this.totalClasses) * 100
    );
  } else {
    this.attendancePercentage = 0;
  }
  next();
});

// Update attendance counts when attendance array changes
studentSchema.methods.updateAttendanceCounts = function () {
  this.totalClasses = this.attendance.length;
  this.presentClasses = this.attendance.filter(
    (record) => record.status === "present"
  ).length;
  this.attendancePercentage =
    this.totalClasses > 0
      ? Math.round((this.presentClasses / this.totalClasses) * 100)
      : 0;
};

module.exports = mongoose.model("Student", studentSchema);
