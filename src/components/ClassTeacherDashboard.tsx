import React, { useState, useEffect } from "react";
import {
  LogOut,
  Users,
  Calendar,
  BookOpen,
  Check,
  X,
  Eye,
  FileText,
} from "lucide-react";
import { User, Student, LeaveApplication } from "../types";
import {
  getStudents,
  updateStudent,
  calculateAttendancePercentage,
} from "../utils/dataManager";

interface ClassTeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

const ClassTeacherDashboard: React.FC<ClassTeacherDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [attendanceUpdate, setAttendanceUpdate] = useState({
    present: 0,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState<"students" | "leaves">("students");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allStudents = getStudents();
    const divisionStudents = user.division
      ? allStudents.filter((student) => student.division === user.division)
      : allStudents;
    setStudents(divisionStudents);

    // Collect all leave applications from division students
    const allLeaves = divisionStudents.flatMap((student) =>
      student.leaveApplications.map((leave) => ({
        ...leave,
        studentName: student.fullName,
      }))
    );
    setLeaveApplications(allLeaves);
  };

  const handleAttendanceUpdate = (student: Student) => {
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
    setSelectedStudent(null);
    setAttendanceUpdate({ present: 0, total: 0 });
    alert("Attendance updated successfully!");
  };

  const handleLeaveAction = (
    leaveId: string,
    action: "approved" | "rejected",
    comments?: string
  ) => {
    const updatedStudents = students.map((student) => {
      const updatedLeaves = student.leaveApplications.map((leave) => {
        if (leave.id === leaveId) {
          const updatedLeave = {
            ...leave,
            status: action,
            reviewedBy: user.fullName,
            reviewDate: new Date().toISOString().split("T")[0],
            comments: comments || "",
          };

          // If approved, add the leave days to present classes
          if (action === "approved") {
            const fromDate = new Date(leave.fromDate);
            const toDate = new Date(leave.toDate);
            const leaveDays =
              Math.ceil(
                (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
              ) + 1;

            const updatedStudent = {
              ...student,
              presentClasses: student.presentClasses + leaveDays,
              attendancePercentage: calculateAttendancePercentage(
                student.presentClasses + leaveDays,
                student.totalClasses
              ),
            };

            updateStudent(updatedStudent);
          }

          return updatedLeave;
        }
        return leave;
      });

      const updatedStudent = { ...student, leaveApplications: updatedLeaves };
      updateStudent(updatedStudent);
      return updatedStudent;
    });

    setStudents(updatedStudents);
    loadStudents();
    alert(`Leave application ${action} successfully!`);
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
    const pendingLeaves = leaveApplications.filter(
      (leave) => leave.status === "pending"
    ).length;

    return {
      totalStudents,
      averageAttendance,
      shortageStudents,
      pendingLeaves,
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-green-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Class Teacher Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user.fullName} | Division: {user.division}
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalStudents}
                </p>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Attendance
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.averageAttendance}%
                </p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Shortage Students
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.shortageStudents}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Leaves
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingLeaves}
                </p>
              </div>
              <FileText className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-green-200 shadow-lg mb-6">
          <div className="flex border-b border-green-200">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-3 font-medium ${
                activeTab === "students"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Students Management
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`px-6 py-3 font-medium ${
                activeTab === "leaves"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Leave Applications ({stats.pendingLeaves})
            </button>
          </div>
        </div>

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-green-200 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-green-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Class Students
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50/50">
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
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-green-50/30 transition-colors duration-150"
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
                        <button
                          title="View and update attendance"
                          onClick={() => {
                            setSelectedStudent(student);
                            setAttendanceUpdate({
                              present: student.presentClasses,
                              total: student.totalClasses,
                            });
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
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
              </div>
            )}
          </div>
        )}

        {/* Leave Applications Tab */}
        {activeTab === "leaves" && (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-green-200 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-green-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Leave Applications
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {leaveApplications.map((leave) => (
                <div
                  key={leave.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {leave.studentName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {leave.fromDate} to {leave.toDate}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        leave.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : leave.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{leave.reason}</p>

                  {leave.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleLeaveAction(
                            leave.id,
                            "approved",
                            "Leave approved by class teacher"
                          )
                        }
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() =>
                          handleLeaveAction(
                            leave.id,
                            "rejected",
                            "Leave rejected by class teacher"
                          )
                        }
                        className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {leaveApplications.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No leave applications found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Attendance</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Student
                </label>
                <p className="text-gray-900">{selectedStudent.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Present Classes
                  </label>
                  <input
                    type="number"
                    value={attendanceUpdate.present}
                    onChange={(e) =>
                      setAttendanceUpdate({
                        ...attendanceUpdate,
                        present: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter present classes"
                    title="Present Classes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Classes
                  </label>
                  <input
                    type="number"
                    value={attendanceUpdate.total}
                    onChange={(e) =>
                      setAttendanceUpdate({
                        ...attendanceUpdate,
                        total: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter total classes"
                    title="Total Classes"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAttendanceUpdate(selectedStudent)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTeacherDashboard;
