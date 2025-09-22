import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  Shield,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import { validatePredefinedLogin, getUser } from "../utils/dataManager";
import { User } from "../types";

interface LoginFormProps {
  role: string;
  onLogin: (user: User) => void;
  onBack: () => void;
  onRegister: (role: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  role,
  onLogin,
  onBack,
  onRegister,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For students, check registered users directly
      if (role === "student") {
        const user = getUser(username, password, role);
        if (user) {
          onLogin(user);
        } else {
          setError(
            "Invalid credentials. Please check your username and password."
          );
        }
      } else {
        // For admin, faculty, classteacher - check predefined credentials first
        if (validatePredefinedLogin(username, password, role)) {
          // Predefined login - redirect to registration
          onRegister(role);
        } else {
          // Check if user exists in registered users
          const user = getUser(username, password, role);
          if (user) {
            onLogin(user);
          } else {
            setError(
              "Invalid credentials. Please use predefined credentials for first-time setup."
            );
          }
        }
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
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

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>

        {/* Login Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
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
              {getRoleDisplayName(role)} Login
            </motion.h2>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {role === "student"
                ? "Enter your credentials to access your dashboard"
                : "Use predefined credentials for first-time setup"}
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter your username"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter your password"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Error Message */}
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

            {/* Submit Button */}
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
                  Signing In...
                </motion.div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>

          {/* Helper Text */}
          {role !== "student" && (
            <motion.div
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-sm text-blue-700">
                <strong>First-time users:</strong> Use predefined credentials to
                set up your account.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Admin: admin/admin123 | Faculty: faculty/faculty123 | Class
                Teacher: classteacher/teacher123
              </p>
            </motion.div>
          )}

          {role === "student" && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <motion.button
                  onClick={() => onRegister(role)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Register here
                </motion.button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
