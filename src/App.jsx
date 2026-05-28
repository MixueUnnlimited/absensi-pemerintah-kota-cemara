import { useEffect, useState } from 'react'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

import { supabase } from './lib/supabase'

export default function App() {

  const [page, setPage] = useState('login')
  const [role, setRole] = useState('staff')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    checkSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (session?.user) {

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          const userRole = profile?.role || 'staff'

          setRole(userRole)

          if (userRole === 'admin') {
            setPage('admin')
          } else {
            setPage('dashboard')
          }

        } else {

          setPage('login')

        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  const checkSession = async () => {

    try {

      const { data } = await supabase.auth.getSession()

      const user = data?.session?.user

      if (user) {

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        const userRole = profile?.role || 'staff'

        setRole(userRole)

        if (userRole === 'admin') {
          setPage('admin')
        } else {
          setPage('dashboard')
        }

      } else {

        setPage('login')

      }

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)

    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '30px'
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white',
        fontFamily: 'sans-serif'
      }}
    >

      {page === 'login' && (
        <Login
          onLogin={(profile) => {

            const userRole = profile?.role || 'staff'

            setRole(userRole)

            if (userRole === 'admin') {
              setPage('admin')
            } else {
              setPage('dashboard')
            }

          }}
        />
      )}

      {page === 'dashboard' && (
        <Dashboard
          role={role}
          goAdmin={() => setPage('admin')}
        />
      )}

      {page === 'admin' && (
        <Admin
          goBack={() => setPage('dashboard')}
        />
      )}

    </div>
  )
}