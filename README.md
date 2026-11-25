# 💃 DanceAura Studio — Full-Stack Management Platform

A production-grade **Dance Studio Management & Online Learning Platform** built with the full **MERN + TypeScript** stack.

---

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 18 + TypeScript + Vite 6 |
| **Backend** | Node.js 20 + Express.js + TypeScript |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Routing** | React Router v6 |
| **Build** | TypeScript Compiler + Vite Build |

---

## 📁 Project Structure

```
Dance-Studio/
├── client/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── pages/             # All page components
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── DanceCategories.tsx
│   │   │   ├── DanceCourses.tsx
│   │   │   ├── DanceVideos.tsx
│   │   │   ├── StudentRegistration.tsx
│   │   │   ├── StudentLogin.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   ├── StudentDashboard.tsx   ← Learning Progress Tracking
│   │   │   ├── AdminDashboard.tsx     ← Admin Control Center
│   │   │   ├── CourseLearning.tsx     ← Interactive Lesson Player
│   │   │   └── ProfileManagement.tsx
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts         # Axios API layer
│   │   └── types/
│   │       └── index.ts
│   ├── public/                # Static assets, images
│   └── vite.config.ts
│
├── server/                    # Node.js + Express + TypeScript Backend
│   └── src/
│       ├── config/
│       │   └── db.ts          # MongoDB + in-memory fallback
│       ├── models/
│       │   ├── User.ts
│       │   ├── DanceCourse.ts
│       │   ├── Instructor.ts
│       │   ├── Enrollment.ts
│       │   ├── Lesson.ts           ← NEW
│       │   ├── LessonProgress.ts   ← NEW
│       │   └── ContactMessage.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── courseController.ts
│       │   ├── adminController.ts       ← NEW
│       │   └── studentProgressController.ts ← NEW
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── courseRoutes.ts
│       │   ├── adminRoutes.ts      ← NEW
│       │   ├── studentRoutes.ts    ← NEW
│       │   └── apiRouter.ts
│       ├── middleware/
│       │   ├── auth.ts
│       │   └── adminAuth.ts        ← NEW (role-based)
│       ├── utils/
│       │   ├── seed.ts
│       │   └── testSuite.ts
│       ├── types/
│       │   └── index.ts
│       └── server.ts
│
├── .env.example               # Environment variable template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20.14.0
- **MongoDB** (local on port 27017) — or use the automatic **in-memory MongoDB fallback** (zero config needed)

### 1. Clone / Extract Project

```bash
cd C:\Users\AKSA KEERTHANA\.gemini\antigravity\scratch
# Project is at: Dance-Studio\
```

### 2. Install Backend Dependencies

```bash
cd Dance-Studio\server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ..\client
npm install
```

### 4. Configure Environment

```bash
# In server/ directory:
copy .env.example .env
# Edit .env and fill in your values (or leave defaults for in-memory MongoDB)
```

### 5. Start Backend Server

```bash
cd server
npm run build    # Compile TypeScript
node dist/server.js
```

Backend runs at: **http://localhost:5000**

### 6. Start Frontend Dev Server

```bash
cd client
npm run dev      # Development with HMR
# OR
npm run build && npm run preview  # Production preview
```

Frontend runs at: **http://localhost:5173**

---

## 🌱 Database Seeding

On first run, the backend **automatically seeds** the database with:

| Data | Details |
|---|---|
| **Admin User** | `admin@danceaura.com` / `admin123` |
| **Instructor User** | `instructor@danceaura.com` / `dance123` |
| **Demo Student** | `akhilareddyevuri1908@gmail.com` / `1234` |
| **Dance Instructors** | 8 certified faculty members |
| **Dance Courses** | 5 courses (Bharatanatyam, Kathak, Salsa, Contemporary, Bollywood) |
| **Lessons** | 25 structured lessons (5 per course) |
| **Demo Enrollment** | Student Akhila enrolled in Bharatanatyam with 2 lessons pre-completed |

> **In-Memory MongoDB**: If a local MongoDB is not running, an in-memory database is auto-started. Data resets on each server restart in this mode. For persistent data, run a local MongoDB instance or use MongoDB Atlas.

---

## 🔐 Authentication & Roles

| Role | Access Level |
|---|---|
| **Admin** | Full admin dashboard, student/instructor/course CRUD |
| **Student** | Personal dashboard, progress tracking, lesson completion |
| **Instructor** | Instructor portal (future expansion) |

**JWT tokens** are stored in `localStorage` under the key `dance_aura_token`.

---

## 🛡️ Admin Dashboard

Access at: **http://localhost:5173/admin** _(Admin role required)_

### Overview Analytics
- Total registered students, instructors, dance courses, enrollments
- Active students, completed courses count
- Category-wise enrollment breakdown chart
- Recent enrollment activity table

### Student Management
- View all registered students in a searchable table
- Search by name or email in real-time
- View individual student details (enrolled courses, progress, lessons completed)
- Edit student information
- Delete student account (with confirmation modal)

### Instructor Management
- View all 8 faculty members with their assigned courses
- Add new instructor with full profile
- Edit instructor details
- Delete instructor with confirmation

### Course Management
- View all courses with enrollment counts
- Add new dance course (title, category, level, price, instructor, description, thumbnail)
- Edit existing course details
- Delete course with confirmation

---

## 📊 Student Learning Progress Tracking

Access at: **http://localhost:5173/dashboard** _(Student login required)_

### Dashboard Stats Cards
- Total enrolled courses
- Lessons completed count
- Pending lessons count
- Overall learning progress %

### Course Progress Cards
- Course name, thumbnail, instructor, level
- Visual progress bar: `(Completed / Total) × 100`
- Lesson completion badge and date
- "Continue Learning" button → navigates to interactive lesson player

### Interactive Course Learning Page
URL: `/courses/:courseId/learn`

- Full lesson list with checkboxes
- Lesson type, duration, difficulty metadata
- One-click to **mark lesson as completed** (saved to MongoDB)
- **Mark as uncomplete** supported
- Duplicate prevention via compound unique index `(student, course, lesson)`
- Real-time progress bar updates
- **Auto-detects 100% completion** → shows congratulatory celebration banner
- Progress persists across logout and re-login

### Progress History Table
- Enrollment date
- Lessons completed / total
- Progress percentage
- Last accessed date
- Completion date (if completed)

---

## 🔌 REST API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset with token |

### Courses (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all dance courses |
| GET | `/api/courses/:id` | Get course details |
| POST | `/api/courses/:id/enroll` | Enroll in a course |

### Admin (Role: admin required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Overview stats & analytics |
| GET | `/api/admin/students` | List all students (search supported) |
| GET | `/api/admin/students/:id` | Student details |
| PUT | `/api/admin/students/:id` | Edit student |
| DELETE | `/api/admin/students/:id` | Delete student |
| GET | `/api/admin/instructors` | List all instructors |
| POST | `/api/admin/instructors` | Add new instructor |
| PUT | `/api/admin/instructors/:id` | Edit instructor |
| DELETE | `/api/admin/instructors/:id` | Delete instructor |
| GET | `/api/admin/courses` | List all courses |
| POST | `/api/admin/courses` | Create new course |
| PUT | `/api/admin/courses/:id` | Edit course |
| DELETE | `/api/admin/courses/:id` | Delete course |

### Student Progress (Authenticated student)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/student/dashboard` | Dashboard stats & recently accessed |
| GET | `/api/student/progress` | All enrolled course progress |
| GET | `/api/student/courses/:courseId/progress` | Single course lesson progress |
| POST | `/api/student/lessons/:lessonId/complete` | Mark lesson completed |
| POST | `/api/student/lessons/:lessonId/uncomplete` | Unmark lesson |

