import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [mode, setMode] = useState('login')

  const [totalStaff, setTotalStaff] = useState(0)
  const [onlineToday, setOnlineToday] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {

      const { count: total } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const today = new Date().toISOString().split('T')[0]

      const { count: online } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'ON_DUTY')

      setTotalStaff(total || 0)
      setOnlineToday(online || 0)

    } catch (err) {
      console.log('STATS ERROR:', err)
    }
  }

  const handleAuth = async () => {

    try {

      // ================= LOGIN =================
      if (mode === 'login') {

        if (!email || !password) {
          return alert('Email dan password wajib diisi')
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) return alert(error.message)

        // FIX: safe query (ANTI 500 / NULL CRASH)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) {
          console.log('PROFILE ERROR:', profileError)
        }

        const finalProfile = profile || {
          id: data.user.id,
          email: data.user.email,
          role: role
        }

        alert(`Login berhasil sebagai ${finalProfile.role}`)

        onLogin?.(finalProfile)

        return
      }

      // ================= REGISTER =================
      if (!name || !email || !password) {
        return alert('Nama, email, dan password wajib diisi')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        console.log('SIGNUP ERROR:', error)
        return alert(error.message)
      }

      if (!data.user) {
        return alert('Signup gagal (user tidak dibuat)')
      }

      // ================= INSERT PROFILE =================
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role
          }
        ])

      if (profileError) {
        console.log('PROFILE ERROR:', profileError)
        return alert('Gagal menyimpan profile')
      }

      // ================= INSERT GOVERNMENT STAFF =================
      const { error: govError } = await supabase
        .from('government_staff')
        .insert([
          {
            id: data.user.id,
            nama: name,
            jabatan: role === 'admin'
              ? 'Administrator'
              : 'Staff Pemerintah'
          }
        ])

      if (govError) {
        console.log('GOV ERROR:', govError)
        return alert('Gagal menyimpan government staff')
      }

      fetchStats()

      alert('Akun berhasil dibuat')

      setMode('login')
      setName('')
      setEmail('')
      setPassword('')

    } catch (err) {
      console.log('AUTH ERROR:', err)
      alert('Terjadi error server')
    }
  }

  return (
    <div className="container">

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
            Website Absensi<br />
            Pegawai Pemerintah
          </h1>

          <p>
            Sistem absensi modern ON DUTY dan OFF DUTY pegawai pemerintah.
          </p>
        </div>

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
            {mode === 'login' ? 'Selamat Datang 👋' : 'Buat Akun Baru'}
          </h2>

          <p className="desc">
            {mode === 'login'
              ? `Login sebagai ${role.toUpperCase()}`
              : `Daftar akun ${role.toUpperCase()}`}
          </p>

          {mode === 'register' && (
            <input
              type="text"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

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

          <button
            className="switchBtn"
            onClick={() =>
              setMode(mode === 'login' ? 'register' : 'login')
            }
          >
            {mode === 'login'
              ? 'Belum punya akun? Daftar'
              : 'Sudah punya akun? Login'}
          </button>

        </div>

      </div>

      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}

        .container{
          min-height:100vh;
          display:flex;
          background:#0f172a;
          color:white;
          overflow-x:hidden;
        }

        .left{flex:1;padding:60px;min-width:0;}
        .right{
          width:450px;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
        }

        .loginBox{
          width:100%;
          background:rgba(255,255,255,0.05);
          padding:30px;
          border-radius:20px;
        }

        .logoBox{
          display:flex;
          gap:20px;
          align-items:center;
          margin-bottom:40px;
          flex-wrap:wrap;
        }

        .logoBox img{width:80px;}

        .hero h1{
          font-size:48px;
          margin:20px 0;
          line-height:1.2;
        }

        .hero p{opacity:0.8;line-height:1.6;}

        .stats{
          display:flex;
          gap:20px;
          margin-top:40px;
          flex-wrap:wrap;
        }

        .statCard{
          flex:1;
          min-width:140px;
          background:rgba(255,255,255,0.05);
          padding:20px;
          border-radius:20px;
        }

        .tab{display:flex;gap:10px;margin-bottom:20px;}

        .tab button{
          flex:1;
          padding:12px;
          border:none;
          border-radius:10px;
          cursor:pointer;
        }

        .active{background:#2563eb;color:white;}

        input{
          width:100%;
          padding:14px;
          margin-bottom:14px;
          border:none;
          border-radius:10px;
          outline:none;
        }

        .loginBtn{
          width:100%;
          padding:14px;
          border:none;
          border-radius:10px;
          background:#2563eb;
          color:white;
          cursor:pointer;
        }

        .switchBtn{
          width:100%;
          padding:10px;
          margin-top:10px;
          background:none;
          border:none;
          color:#93c5fd;
        }

        @media (max-width:900px){
          .container{flex-direction:column;}
          .right{width:100%;}
          .left{padding:30px;}
          .hero h1{font-size:32px;}
          .stats{flex-direction:column;}
        }
      `}</style>

    </div>
  )
}