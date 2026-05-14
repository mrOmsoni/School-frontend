import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { TeacherProvider } from './context/TeacherContext'

// Public Pages
import Home        from './pages/Home'
import Events      from './pages/Events'
import Gallery     from './pages/Gallery'
import Contact     from './pages/Contact'
import About       from './pages/About'
import Admissions  from './pages/Admissions'

// Admin Pages
import AdminLogin          from './pages/AdminLogin'
import AdminSetup          from './pages/AdminSetup'
import AdminForgotPassword from './pages/AdminForgotPassword'
import AdminResetPassword  from './pages/AdminResetPassword'
import Dashboard           from './pages/admin/Dashboard'
import ManageEvents        from './pages/admin/ManageEvents'
import ManageNotices       from './pages/admin/ManageNotices'
import ManageGallery       from './pages/admin/ManageGallery'
import ManageQueries       from './pages/admin/ManageQueries'
import ManageTeachers      from './pages/admin/ManageTeachers'
import Settings            from './pages/admin/Settings'

// Teacher Pages
import TeacherLogin     from './pages/teacher/TeacherLogin'
import TeacherDashboard from './pages/teacher/Dashboard'
import Attendance       from './pages/teacher/Attendance'
import Materials        from './pages/teacher/Materials'
import TeacherProfile   from './pages/teacher/Profile'

export default function App() {
  return (
    <AuthProvider>
      <TeacherProvider>
        <BrowserRouter>
          <Routes>

            {/* Public pages */}
            <Route path="/"           element={<WithLayout><Home /></WithLayout>} />
            <Route path="/events"     element={<WithLayout><Events /></WithLayout>} />
            <Route path="/gallery"    element={<WithLayout><Gallery /></WithLayout>} />
            <Route path="/contact"    element={<WithLayout><Contact /></WithLayout>} />
            <Route path="/about"      element={<WithLayout><About /></WithLayout>} />
            <Route path="/admissions" element={<WithLayout><Admissions /></WithLayout>} />

            {/* Admin Auth */}
            <Route path="/admin-login"                 element={<AdminLogin />} />
            <Route path="/admin-setup"                 element={<AdminSetup />} />
            <Route path="/admin-forgot-password"       element={<AdminForgotPassword />} />
            <Route path="/admin-reset-password/:token" element={<AdminResetPassword />} />

            {/* Admin Protected */}
            <Route path="/admin"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/events"   element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
            <Route path="/admin/notices"  element={<ProtectedRoute><ManageNotices /></ProtectedRoute>} />
            <Route path="/admin/gallery"  element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
            <Route path="/admin/queries"  element={<ProtectedRoute><ManageQueries /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute><ManageTeachers /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Teacher Pages */}
            <Route path="/teacher-login"      element={<TeacherLogin />} />
            <Route path="/teacher/dashboard"  element={<TeacherDashboard />} />
            <Route path="/teacher/attendance" element={<Attendance />} />
            <Route path="/teacher/materials"  element={<Materials />} />
            <Route path="/teacher/profile"    element={<TeacherProfile />} />

          </Routes>
        </BrowserRouter>
      </TeacherProvider>
    </AuthProvider>
  )
}

function WithLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}