import { useState } from 'react'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [mode, setMode] = useState('login')

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Email dan password wajib diisi')
      return
    }

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) return alert(error.message)

      alert('Akun berhasil dibuat')
      setMode('login')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return alert(error.message)

    alert(`Login berhasil sebagai ${role.toUpperCase()}`)

    if (onLogin) onLogin(role)
  }

  return (
    <div className="container">

      {/* BACKGROUND EFFECT */}
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
          <span className="badge">ABSENSI DIGITAL</span>

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

        <div className="stats">

          <div className="statCard">
            <h2>27</h2>
            <p>Total Staff</p>
          </div>

          <div className="statCard">
            <h2>18</h2>
            <p>Online Hari Ini</p>
          </div>

          <div className="statCard">
            <h2>99%</h2>
            <p>Server Stabil</p>
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
          filter:drop-shadow(0 10px 20px rgba(0,0,0,0.4));
        }

        .logoBox h2{
          font-size:18px;
          color:#cbd5e1;
          letter-spacing:1px;
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
          min-width:160px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.08);
          backdrop-filter:blur(20px);
          padding:24px;
          border-radius:24px;
          transition:0.3s;
        }

        .statCard:hover{
          transform:translateY(-5px);
          background:rgba(255,255,255,0.09);
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
          box-shadow:0 20px 60px rgba(0,0,0,0.4);
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
          transition:0.3s;
        }

        .tab .active{
          background:#2563eb;
          box-shadow:0 10px 20px rgba(37,99,235,0.4);
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
          font-size:15px;
          border:1px solid transparent;
          transition:0.3s;
        }

        input:focus{
          border:1px solid #3b82f6;
          background:rgba(255,255,255,0.08);
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
          font-size:15px;
          transition:0.3s;
        }

        .loginBtn:hover{
          transform:translateY(-2px);
          box-shadow:0 15px 30px rgba(37,99,235,0.4);
        }

        .switchBtn{
          width:100%;
          margin-top:14px;
          padding:14px;
          border:none;
          background:none;
          color:#93c5fd;
          cursor:pointer;
          transition:0.3s;
        }

        .switchBtn:hover{
          color:white;
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