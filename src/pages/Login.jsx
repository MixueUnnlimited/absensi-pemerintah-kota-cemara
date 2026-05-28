import { useState } from 'react'
import logo from '../assets/logo.png'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')

  const handleLogin = () => {
    if (!email || !password) {
      alert('Email dan password wajib diisi')
      return
    }

    alert(`Login sebagai ${role.toUpperCase()} berhasil`)

    if (onLogin) {
      onLogin(role)
    }
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

          <h2>Selamat Datang</h2>
          <p>Login sebagai {role.toUpperCase()}</p>

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

          <button className="loginBtn" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>

      {/* STYLE FIXED */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .container{
          display:flex;
          min-height:100vh;
          width:100%;
          font-family:sans-serif;
          background: linear-gradient(135deg,#020617,#0f172a,#1e293b);
          color:white;
          overflow-x:hidden;
        }

        .left{
          flex:1;
          padding:60px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap:20px;
        }

        .logoBox{
          display:flex;
          align-items:center;
          gap:15px;
        }

        .logoBox img{
          width:50px;
          height:50px;
          object-fit:contain;
        }

        .cardInfo{
          background: rgba(255,255,255,0.05);
          padding:20px;
          border-radius:15px;
          line-height:1.5;
        }

        .stats{
          display:flex;
          gap:20px;
        }

        .stats div{
          flex:1;
          background: rgba(255,255,255,0.05);
          padding:15px;
          border-radius:12px;
          text-align:center;
        }

        .right{
          flex:1;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:40px;
        }

        .loginBox{
          width:350px;
          background: rgba(255,255,255,0.06);
          padding:30px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
        }

        .tab{
          display:flex;
          margin-bottom:20px;
          background: rgba(255,255,255,0.05);
          border-radius:10px;
          padding:5px;
        }

        .tab button{
          flex:1;
          padding:8px;
          background:none;
          border:none;
          color:white;
          cursor:pointer;
        }

        .tab .active{
          background:#2563eb;
          border-radius:8px;
        }

        input{
          width:100%;
          padding:12px;
          margin-top:15px;
          border-radius:10px;
          border:none;
          background:rgba(255,255,255,0.05);
          color:white;
          outline:none;
        }

        .loginBtn{
          width:100%;
          margin-top:20px;
          padding:12px;
          border:none;
          border-radius:10px;
          background:#2563eb;
          color:white;
          font-weight:bold;
          cursor:pointer;
        }

        .loginBtn:hover{
          background:#1d4ed8;
        }

        @media (max-width: 900px){
          .container{
            flex-direction:column;
          }

          .left{
            padding:30px;
          }

          .right{
            padding:20px;
          }

          .loginBox{
            width:100%;
          }
        }
      `}</style>
    </div>
  )
}