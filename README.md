# 👁️ Employee Attendance Management System

A full-stack Employee Attendance Management System built with the **MERN Stack** for **Inner Eye Consultancy Services LLP**.

## 🚀 Features

- ✅ Employee Login & Registration (JWT Authentication)
- ✅ Attendance Check-In / Check-Out with real-time tracking
- ✅ Working Hours Calculation (auto-detects Half-Day if < 4 hours)
- ✅ Leave Application & Approval System
- ✅ Leave Deduction Calculation (auto-updates balance)
- ✅ HR Dashboard (Manage employees, view attendance, approve/reject leaves)
- ✅ Employee Dashboard (View stats, attendance history, leave balance)
- ✅ Role-based Access Control (Employee vs HR)
- ✅ Responsive & Beautiful UI

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |

## 📁 Project Structure
employee-attendance-system/
├── backend/          # Express API
│   ├── config/       # Database config
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth middleware
│   ├── models/       # Mongoose schemas
│   └── routes/       # API routes
└── frontend/         # React App
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── utils/
plain

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Raunak-singh32/employee-attendance-system.git
cd employee-attendance-system
2. Setup Backend
bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/employee-attendance
# JWT_SECRET=your_secret_key
npm run dev
3. Setup Frontend
bash
cd frontend
npm install
npm start
4. Access the App
Frontend: http://localhost:3000
Backend API: http://localhost:5000
👤 Default Test Accounts
Table
Role	Email	Password
HR	hr@innereye.com	password123
Employee	john@innereye.com	password123
👨‍💻 Developed By
Raunak Kumar
MERN Stack Developer
