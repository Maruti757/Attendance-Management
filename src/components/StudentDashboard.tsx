import React, { useState, useEffect } from "react";
import {
  LogOut,
  Calendar,
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { User, Student, LeaveApplication } from "../types";
import { getStudents, updateStudent } from "../utils/dataManager";

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
    documents: [] as File[],
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    const students = getStudents();
    const student = students.find((s) => s.regNumber === user.regNumber);
    if (student) {
      // Ensure leaveApplications is always an array
      const studentWithLeaveApplications = {
        ...student,
        leaveApplications: student.leaveApplications || [],
      };
      setStudentData(studentWithLeaveApplications);
    } else {
      setStudentData(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setLeaveForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setLeaveForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));
    }
  };

  const removeFile = (index: number) => {
    setLeaveForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const submitLeaveApplication = () => {
    if (!studentData) return;

    // Validate that documents are uploaded
    if (leaveForm.documents.length === 0) {
      alert(
        "Please upload supporting documents before submitting the leave application."
      );
      return;
    }

    const leaveApplication: LeaveApplication = {
      id: Date.now().toString(),
      studentId: studentData.id,
      reason: leaveForm.reason,
      fromDate: leaveForm.fromDate,
      toDate: leaveForm.toDate,
      documents: leaveForm.documents,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };

    const updatedStudent = {
      ...studentData,
      leaveApplications: [...studentData.leaveApplications, leaveApplication],
    };

    updateStudent(updatedStudent);
    setStudentData(updatedStudent);
    setShowLeaveForm(false);
    setLeaveForm({ reason: "", fromDate: "", toDate: "", documents: [] });
    alert("Leave application submitted successfully!");
  };

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-orange-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {studentData.fullName} | {studentData.regNumber} |
              Division: {studentData.division}
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
        {/* Attendance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-orange-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Attendance Percentage
                </p>
                <p
                  className={`text-3xl font-bold ${
                    studentData.attendancePercentage >= 75
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {studentData.attendancePercentage}%
                </p>
              </div>
              <Calendar
                className={`w-10 h-10 ${
                  studentData.attendancePercentage >= 75
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-orange-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Classes Attended
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {studentData.presentClasses}/{studentData.totalClasses}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-orange-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Leave Applications
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {studentData.leaveApplications.length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Attendance Status Alert */}
        {studentData.attendancePercentage < 75 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Attendance Shortage Alert
                </h3>
                <p className="text-red-700">
                  Your attendance is below 75%. You need to maintain at least
                  75% attendance to avoid academic issues. Consider submitting a
                  leave application with proper documentation if you have valid
                  reasons for absences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-orange-200 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h3>
            <button
              onClick={() => setShowLeaveForm(true)}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Leave Application</span>
            </button>
          </div>
        </div>

        {/* Leave Applications History */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-orange-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Leave Applications History
            </h3>
          </div>

          <div className="p-6">
            {studentData.leaveApplications.length > 0 ? (
              <div className="space-y-4">
                {studentData.leaveApplications.map((leave) => (
                  <div
                    key={leave.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {leave.fromDate} to {leave.toDate}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted: {leave.submittedDate}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          leave.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : leave.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {leave.status === "pending" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {leave.status === "approved" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {leave.status === "rejected" && (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        {leave.status}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">{leave.reason}</p>

                    {leave.documents.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-600">
                          Attached Documents:
                        </p>
                        <ul className="text-sm text-gray-500">
                          {leave.documents.map((doc, index) => (
                            <li key={index}>• {doc.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {leave.reviewedBy && (
                      <div className="text-sm text-gray-500 mt-2">
                        <p>
                          Reviewed by: {leave.reviewedBy} on {leave.reviewDate}
                        </p>
                        {leave.comments && <p>Comments: {leave.comments}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No leave applications submitted yet
                </p>
                <p className="text-sm text-gray-400">
                  Submit your first leave application above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Submit Leave Application
              </h3>
              <button
                onClick={() => setShowLeaveForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitLeaveApplication();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave
                </label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Please provide a detailed reason for your leave..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.fromDate}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, fromDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.toDate}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, toDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop files here, or{" "}
                    <label className="text-orange-600 cursor-pointer hover:text-orange-700">
                      browse
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, or image files up to 10MB
                  </p>
                </div>

                {leaveForm.documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {leaveForm.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
