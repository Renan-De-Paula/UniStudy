import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import OnboardingIA from './pages/OnboardingIA'
import TrilhaViewer from './pages/TrilhaViewer'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-darker flex items-center justify-center text-white">Carregando...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={currentUser ? <OnboardingIA /> : <Navigate to="/login" />} />
        <Route path="/trilha/:id" element={currentUser ? <TrilhaViewer /> : <Navigate to="/login" />} />
        <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default AppWrapper
