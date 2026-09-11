import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import LostItems from './pages/LostItems'
import FoundItems from './pages/FoundItems'
import ItemDetail from './pages/ItemDetail'
import PostLost from './pages/PostLost'
import PostFound from './pages/PostFound'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import LoadingSpinner from './components/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  return children
}

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  const { loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a1a' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lost" element={<LostItems />} />
          <Route path="/lost/:id" element={<ItemDetail type="lost" />} />
          <Route path="/found" element={<FoundItems />} />
          <Route path="/found/:id" element={<ItemDetail type="found" />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/login" element={
            <PublicOnlyRoute><Login /></PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute><Register /></PublicOnlyRoute>
          } />

          <Route path="/post-lost" element={
            <ProtectedRoute><PostLost /></ProtectedRoute>
          } />
          <Route path="/post-found" element={
            <ProtectedRoute><PostFound /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><Reports /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
