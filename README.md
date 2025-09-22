# Complete Attendance Management System

A comprehensive web-based attendance management system built with React, TypeScript, and Tailwind CSS. This system provides role-based access for administrators, faculty members, class teachers, and students with real-time attendance tracking and leave management.

## 🚀 Features

### Role-Based Authentication
- **Admin**: Complete system oversight with user management and attendance control
- **Faculty**: Subject-specific attendance tracking for assigned divisions
- **Class Teacher**: Division-specific student management and leave approval
- **Student**: Personal attendance tracking and leave application submission

### Core Functionality
- **Real-time Attendance Tracking**: Daily attendance marking with automatic percentage calculations
- **Division Management**: Automatic student assignment to divisions (A1-A6) based on registration numbers
- **Leave Management**: Complete workflow from application to approval with attendance adjustment
- **Cross-Dashboard Synchronization**: Updates reflect across all relevant dashboards instantly
- **Shortage Alerts**: Automatic identification of students below 75% attendance threshold

### Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glass-morphism Effects**: Modern backdrop blur and transparency effects
- **Role-based Color Schemes**: Distinct visual themes for each user role
- **Smooth Animations**: Hover states and transitions throughout the interface
- **Professional Dashboard**: Clean, intuitive interfaces with data visualization

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React Context API for authentication and data management
- **Data Storage**: Local Storage for persistent data (easily replaceable with backend)

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Default Login Credentials

### Predefined Accounts (for initial setup)
- **Admin**: `admin123` / `admin@123`
- **Faculty**: `faculty123` / `faculty@123`
- **Class Teacher**: `teacher123` / `teacher@123`

### Registration Flow
1. Login with predefined credentials
2. Access registration form for your role
3. Create new account with custom credentials
4. Logout and login with new credentials

## 👥 User Roles & Permissions

### Admin Dashboard
- View all divisions and students
- Manage student attendance records
- Edit attendance percentages directly
- Monitor system-wide statistics
- Register new administrators

### Faculty Dashboard
- Take daily attendance for assigned division
- View subject-specific attendance statistics
- Monitor student performance trends
- Register new faculty members
- Access historical attendance data

### Class Teacher Dashboard
- Manage specific division students
- Review and approve leave applications
- Update individual student attendance
- Monitor attendance shortage alerts
- Register new class teachers

### Student Dashboard
- View personal attendance statistics
- Track subject-wise performance
- Submit leave applications with documentation
- Monitor attendance shortage status
- View application approval status

## 📊 Division Structure

Students are automatically assigned to divisions based on registration numbers:
- **A1**: Registration numbers 1-60
- **A2**: Registration numbers 61-120
- **A3**: Registration numbers 121-180
- **A4**: Registration numbers 181-240
- **A5**: Registration numbers 241-300
- **A6**: Registration numbers 301-360

## 🎯 Key Features Explained

### Attendance Calculation
- Real-time percentage calculation based on present/total classes
- Automatic shortage identification (below 75%)
- Subject-wise attendance tracking
- Historical data preservation

### Leave Management Workflow
1. Student submits leave application with reason and proof
2. Class teacher reviews application
3. Upon approval, attendance is automatically adjusted
4. Changes reflect across all dashboards instantly

### Data Synchronization
- All attendance updates sync across Admin, Faculty, and Class Teacher dashboards
- Leave approvals automatically update attendance percentages
- Real-time statistics calculation and display

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AdminDashboard.tsx
│   ├── FacultyDashboard.tsx
│   ├── ClassTeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── Login.tsx
│   └── Registration.tsx
├── contexts/            # React Context providers
│   └── AuthContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎨 Customization

### Color Schemes
Each role has a distinct color scheme:
- **Admin**: Red to Pink gradient
- **Faculty**: Green to Emerald gradient
- **Class Teacher**: Purple to Violet gradient
- **Student**: Blue to Indigo gradient

### Styling
The application uses Tailwind CSS with custom configurations:
- Glass-morphism effects with backdrop blur
- Smooth transitions and hover states
- Responsive grid layouts
- Custom gradient backgrounds

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Modular architecture

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review the documentation thoroughly

## 🔮 Future Enhancements

- Backend integration with REST API
- Database integration (PostgreSQL/MongoDB)
- Email notifications for leave applications
- Advanced reporting and analytics
- Mobile application development
- Bulk attendance operations
- Export functionality (PDF/Excel)
- Multi-language support

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
