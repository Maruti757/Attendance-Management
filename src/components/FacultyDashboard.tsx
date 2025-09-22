import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Users,
  Calendar,
  BookOpen,
  Check,
  X,
  Plus,
  Save,
  Eye,
} from "lucide-react";
import { User, Student, DailyAttendance } from "../types";
import {
  getStudents,
  saveDailyAttendance,
  updateStudentAttendanceFromDaily,
} from "../utils/dataManager";

interface FacultyDashboardProps {
  user: User;
  onLogout: () => void;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: "present" | "absent";
  }>({});
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allStudents = getStudents();
    const divisionStudents = user.division
      ? allStudents.filter((student) => student.division === user.division)
      : allStudents;
    setStudents(divisionStudents);
  };

  const handleAttendanceChange = (
    studentId: string,
    status: "present" | "absent"
  ) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const submitAttendance = () => {
    if (!user.subject || !user.division) return;

    const dailyAttendance: DailyAttendance = {
      date: selectedDate,
      subject: user.subject,
      division: user.division,
      records: attendanceData,
    };

    saveDailyAttendance(dailyAttendance);
    updateStudentAttendanceFromDaily(
      selectedDate,
      user.subject,
      user.division,
      user.id,
      user.fullName
    );

    loadStudents();
    setAttendanceData({});
    setShowAttendanceForm(false);
    alert("Attendance submitted successfully!");
  };

  const getAttendanceStats = () => {
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
    const presentToday = Object.values(attendanceData).filter(
      (status) => status === "present"
    ).length;

    return { totalStudents, averageAttendance, shortageStudents, presentToday };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-lg border-b border-blue-200 px-6 py-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Faculty Dashboard
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Welcome, {user.fullName} | Subject: {user.subject} | Division:{" "}
              {user.division}
            </motion.p>
          </div>
          <motion.button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.header>

      <div className="p-6">
        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              title: "Total Students",
              value: stats.totalStudents,
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-100",
            },
            {
              title: "Average Attendance",
              value: `${stats.averageAttendance}%`,
              icon: Calendar,
              color: "text-green-600",
              bg: "bg-green-100",
            },
            {
              title: "Shortage Students",
              value: stats.shortageStudents,
              icon: BookOpen,
              color: "text-red-600",
              bg: "bg-red-100",
            },
            {
              title: "Present Today",
              value: stats.presentToday,
              icon: Check,
              color: "text-purple-600",
              bg: "bg-purple-100",
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
                  >
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Attendance Actions */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              Attendance Management
            </h3>
            <motion.button
              onClick={() => setShowAttendanceForm(true)}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Mark Attendance</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Attendance Form */}
        {showAttendanceForm && (
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Mark Attendance - {user.subject}
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select attendance date"
                  placeholder="Select date"
                />
                <motion.button
                  onClick={() => setShowAttendanceForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {student.regNumber} - {student.division}
                    </p>
                    <p className="text-xs text-gray-400">
                      Current: {student.attendancePercentage}%
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() =>
                        handleAttendanceChange(student.id, "present")
                      }
                      className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        attendanceData[student.id] === "present"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-green-100"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="w-4 h-4" />
                      <span>Present</span>
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        handleAttendanceChange(student.id, "absent")
                      }
                      className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        attendanceData[student.id] === "absent"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-red-100"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                      <span>Absent</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                onClick={() => setShowAttendanceForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={submitAttendance}
                disabled={Object.keys(attendanceData).length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-5 h-5" />
                <span>Submit Attendance</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Students List */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl border border-blue-200 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="px-6 py-4 border-b border-blue-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Students List - Division {user.division}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    className="hover:bg-blue-50/30 transition-colors duration-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {student.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.regNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="text-gray-900">
                          {student.presentClasses}/{student.totalClasses}
                        </span>
                        <div className="text-xs text-gray-500">
                          {student.attendancePercentage}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          student.attendancePercentage >= 75
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.attendancePercentage >= 75
                          ? "Good"
                          : "Shortage"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <motion.button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No students found in your division
              </p>
              <p className="text-sm text-gray-400">
                Students will appear here after registration
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Student Details</h3>
              <motion.button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedStudent.fullName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Registration Number
                </label>
                <p className="text-gray-900">{selectedStudent.regNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Division
                </label>
                <p className="text-gray-900">{selectedStudent.division}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Attendance
                </label>
                <p className="text-gray-900">
                  {selectedStudent.presentClasses}/
                  {selectedStudent.totalClasses} (
                  {selectedStudent.attendancePercentage}%)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Leave Applications
                </label>
                <p className="text-gray-900">
                  {selectedStudent.leaveApplications.length} applications
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FacultyDashboard;
