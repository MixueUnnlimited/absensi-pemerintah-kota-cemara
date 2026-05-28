import { useState } from 'react'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [mode, setMode] = useState('login') // 🔥 login / register

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Email dan password wajib diisi')
      return
    }

    // 🔥 REGISTER
    if (mode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
        return
      }

      alert('Akun berhasil dibuat, silakan login')

      setMode('login')
      return
    }

    // 🔥 LOGIN
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    alert(`Login berhasil sebagai ${role.toUpperCase()}`)
    if (onLogin) onLogin(role)
  }

  return (
    <div className="container">

      {/* LEFT */}
      <div className="left">
        <div className="logoBox">
          <img src={logo} alt="Logo" />
          <h2>PEMERINTAH<br />KOTA CEMARA</h2>
        </div>

        <div className="cardInfo">
          <h1>Website Absensi Staff</h1>
          <p>Sistem absensi ON DUTY / OFF DUTY untuk pegawai pemerintah.</p>
        </div>

        <div className="stats">
          <div>
            <h3>27</h3>
            <p>Total Staff</p>
          </div>
          <div>
            <h3>18</h3>
            <p>Online Hari Ini</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div className="loginBox">

          {/* ROLE TAB */}
          <div className="tab">
            <button
              className={role === 'staff' ? 'active' : ''}
              onClick={() => setRole('staff')}
            >
              STAFF
            </button>

            <button
              className={role === 'admin' ? 'active' : ''}
              onClick={() => setRole('admin')}
            >
              ADMIN
            </button>
          </div>

          <h2>
            {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
          </h2>

          <p>
            {mode === 'login'
              ? `Login sebagai ${role.toUpperCase()}`
              : `Daftar sebagai ${role.toUpperCase()}`}
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="loginBtn" onClick={handleAuth}>
            {mode === 'login' ? 'LOGIN' : 'DAFTAR'}
          </button>

          {/* SWITCH MODE */}
          <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8, textAlign: 'center' }}>
            {mode === 'login'
              ? 'Belum punya akun?'
              : 'Sudah punya akun?'}
          </p>

          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{
              marginTop: 6,
              width: '100%',
              padding: 8,
              borderRadius: 10,
              border: 'none',
              background: 'transparent',
              color: '#60a5fa',
              cursor: 'pointer'
            }}
          >
            {mode === 'login' ? 'Daftar sekarang' : 'Login sekarang'}
          </button>

        </div>
      </div>

      {/* STYLE (biarin punyamu tetap, ini tidak saya ubah biar aman) */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          height: 100%;
          overflow-x: hidden;
        }

        .container {
          display: flex;
          width: 100%;
          min-height: 100vh;
          font-family: sans-serif;
          background: linear-gradient(135deg,#020617,#0f172a,#1e293b);
          color: white;
        }

        .left {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 16px;
        }

        .right {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 60px 20px;
        }

        .loginBox {
          width: 360px;
          max-width: 100%;
          background: rgba(255,255,255,0.06);
          padding: 25px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .tab {
          display: flex;
          margin-bottom: 18px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 5px;
        }

        .tab button {
          flex: 1;
          padding: 8px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .tab .active {
          background: #2563eb;
          border-radius: 8px;
        }

        input {
          width: 100%;
          padding: 11px;
          margin-top: 10px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.05);
          color: white;
          outline: none;
        }

        .loginBtn {
          width: 100%;
          margin-top: 16px;
          padding: 11px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .loginBtn:hover {
          background: #1d4ed8;
        }

        @media (max-width: 900px) {
          .container {
            flex-direction: column;
          }

          .right {
            padding: 20px;
          }

          .loginBox {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}