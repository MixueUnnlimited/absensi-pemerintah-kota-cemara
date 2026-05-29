import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard({ role, goAdmin }) {

  const [staffList, setStaffList] = useState([])
  const [attendanceList, setAttendanceList] = useState([])
  const [selectedStaff, setSelectedStaff] = useState('')

  // LOAD STAFF
  const loadStaff = async () => {

    const { data, error } = await supabase
      .from('government_staff')
      .select('*')
      .order('nama')

    if (error) {
      console.log(error)
      return
    }

    setStaffList(data || [])
  }

  // LOAD ABSENSI
  const loadAttendance = async () => {

    const { data, error } = await supabase
      .from('government_attendance')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setAttendanceList(data || [])
  }

  useEffect(() => {
    loadStaff()
    loadAttendance()
  }, [])

  // ON DUTY
  const handleOnDuty = async () => {

    if (!selectedStaff) {
      alert('Pilih staff dulu')
      return
    }

    const now = new Date()

    const today =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0')

    const { data: existing } = await supabase
      .from('government_attendance')
      .select('*')
      .eq('staff_id', selectedStaff)
      .eq('tanggal', today)
      .maybeSingle()

    if (existing) {
      alert('Staff sudah ON DUTY hari ini')
      return
    }

    const jamMasuk = now.toLocaleTimeString('id-ID', {
      hour12: false
    })

    const { error } = await supabase
      .from('government_attendance')
      .insert({
        staff_id: selectedStaff,
        tanggal: today,
        on_duty: jamMasuk
      })

    if (error) {
      console.log(error)
      alert(error.message)
      return
    }

    alert('ON DUTY berhasil')

    loadAttendance()
  }

  // OFF DUTY
  const handleOffDuty = async () => {

    if (!selectedStaff) {
      alert('Pilih staff dulu')
      return
    }

    const now = new Date()

    const today =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0')

    const { data: record } = await supabase
      .from('government_attendance')
      .select('*')
      .eq('staff_id', selectedStaff)
      .eq('tanggal', today)
      .maybeSingle()

    if (!record) {
      alert('Belum ON DUTY')
      return
    }

    if (record.off_duty) {
      alert('Sudah OFF DUTY')
      return
    }

    const jamKeluar = now.toLocaleTimeString('id-ID', {
      hour12: false
    })

    const { error } = await supabase
      .from('government_attendance')
      .update({
        off_duty: jamKeluar,
        total_jam: 'Selesai'
      })
      .eq('id', record.id)

    if (error) {
      console.log(error)
      alert(error.message)
      return
    }

    alert('OFF DUTY berhasil')

    loadAttendance()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div style={{ padding: 25 }}>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >

        <div>
          <h1>🏛️ Pemerintah Kota Cemara</h1>
          <p>Sistem Absensi Pemerintah</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

      <div style={{
        marginTop: 30
      }}>

        <select
          value={selectedStaff}
          onChange={(e) =>
            setSelectedStaff(e.target.value)
          }
        >

          <option value=''>
            Pilih Staff
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

        <div style={{
          marginTop: 20,
          display: 'flex',
          gap: 10
        }}>

          <button onClick={handleOnDuty}>
            ON DUTY
          </button>

          <button onClick={handleOffDuty}>
            OFF DUTY
          </button>

          {role === 'admin' && (
            <button onClick={goAdmin}>
              Admin Panel
            </button>
          )}

        </div>

      </div>

      <div style={{
        marginTop: 40
      }}>

        <table
          width='100%'
          border='1'
          cellPadding='10'
        >

          <thead>
            <tr>
              <th>STAFF ID</th>
              <th>TANGGAL</th>
              <th>ON DUTY</th>
              <th>OFF DUTY</th>
              <th>TOTAL</th>
            </tr>
          </thead>

          <tbody>

            {attendanceList.map((item) => (

              <tr key={item.id}>

                <td>{item.staff_id}</td>
                <td>{item.tanggal}</td>
                <td>{item.on_duty || '-'}</td>
                <td>{item.off_duty || '-'}</td>
                <td>{item.total_jam || '-'}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}