import React, { useState, useEffect } from "react";
import {
  LogOut,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Save,
  X,
} from "lucide-react";
import { User, Student } from "../../../client/src/types";
import {
  getStudents,
  updateStudent,
  calculateAttendancePercentage,
} from "../../../client/src/utils/dataManager";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [attendanceUpdate, setAttendanceUpdate] = useState({
    present: 0,
    total: 0,
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allStudents = getStudents();
    setStudents(allStudents);
  };

  const divisions = ["A1", "A2", "A3", "A4", "A5", "A6"];

  const filteredStudents =
    selectedDivision === "all"
      ? students
      : students.filter((student) => student.division === selectedDivision);

  const getStatistics = () => {
    const totalStudents = students.length;
    const totalPresent = students.reduce(
      (sum, student) => sum + student.presentClasses,
      0
    );
    const totalClasses = students.reduce(
      (sum, student) => sum + student.totalClasses,
      0
    );
    const averageAttendance =
      totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
    const shortageStudents = students.filter(
      (student) => student.attendancePercentage < 75
    ).length;

    return { totalStudents, averageAttendance, shortageStudents };
  };

  const handleUpdateAttendance = (student: Student) => {
    const updatedStudent = {
      ...student,
      presentClasses: attendanceUpdate.present,
      totalClasses: attendanceUpdate.total,
      attendancePercentage: calculateAttendancePercentage(
        attendanceUpdate.present,
        attendanceUpdate.total
      ),
    };

    updateStudent(updatedStudent);
    loadStudents();
    setEditingStudent(null);
    setAttendanceUpdate({ present: 0, total: 0 });
  };

  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Administrator Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user.fullName}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalStudents}
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Attendance
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.averageAttendance}%
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Shortage Students
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.shortageStudents}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-purple-200 shadow-lg mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="division-select" className="text-sm font-medium text-gray-700">
              Filter by Division:
            </label>
            <select
              id="division-select"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Divisions</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-purple-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Students Overview
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Division
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
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-purple-50/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {student.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.regNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent === student.id ? (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Present"
                            value={attendanceUpdate.present}
                            onChange={(e) =>
                              setAttendanceUpdate({
                                ...attendanceUpdate,
                                present: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-gray-500">/</span>
                          <input
                            type="number"
                            placeholder="Total"
                            value={attendanceUpdate.total}
                            onChange={(e) =>
                              setAttendanceUpdate({
                                ...attendanceUpdate,
                                total: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ) : (
                        <div className="text-sm">
                          <span className="text-gray-900">
                            {student.presentClasses}/{student.totalClasses}
                          </span>
                          <div className="text-xs text-gray-500">
                            {student.attendancePercentage}%
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                      {editingStudent === student.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateAttendance(student)}
                            className="text-green-600 hover:text-green-900"
                            title="Save attendance"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(null);
                              setAttendanceUpdate({ present: 0, total: 0 });
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-purple-600 hover:text-purple-900"
                            title="View student details"
                            aria-label="View student details"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View student details</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(student.id);
                              setAttendanceUpdate({
                                present: student.presentClasses,
                                total: student.totalClasses,
                              });
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
              <p className="text-sm text-gray-400">
                Students will appear here after registration
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
                title="Close student details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="text-gray-900">{selectedStudent.fullName}</p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
