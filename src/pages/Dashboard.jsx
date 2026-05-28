import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard({ role, goAdmin }) {

  const [staffList, setStaffList] = useState([])
  const [attendanceList, setAttendanceList] = useState([])

  const [selectedStaff, setSelectedStaff] = useState('')

  // LOAD STAFF
  const loadStaff = async () => {

    const { data } = await supabase
      .from('government_staff')
      .select('*')
      .order('nama')

    setStaffList(data || [])
  }

  // LOAD ABSENSI
  const loadAttendance = async () => {

    const { data } = await supabase
      .from('government_attendance')
      .select(`
        *,
        government_staff (
          nama,
          jabatan
        )
      `)
      .order('created_at', { ascending: false })

    setAttendanceList(data || [])
  }

  useEffect(() => {
    loadStaff()
    loadAttendance()
  }, [])

  // 🟢 ON DUTY
  const handleOnDuty = async () => {

    if (!selectedStaff) {
      alert('Pilih staff dulu')
      return
    }

    const { data: userData } =
      await supabase.auth.getUser()

    const now = new Date()

    await supabase
      .from('government_attendance')
      .insert({
        staff_id: selectedStaff,
        tanggal: now.toISOString().split('T')[0],
        on_duty: now.toTimeString().split(' ')[0],
        created_by: userData.user.id
      })

    loadAttendance()
  }

  // 🔴 OFF DUTY
  const handleOffDuty = async () => {

    if (!selectedStaff) {
      alert('Pilih staff dulu')
      return
    }

    const now = new Date()

    const { data } = await supabase
      .from('government_attendance')
      .select('*')
      .eq('staff_id', selectedStaff)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!data) {
      alert('Belum ON DUTY')
      return
    }

    await supabase
      .from('government_attendance')
      .update({
        off_duty: now.toTimeString().split(' ')[0]
      })
      .eq('id', data.id)

    loadAttendance()
  }

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div style={{ padding: 25 }}>

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >

        <div>
          <h1>🏛️ Pemerintah Kota Cemara</h1>

          <p style={{ color: '#94a3b8' }}>
            Sistem Absensi Pemerintah
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px 18px',
            border: 'none',
            borderRadius: 12,
            background: '#dc2626',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>

      </div>

      {/* FORM */}
      <div
        style={{
          marginTop: 30,
          padding: 25,
          borderRadius: 22,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}
      >

        <h2>📌 Input Absensi</h2>

        <select
          value={selectedStaff}
          onChange={(e) =>
            setSelectedStaff(e.target.value)
          }
          style={{
            width: '100%',
            padding: 14,
            marginTop: 20,
            borderRadius: 12,
            background: '#0f172a',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >

          <option value=''>
            Pilih Staff Pemerintah
          </option>

          {staffList.map((staff) => (
            <option
              key={staff.id}
              value={staff.id}
            >
              {staff.nama} - {staff.jabatan}
            </option>
          ))}

        </select>

        <div
          style={{
            display: 'flex',
            gap: 15,
            marginTop: 20,
            flexWrap: 'wrap'
          }}
        >

          <button
            onClick={handleOnDuty}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderRadius: 14,
              background: '#22c55e',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🟢 ON DUTY
          </button>

          <button
            onClick={handleOffDuty}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderRadius: 14,
              background: '#ef4444',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔴 OFF DUTY
          </button>

          {role === 'admin' && (
            <button
              onClick={goAdmin}
              style={{
                padding: '14px 20px',
                border: 'none',
                borderRadius: 14,
                background: '#f59e0b',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🛠️ Admin Panel
            </button>
          )}

        </div>

      </div>

      {/* TABLE */}
      <div
        style={{
          marginTop: 30,
          padding: 25,
          borderRadius: 22,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflowX: 'auto'
        }}
      >

        <h2>📋 Data Absensi Pemerintah</h2>

        <table
          style={{
            width: '100%',
            marginTop: 20,
            borderCollapse: 'collapse'
          }}
        >

          <thead>

            <tr style={{
              background: 'rgba(255,255,255,0.05)'
            }}>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Jabatan</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>ON DUTY</th>
              <th style={thStyle}>OFF DUTY</th>
            </tr>

          </thead>

          <tbody>

            {attendanceList.map((item) => (

              <tr key={item.id}>

                <td style={tdStyle}>
                  {item.government_staff?.nama}
                </td>

                <td style={tdStyle}>
                  {item.government_staff?.jabatan}
                </td>

                <td style={tdStyle}>
                  {item.tanggal}
                </td>

                <td style={tdStyle}>
                  {item.on_duty || '-'}
                </td>

                <td style={tdStyle}>
                  {item.off_duty || '-'}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

const thStyle = {
  padding: 14,
  textAlign: 'left',
  borderBottom: '1px solid rgba(255,255,255,0.08)'
}

const tdStyle = {
  padding: 14,
  borderBottom: '1px solid rgba(255,255,255,0.05)'
}