---

## 🗄️ MongoDB Schemas

### User
- `firstName`, `lastName`, `email` (unique), `password` (bcrypt)
- `phone`, `danceType`, `experience`
- `role`: `student` | `instructor` | `admin`
- `isPaid`, `googleId`, `resetPasswordToken`, `resetPasswordExpires`

### DanceCourse
- `title`, `category`, `level`, `price`, `duration`
- `instructorName`, `instructorId` (ref: Instructor)
- `description`, `image`, `schedule`, `maxStudents`
- `enrolledCount`, `isActive`

### Lesson _(New)_
- `course` (ref: DanceCourse), `title`, `description`
- `order` (lesson sequence), `duration`, `type`, `difficulty`
- `videoUrl`, `isActive`

### LessonProgress _(New)_
- `student` (ref: User), `course` (ref: DanceCourse), `lesson` (ref: Lesson)
- `completed` (boolean), `completedAt` (Date)
- **Unique compound index**: `{ student, course, lesson }` — prevents duplicates

### Enrollment _(Extended)_
- `student` (ref: User), `course` (ref: DanceCourse)
- `enrolledAt`, `scheduleTime`, `paymentStatus`
- `completedLessonsCount`, `totalLessonsCount`
- `progressPercentage` (formula: `completed/total × 100`)
- `isCompleted`, `completedAt`, `lastAccessedAt`

### Instructor
- `name`, `email`, `specialization`, `bio`
- `experience`, `photo`, `rating`, `courses` array

---

## ✅ Test Suite

Run automated API verification:

```bash
cd server
npm run build
node dist/utils/testSuite.js
```

**13 Tests Verified:**

| # | Test | Result |
|---|---|---|
| 1 | Health Check | ✅ PASS |
| 2 | Student Login | ✅ PASS |
| 3 | Admin Login + Role Verified | ✅ PASS |
| 4 | Admin Route 403 for Non-Admin | ✅ PASS |
| 5 | Admin Dashboard Stats | ✅ PASS |
| 6 | Admin Student Search | ✅ PASS |
| 7 | Admin Instructors List | ✅ PASS |
| 8a | Admin Create Course | ✅ PASS |
| 8b | Admin Update Course Price | ✅ PASS |
| 9 | Student Progress Dashboard | ✅ PASS |
| 10 | Course Lessons Progress | ✅ PASS |
| 11 | Lesson Completion (Progress Formula 3/5 = 60%) | ✅ PASS |
| 12 | Progress Persistence Across Re-Login | ✅ PASS |
| 13 | Auto Course Completion at 100% | ✅ PASS |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 12)
- **JWT** tokens expire in 7 days
- **Role-based middleware** (`isAdmin`, `isAuthenticated`) on all protected routes
- `.env` excluded from Git (`.gitignore` includes it)
- Password never returned in API responses
- Password reset uses secure random tokens with 10-minute expiry
- Input validation on all POST/PUT endpoints

---

## 📦 Environment Variables

Copy `.env.example` → `.env` and fill:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (leave blank for auto in-memory)
MONGODB_URI=mongodb://127.0.0.1:27017/dance_studio

# JWT
JWT_SECRET=your_super_secret_key_change_me
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 🎨 Design

- **Color Palette**: Deep purple (`#4a1c6f`), forest green (`#27ae60`), dark teal (`#1c3a47`)
- **Typography**: Dancing Script + Poppins fonts
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth card hover, progress bar transitions, celebration banner

---

## 🏗️ Build Commands

```bash
# Backend
cd server
npm run build       # TypeScript → dist/
npm start           # Start production server

# Frontend
cd client
npm run build       # Vite production build → dist/
npm run preview     # Serve production build locally
npm run dev         # Development HMR server
```

---

*DanceAura Studio Platform — Full-Stack Upgrade by Antigravity AI*
