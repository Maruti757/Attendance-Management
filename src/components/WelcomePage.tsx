import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";

interface WelcomePageProps {
  onRoleSelect: (role: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onRoleSelect }) => {
  const roles = [
    {
      id: "admin",
      title: "Administrator",
      description:
        "Manage overall system, view comprehensive reports and oversee all operations",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      id: "faculty",
      title: "Faculty",
      description:
        "Mark daily attendance, track student progress and manage subject-wise records",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      id: "classteacher",
      title: "Class Teacher",
      description:
        "Manage class attendance, approve leave applications and update student records",
      icon: Users,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      bgGradient: "bg-gradient-to-br from-green-50 to-green-100",
    },
    {
      id: "student",
      title: "Student",
      description:
        "View attendance records, submit leave applications and track academic progress",
      icon: GraduationCap,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100",
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Real-time Tracking",
      description:
        "Monitor attendance in real-time with instant updates and comprehensive analytics",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description:
        "Advanced reporting and analytics for better decision making and insights",
    },
    {
      icon: Award,
      title: "Leave Management",
      description:
        "Streamlined leave application process with document upload and approval workflow",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
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
        <motion.div
          className="absolute top-40 left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -20, 40, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Smart Attendance
            </span>
            <br />
            <span className="text-gray-700">Management System</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Revolutionize your educational institution's attendance tracking
            with our comprehensive, user-friendly solution designed for modern
            academic environments
          </motion.p>
        </motion.div>

        {/* Role Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <motion.div
                key={role.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/20"
                onClick={() => onRoleSelect(`${role.id}-login`)}
              >
                <div
                  className={`absolute inset-0 ${role.bgGradient} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                    {role.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors mb-6">
                    {role.description}
                  </p>

                  <motion.div
                    className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Access Portal →
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Choose Our System?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Experience the future of attendance management with cutting-edge
            features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { number: "99.9%", label: "Uptime Guarantee" },
            { number: "24/7", label: "Support Available" },
            { number: "360", label: "Students Capacity" },
            { number: "6", label: "Division Support" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center bg-white/40 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
