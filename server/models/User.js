const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "faculty", "classteacher", "student"],
      required: true,
    },
    subject: {
      type: String,
      required: function () {
        return this.role === "faculty";
      },
    },
    subjects: [
      {
        type: String,
        required: function () {
          return this.role === "classteacher";
        },
      },
    ],
    division: {
      type: String,
      enum: ["A1", "A2", "A3", "A4", "A5", "A6"],
      required: function () {
        return (
          this.role === "faculty" ||
          this.role === "classteacher" ||
          this.role === "student"
        );
      },
    },
    regNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.role === "student";
      },
      validate: {
        validator: function (v) {
          if (this.role === "student") {
            return /^REG\d{3}$/.test(v);
          }
          return true;
        },
        message: "Registration number must be in format REG001 to REG360",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Auto-assign division based on registration number
userSchema.pre("save", function (next) {
  if (this.role === "student" && this.regNumber && !this.division) {
    const regNum = parseInt(this.regNumber.replace("REG", ""));
    if (regNum >= 1 && regNum <= 60) this.division = "A1";
    else if (regNum >= 61 && regNum <= 120) this.division = "A2";
    else if (regNum >= 121 && regNum <= 180) this.division = "A3";
    else if (regNum >= 181 && regNum <= 240) this.division = "A4";
    else if (regNum >= 241 && regNum <= 300) this.division = "A5";
    else if (regNum >= 301 && regNum <= 360) this.division = "A6";
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
