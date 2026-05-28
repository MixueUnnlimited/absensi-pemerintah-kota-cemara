import { useState, useEffect } from 'react'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

import { supabase } from './lib/supabase'

export default function App() {
  const [page, setPage] = useState('login')
  const [role, setRole] = useState('staff')

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        setRole(profile?.role || 'staff')
        setPage('dashboard')
      }
    }

    checkUser()
  }, [])

  const renderPage = () => {
    if (page === 'login') {
      return (
        <Login
          onLogin={(r) => {
            setRole(r)
            setPage('dashboard')
          }}
        />
      )
    }

    if (page === 'dashboard') {
      return (
        <Dashboard
          role={role}
          goAdmin={() => setPage('admin')}
        />
      )
    }

    if (page === 'admin') {
      return (
        <Admin
          goBack={() => setPage('dashboard')}
        />
      )
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      {renderPage()}
    </div>
  )
}