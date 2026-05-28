return (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background:
        'linear-gradient(135deg,#020617,#0f172a,#1e293b)',
      padding: 20
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        padding: 40,
        borderRadius: 28,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 0 40px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}
    >

      <div
        style={{
          fontSize: 42,
          marginBottom: 10
        }}
      >
        🏛️
      </div>

      <h1
        style={{
          fontSize: 42,
          margin: 0,
          fontWeight: 'bold',
          lineHeight: 1
        }}
      >
        KOTA
        <br />
        CEMARA
      </h1>

      <p
        style={{
          color: '#94a3b8',
          marginTop: 12,
          marginBottom: 35
        }}
      >
        Sistem Absensi Pemerintah
      </p>

      <input
        type='email'
        placeholder='Masukkan email'
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type='password'
        placeholder='Masukkan password'
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          ...inputStyle,
          marginTop: 18
        }}
      />

      <button
        onClick={handleLogin}
        style={buttonStyle}
      >
        Login Sistem
      </button>

    </div>
  </div>
)