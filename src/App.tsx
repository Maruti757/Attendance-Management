import { useState, useEffect } from "react";
import WelcomePage from "./components/WelcomePage";
import AdminDashboard from "./components/AdminDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import ClassTeacherDashboard from "./components/ClassTeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import { User as UserType } from "./types";
import { initializeData } from "./utils/dataManager";

function App() {
  const [currentView, setCurrentView] = useState<string>("welcome");
  const [user, setUser] = useState<UserType | null>(null);
  const [registrationRole, setRegistrationRole] = useState<string>("");

  useEffect(() => {
    initializeData();
  }, []);

  const handleLogin = (userData: UserType) => {
    setUser(userData);
    switch (userData.role) {
      case "admin":
        setCurrentView("admin-dashboard");
        break;
      case "faculty":
        setCurrentView("faculty-dashboard");
        break;
      case "classteacher":
        setCurrentView("classteacher-dashboard");
        break;
      case "student":
        setCurrentView("student-dashboard");
        break;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("welcome");
    setRegistrationRole("");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomePage onRoleSelect={setCurrentView} />;
      case "admin-login":
      case "faculty-login":
      case "classteacher-login":
      case "student-login":
        return (
          <LoginForm
            role={currentView.replace("-login", "")}
            onLogin={handleLogin}
            onBack={() => setCurrentView("welcome")}
            onRegister={(role) => {
              setRegistrationRole(role);
              setCurrentView(`${role}-register`);
            }}
          />
        );
      case "admin-register":
      case "faculty-register":
      case "classteacher-register":
      case "student-register":
        return (
          <RegistrationForm
            role={registrationRole}
            onRegister={() => {
              alert(
                "Registration successful! Please login with your credentials."
              );
              setCurrentView(`${registrationRole}-login`);
              setRegistrationRole("");
            }}
            onBack={() => setCurrentView(`${registrationRole}-login`)}
          />
        );
      case "admin-dashboard":
        return <AdminDashboard user={user!} onLogout={handleLogout} />;
      case "faculty-dashboard":
        return <FacultyDashboard user={user!} onLogout={handleLogout} />;
      case "classteacher-dashboard":
        return <ClassTeacherDashboard user={user!} onLogout={handleLogout} />;
      case "student-dashboard":
        return <StudentDashboard user={user!} onLogout={handleLogout} />;
      default:
        return <WelcomePage onRoleSelect={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {renderCurrentView()}
    </div>
  );
}

export default App;
