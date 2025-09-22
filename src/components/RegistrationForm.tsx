import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Lock,
  BookOpen,
  Users,
  Hash,
  Shield,
  GraduationCap,
} from "lucide-react";
import {
  saveUser,
  saveStudent,
  getDivisionFromRegNumber,
} from "../utils/dataManager";
import { User, Student } from "../types";

interface RegistrationFormProps {
  role: string;
  onRegister: (user: User) => void;
  onBack: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  role,
  onRegister,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    subject: "",
    division: "",
    regNumber: "",
    subjects: [] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Geography",
    "Economics",
    "Political Science",
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userId = Date.now().toString();

      if (role === "student") {
        // Validate reg number format
        if (!formData.regNumber.match(/^REG\d{3}$/)) {
          setError("Registration number must be in format REG001 to REG360");
          setLoading(false);
          return;
        }

        const regNum = parseInt(formData.regNumber.replace("REG", ""));
        if (regNum < 1 || regNum > 360) {
          setError("Registration number must be between REG001 and REG360");
          setLoading(false);
          return;
        }

        const division = getDivisionFromRegNumber(formData.regNumber);

        const student: Student = {
          id: userId,
          fullName: formData.fullName,
          regNumber: formData.regNumber,
          division,
          attendance: [],
          totalClasses: 0,
          presentClasses: 0,
          attendancePercentage: 0,
          leaveApplications: [],
        };

        const user: User = {
          id: userId,
          username: formData.username,
          password: formData.password,
          role: "student",
          fullName: formData.fullName,
          regNumber: formData.regNumber,
          division,
        };

        saveStudent(student);
        saveUser(user);
      } else {
        const user: User = {
          id: userId,
          username: formData.username,
          password: formData.password,
          role: role as any,
          fullName: formData.fullName,
          subject: formData.subject,
          division: formData.division,
          subjects: role === "classteacher" ? formData.subjects : undefined,
        };

        saveUser(user);
      }

      onRegister({
        id: userId,
        username: formData.username,
        password: formData.password,
        role: role as any,
        fullName: formData.fullName,
        subject: formData.subject,
        division: formData.division,
        regNumber: formData.regNumber,
        subjects: formData.subjects,
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "faculty":
        return "Faculty";
      case "classteacher":
        return "Class Teacher";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "from-purple-500 to-purple-600";
      case "faculty":
        return "from-blue-500 to-blue-600";
      case "classteacher":
        return "from-green-500 to-green-600";
      case "student":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield;
      case "faculty":
        return BookOpen;
      case "classteacher":
        return Users;
      case "student":
        return GraduationCap;
      default:
        return UserIcon;
    }
  };

  const RoleIcon = getRoleIcon(role);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </motion.button>

        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            <motion.div
              className={`w-20 h-20 bg-gradient-to-r ${getRoleColor(
                role
              )} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            >
              <RoleIcon className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {getRoleDisplayName(role)} Registration
            </motion.h2>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Create your account to get started
            </motion.p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter your full name"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            {/* Registration Number (Student only) */}
            {role === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <motion.input
                    type="text"
                    value={formData.regNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        regNumber: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="REG001"
                    pattern="REG\d{3}"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: REG001 to REG360
                </p>
              </div>
            )}

            {/* Subject (Faculty only) */}
            {role === "faculty" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <motion.select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    required
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">Select Subject</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </motion.select>
                </div>
              </div>
            )}

            {/* Subjects (Class Teacher only) */}
            {role === "classteacher" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects (Select multiple)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableSubjects.map((subject) => (
                    <motion.label
                      key={subject}
                      className="flex items-center space-x-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        title={`Select ${subject}`}
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </motion.label>
                  ))}
                </div>
              </div>
            )}

            {/* Division (Faculty and Class Teacher) */}
            {(role === "faculty" || role === "classteacher") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Division
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <motion.select
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({ ...formData, division: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    required
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">Select Division</option>
                    <option value="A1">A1 (REG001-REG060)</option>
                    <option value="A2">A2 (REG061-REG120)</option>
                    <option value="A3">A3 (REG121-REG180)</option>
                    <option value="A4">A4 (REG181-REG240)</option>
                    <option value="A5">A5 (REG241-REG300)</option>
                    <option value="A6">A6 (REG301-REG360)</option>
                  </motion.select>
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Choose a username"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Create a password"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${getRoleColor(
                role
              )} text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </motion.div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationForm;
