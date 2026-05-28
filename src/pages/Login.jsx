import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      alert(error.message)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    onLogin(profile?.role || 'staff')
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 20
      }}
    >

      <div
        style={{
          width: 380,
          padding: 35,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      >

        <div style={{ textAlign: 'center' }}>

          <h1 style={{ marginBottom: 5 }}>
            🏛️ KOTA CEMARA
          </h1>

          <p style={{
            color: '#94a3b8',
            marginBottom: 30
          }}>
            Sistem Absensi Pemerintah
          </p>

        </div>

        <div>

          <label>Email</label>

          <input
            placeholder='Masukkan email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: 14,
              marginTop: 8,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              outline: 'none',
              marginBottom: 18
            }}
          />

        </div>

        <div>

          <label>Password</label>

          <input
            type='password'
            placeholder='Masukkan password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: 14,
              marginTop: 8,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              outline: 'none'
            }}
          />

        </div>

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: 14,
            marginTop: 24,
            border: 'none',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Login Sistem
        </button>

      </div>

    </div>
  )
}