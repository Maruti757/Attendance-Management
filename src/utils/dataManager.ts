import {
  User,
  Student,
  AttendanceRecord,
  DailyAttendance,
} from "../types"; // Update the path to the correct location of the 'types' file

const PREDEFINED_CREDENTIALS = {
  admin: { username: "admin", password: "admin123" },
  faculty: { username: "faculty", password: "faculty123" },
  classteacher: { username: "classteacher", password: "teacher123" },
};

export const initializeData = () => {
  // Initialize empty arrays if they don't exist
  if (!localStorage.getItem("students")) {
    localStorage.setItem("students", JSON.stringify([]));
  }
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
  if (!localStorage.getItem("dailyAttendance")) {
    localStorage.setItem("dailyAttendance", JSON.stringify([]));
  }
};

export const validatePredefinedLogin = (
  username: string,
  password: string,
  role: string
): boolean => {
  const credentials =
    PREDEFINED_CREDENTIALS[role as keyof typeof PREDEFINED_CREDENTIALS];
  return (
    credentials &&
    credentials.username === username &&
    credentials.password === password
  );
};

export const saveUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  // Check if user already exists
  const existingIndex = users.findIndex(
    (u: User) => u.username === user.username && u.role === user.role
  );
  if (existingIndex !== -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem("users", JSON.stringify(users));
};

export const getUser = (
  username: string,
  password: string,
  role: string
): User | null => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  return (
    users.find(
      (user: User) =>
        user.username === username &&
        user.password === password &&
        user.role === role
    ) || null
  );
};

export const saveStudent = (student: Student) => {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const existingIndex = students.findIndex(
    (s: Student) => s.regNumber === student.regNumber
  );
  if (existingIndex !== -1) {
    students[existingIndex] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem("students", JSON.stringify(students));
};

export const getStudents = (): Student[] => {
  return JSON.parse(localStorage.getItem("students") || "[]");
};

export const updateStudent = (updatedStudent: Student) => {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const index = students.findIndex(
    (student: Student) => student.id === updatedStudent.id
  );
  if (index !== -1) {
    students[index] = updatedStudent;
    localStorage.setItem("students", JSON.stringify(students));
  }
};

export const getDivisionFromRegNumber = (regNumber: string): string => {
  const regNum = parseInt(regNumber.replace("REG", ""));
  if (regNum >= 1 && regNum <= 60) return "A1";
  if (regNum >= 61 && regNum <= 120) return "A2";
  if (regNum >= 121 && regNum <= 180) return "A3";
  if (regNum >= 181 && regNum <= 240) return "A4";
  if (regNum >= 241 && regNum <= 300) return "A5";
  if (regNum >= 301 && regNum <= 360) return "A6";
  return "A1";
};

export const calculateAttendancePercentage = (
  presentClasses: number,
  totalClasses: number
): number => {
  return totalClasses > 0
    ? Math.round((presentClasses / totalClasses) * 100)
    : 0;
};

export const saveDailyAttendance = (attendance: DailyAttendance) => {
  const dailyAttendance = JSON.parse(
    localStorage.getItem("dailyAttendance") || "[]"
  );
  const existingIndex = dailyAttendance.findIndex(
    (a: DailyAttendance) =>
      a.date === attendance.date &&
      a.subject === attendance.subject &&
      a.division === attendance.division
  );

  if (existingIndex !== -1) {
    dailyAttendance[existingIndex] = attendance;
  } else {
    dailyAttendance.push(attendance);
  }

  localStorage.setItem("dailyAttendance", JSON.stringify(dailyAttendance));
};

export const getDailyAttendance = (): DailyAttendance[] => {
  return JSON.parse(localStorage.getItem("dailyAttendance") || "[]");
};

export const updateStudentAttendanceFromDaily = (
  date: string,
  subject: string,
  division: string,
  facultyId: string,
  facultyName: string
) => {
  const dailyAttendance = getDailyAttendance();
  const attendance = dailyAttendance.find(
    (a) => a.date === date && a.subject === subject && a.division === division
  );

  if (!attendance) return;

  const students = getStudents();
  const divisionStudents = students.filter((s) => s.division === division);

  divisionStudents.forEach((student) => {
    const status = attendance.records[student.id] || "absent";

    // Check if this attendance record already exists
    const existingRecord = student.attendance.find(
      (a) => a.date === date && a.subject === subject
    );

    if (!existingRecord) {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString() + student.id,
        date,
        subject,
        status,
        facultyId,
        facultyName,
      };

      student.attendance.push(newRecord);
      student.totalClasses += 1;
      if (status === "present") {
        student.presentClasses += 1;
      }
      student.attendancePercentage = calculateAttendancePercentage(
        student.presentClasses,
        student.totalClasses
      );

      updateStudent(student);
    }
  });

  // Refresh all dashboards by triggering a storage event
  window.dispatchEvent(new Event("storage"));
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const updateStudentAttendanceFromLeave = (
  studentId: string,
  fromDate: string,
  toDate: string,
  approvedBy: string
) => {
  const students = getStudents();
  const student = students.find((s) => s.id === studentId);

  if (!student) return;

  const from = new Date(fromDate);
  const to = new Date(toDate);
  const daysDiff =
    Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Add leave days as present classes
  student.presentClasses += daysDiff;
  student.attendancePercentage = calculateAttendancePercentage(
    student.presentClasses,
    student.totalClasses
  );

  updateStudent(student);
};
