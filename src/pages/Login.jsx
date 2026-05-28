import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {

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

  if (!email || !password) {
    alert('Email dan password wajib diisi')
    return
  }

  // ================= REGISTER =================
  if (mode === 'register') {

    // register auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    // simpan ke profiles
    if (data.user) {

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            role: role
          }
        ])

      if (profileError) {
        console.log(profileError)
      }
    }

    // refresh total staff
    fetchStats()

    alert('Akun berhasil dibuat')
    setMode('login')
    return
  }

  // ================= LOGIN =================
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

          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

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

        .statCard h2{
          font-size:32px;
          margin-bottom:8px;
        }

        .statCard p{
          color:#cbd5e1;
        }

        .right{
          width:480px;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:40px;
          z-index:2;
        }

        .loginBox{
          width:100%;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(20px);
          border-radius:30px;
          padding:35px;
        }

        .tab{
          display:flex;
          background:rgba(255,255,255,0.05);
          padding:5px;
          border-radius:14px;
          margin-bottom:30px;
        }

        .tab button{
          flex:1;
          border:none;
          background:none;
          color:white;
          padding:12px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
        }

        .tab .active{
          background:#2563eb;
        }

        .loginBox h2{
          font-size:32px;
          margin-bottom:8px;
        }

        .desc{
          color:#cbd5e1;
          margin-bottom:24px;
        }

        input{
          width:100%;
          padding:16px;
          margin-bottom:16px;
          border:none;
          border-radius:14px;
          background:rgba(255,255,255,0.05);
          color:white;
          outline:none;
        }

        .loginBtn{
          width:100%;
          padding:16px;
          border:none;
          border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#3b82f6);
          color:white;
          font-weight:700;
          cursor:pointer;
        }

        .switchBtn{
          width:100%;
          margin-top:14px;
          padding:14px;
          border:none;
          background:none;
          color:#93c5fd;
          cursor:pointer;
        }

        @media(max-width:1000px){

          .container{
            flex-direction:column;
          }

          .left{
            padding:40px 25px;
          }

          .hero h1{
            font-size:42px;
          }

          .right{
            width:100%;
            padding:20px;
          }

          .loginBox{
            max-width:500px;
          }

        }

      `}</style>

    </div>
  )
}