export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "faculty" | "classteacher" | "student";
  fullName: string;
  subject?: string;
  division?: string;
  regNumber?: string;
  subjects?: string[];
}

export interface Student {
  id: string;
  fullName: string;
  regNumber: string;
  division: string;
  attendance: AttendanceRecord[];
  totalClasses: number;
  presentClasses: number;
  attendancePercentage: number;
  leaveApplications: LeaveApplication[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: "present" | "absent";
  facultyId: string;
  facultyName: string;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName?: string;
  reason: string;
  fromDate: string;
  toDate: string;
  documents: FileData[];
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded
}

export interface DailyAttendance {
  date: string;
  subject: string;
  division: string;
  records: { [studentId: string]: "present" | "absent" };
}
