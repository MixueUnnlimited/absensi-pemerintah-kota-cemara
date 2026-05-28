import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [mode, setMode] = useState('login')

  // realtime stats
  const [totalStaff, setTotalStaff] = useState(0)
  const [onlineToday, setOnlineToday] = useState(0)

  // fetch data
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {

    // TOTAL STAFF
    const { count: total } = await supabase
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true
      })

    // ONLINE HARI INI
    const today = new Date().toISOString().split('T')[0]

    const { count: online } = await supabase
      .from('attendance')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('date', today)
      .eq('status', 'ON_DUTY')

    setTotalStaff(total || 0)
    setOnlineToday(online || 0)
  }

  const handleAuth = async () => {

    // LOGIN VALIDATION
    if (mode === 'login') {

      if (!email || !password) {
        alert('Email dan password wajib diisi')
        return
      }

    }

    // REGISTER VALIDATION
    if (mode === 'register') {

      if (!name || !email || !password) {
        alert('Nama, email, dan password wajib diisi')
        return
      }

      // REGISTER AUTH
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
        return
      }

      // SAVE PROFILE
      if (data.user) {

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: name,
              email: email,
              role: role
            }
          ])

        if (profileError) {
          console.log(profileError)
        }
      }

      // REFRESH STATS
      fetchStats()

      alert('Akun berhasil dibuat')
      setMode('login')
      return
    }

    // LOGIN
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    alert(`Login berhasil sebagai ${role.toUpperCase()}`)

    if (onLogin) {
      onLogin(role)
    }
  }

  return (
    <div className="container">

      {/* BACKGROUND */}
      <div className="blur blur1"></div>
      <div className="blur blur2"></div>

      {/* LEFT */}
      <div className="left">

        <div className="logoBox">
          <img src={logo} alt="Logo" />

          <div>
            <h2>PEMERINTAH</h2>
            <h1>KOTA CEMARA</h1>
          </div>
        </div>

        <div className="hero">

          <span className="badge">
            ABSENSI DIGITAL
          </span>

          <h1>
            Website Absensi
            <br />
            Pegawai Pemerintah
          </h1>

          <p>
            Sistem absensi modern untuk ON DUTY dan OFF DUTY
            pegawai pemerintah secara realtime dan aman.
          </p>

        </div>

        {/* STATS */}
        <div className="stats">

          <div className="statCard">
            <h2>{totalStaff}</h2>
            <p>Total Staff</p>
          </div>

          <div className="statCard">
            <h2>{onlineToday}</h2>
            <p>Online Hari Ini</p>
          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="right">

        <div className="loginBox">

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
            {mode === 'login'
              ? 'Selamat Datang 👋'
              : 'Buat Akun Baru'}
          </h2>

          <p className="desc">
            {mode === 'login'
              ? `Login sebagai ${role.toUpperCase()}`
              : `Daftar akun ${role.toUpperCase()}`}
          </p>

          {/* INPUT NAMA */}
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {/* INPUT EMAIL */}
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* INPUT PASSWORD */}
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="loginBtn"
            onClick={handleAuth}
          >
            {mode === 'login'
              ? 'LOGIN'
              : 'DAFTAR'}
          </button>

          <button
            className="switchBtn"
            onClick={() =>
              setMode(
                mode === 'login'
                  ? 'register'
                  : 'login'
              )
            }
          >
            {mode === 'login'
              ? 'Belum punya akun? Daftar'
              : 'Sudah punya akun? Login'}
          </button>

        </div>

      </div>

      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family:Inter,sans-serif;
        }

        .container{
          min-height:100vh;
          display:flex;
          background:
          radial-gradient(circle at top left,#1e3a8a 0%,transparent 30%),
          radial-gradient(circle at bottom right,#0f172a 0%,transparent 35%),
          linear-gradient(135deg,#020617,#0f172a,#111827);
          color:white;
          position:relative;
          overflow:hidden;
        }

        .blur{
          position:absolute;
          border-radius:999px;
          filter:blur(100px);
          opacity:0.2;
        }

        .blur1{
          width:300px;
          height:300px;
          background:#2563eb;
          top:-50px;
          left:-50px;
        }

        .blur2{
          width:300px;
          height:300px;
          background:#06b6d4;
          bottom:-100px;
          right:-100px;
        }

        .left{
          flex:1;
          padding:60px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          z-index:2;
        }

        .logoBox{
          display:flex;
          align-items:center;
          gap:20px;
          margin-bottom:40px;
        }

        .logoBox img{
          width:110px;
        }

        .logoBox h2{
          font-size:18px;
          color:#cbd5e1;
        }

        .logoBox h1{
          font-size:34px;
          font-weight:800;
        }

        .badge{
          display:inline-block;
          background:rgba(37,99,235,0.2);
          border:1px solid rgba(96,165,250,0.3);
          color:#93c5fd;
          padding:8px 14px;
          border-radius:999px;
          margin-bottom:20px;
          font-size:14px;
        }

        .hero h1{
          font-size:64px;
          line-height:1.1;
          margin-bottom:20px;
          font-weight:800;
        }

        .hero p{
          max-width:600px;
          color:#cbd5e1;
          font-size:18px;
          line-height:1.7;
        }

        .stats{
          display:flex;
          gap:20px;
          margin-top:50px;
          flex-wrap:wrap;
        }

        .statCard{
          flex:1;
          min-width:220px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.08);
          backdrop-filter:blur(20px);
          padding:24px;
          border-radius:24px;
        }

      `}</style>

    </div>
  )
}