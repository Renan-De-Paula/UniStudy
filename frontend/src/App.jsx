import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { currentUser } = useAuth();

  return (
    <div>
      {currentUser ? <Home /> : <Login />}
    </div>
  )
}

export default App

