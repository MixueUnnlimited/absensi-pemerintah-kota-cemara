import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Admin({ goBack }) {

  const [nama, setNama] = useState('')
  const [jabatan, setJabatan] = useState('')

  const [search, setSearch] = useState('')
  const [filterJabatan, setFilterJabatan] = useState('')

  const [staffList, setStaffList] = useState([])
  const [attendanceList, setAttendanceList] = useState([])

  // LOAD STAFF
  const loadStaff = async () => {
    const { data } = await supabase
      .from('government_staff')
      .select('*')
      .order('created_at', { ascending: false })

    setStaffList(data || [])
  }

  // LOAD ATTENDANCE
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

  // REALTIME (FIXED)
  useEffect(() => {
    loadStaff()
    loadAttendance()

    const channel = supabase
      .channel('admin-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'government_staff' },
        () => loadStaff()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'government_attendance' },
        () => loadAttendance()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // FILTER SAFE
  const filteredStaff = staffList.filter((staff) => {
    const nama = staff.nama ?? ''

    const matchSearch =
      nama.toLowerCase().includes(search.toLowerCase())

    const matchJabatan =
      filterJabatan === '' ||
      staff.jabatan === filterJabatan

    return matchSearch && matchJabatan
  })

  const today = new Date().toISOString().split('T')[0]

  // SAFE ATTENDANCE GET (NO DUPLICATE BUG)
  const getTodayAttendance = (staffId) => {
    return attendanceList
      .filter(
        (a) =>
          a.staff_id === staffId &&
          a.tanggal === today
      )
      .sort((a, b) => b.id - a.id)[0]
  }

  // ADD STAFF (ANTI DUPLICATE)
  const addStaff = async () => {
    if (!nama || !jabatan) {
      alert('Lengkapi data')
      return
    }

    const { data: existing } = await supabase
      .from('government_staff')
      .select('*')
      .eq('nama', nama)
      .maybeSingle()

    if (existing) {
      alert('Staff sudah ada')
      return
    }

    await supabase.from('government_staff').insert({
      nama,
      jabatan
    })

    setNama('')
    setJabatan('')
    loadStaff()
  }

  // DELETE SAFE
  const deleteStaff = async (id) => {
    const ok = confirm('Hapus staff ini?')
    if (!ok) return

    const { error } = await supabase
      .from('government_staff')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Gagal hapus staff')
      return
    }

    loadStaff()
  }

  // STATISTIK FIXED
  const todayAttendanceStaff = new Set(
    attendanceList
      .filter(a => a.tanggal === today)
      .map(a => a.staff_id)
  )

  const onDutyCount = attendanceList.filter(
    (a) =>
      a.tanggal === today &&
      a.on_duty &&
      !a.off_duty
  ).length

  const offDutyCount = attendanceList.filter(
    (a) =>
      a.tanggal === today &&
      a.off_duty
  ).length

  const notAttendanceCount =
    staffList.filter(s => !todayAttendanceStaff.has(s.id)).length

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Laporan Absensi Pemerintah Kota Cemara', 14, 20)

    const tableData = filteredStaff.map((staff) => {
      const attendance = getTodayAttendance(staff.id)

      let status = 'BELUM ABSEN'

      if (attendance?.on_duty && !attendance?.off_duty) {
        status = 'ON DUTY'
      }

      if (attendance?.off_duty) {
        status = 'OFF DUTY'
      }

      return [
        staff.nama,
        staff.jabatan,
        status,
        attendance?.on_duty || '-',
        attendance?.off_duty || '-'
      ]
    })

    autoTable(doc, {
      startY: 30,
      head: [['Nama', 'Jabatan', 'Status', 'ON DUTY', 'OFF DUTY']],
      body: tableData
    })

    doc.save('laporan-absensi.pdf')
  }

  return (
    <div style={{ padding: 25 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <div>
          <h1>🏛️ Government Monitoring Center</h1>
          <p style={{ color: '#94a3b8' }}>Pemerintah Kota Cemara</p>
        </div>

        <button onClick={goBack} style={{
          padding: '12px 18px',
          border: 'none',
          borderRadius: 12,
          background: '#334155',
          color: 'white'
        }}>
          ⬅ Dashboard
        </button>
      </div>

      {/* STATS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20,
        marginBottom: 30
      }}>

        <div style={cardStyle}>
          <h2>👥 Total Staff</h2>
          <h1>{staffList.length}</h1>
        </div>

        <div style={cardStyle}>
          <h2>🟢 ON DUTY</h2>
          <h1>{onDutyCount}</h1>
        </div>

        <div style={cardStyle}>
          <h2>🔴 OFF DUTY</h2>
          <h1>{offDutyCount}</h1>
        </div>

        <div style={cardStyle}>
          <h2>⚪ Belum Absen</h2>
          <h1>{notAttendanceCount}</h1>
        </div>

      </div>

      {/* EXPORT */}
      <button onClick={exportPDF} style={{
        padding: '14px 20px',
        background: '#16a34a',
        border: 'none',
        borderRadius: 14,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20
      }}>
        📄 EXPORT PDF
      </button>

      {/* SEARCH */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 20, flexWrap: 'wrap' }}>

        <input
          placeholder="Cari staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={filterJabatan}
          onChange={(e) => setFilterJabatan(e.target.value)}
          style={inputStyle}
        >
          <option value="">Semua Jabatan</option>

          {[...new Set(staffList.map(s => s.jabatan))].map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>

      </div>

      {/* ADD STAFF */}
      <div style={cardStyle}>
        <h2>➕ Tambah Staff</h2>

        <input
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Jabatan"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          style={inputStyle}
        />

        <button onClick={addStaff} style={blueBtn}>
          Simpan
        </button>
      </div>

      {/* TABLE */}
      <div style={cardStyle}>
        <h2>📋 Live Status</h2>

        <table style={{ width: '100%', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Status</th>
              <th>ON</th>
              <th>OFF</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.map((staff) => {
              const att = getTodayAttendance(staff.id)

              let status = 'BELUM ABSEN'
              if (att?.on_duty && !att?.off_duty) status = 'ON DUTY'
              if (att?.off_duty) status = 'OFF DUTY'

              return (
                <tr key={staff.id}>
                  <td>{staff.nama}</td>
                  <td>{staff.jabatan}</td>
                  <td>{status}</td>
                  <td>{att?.on_duty || '-'}</td>
                  <td>{att?.off_duty || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

const cardStyle = {
  padding: 20,
  borderRadius: 20,
  background: 'rgba(255,255,255,0.05)',
  marginBottom: 20
}

const inputStyle = {
  padding: 12,
  marginTop: 10,
  width: '100%',
  borderRadius: 10,
  background: '#0f172a',
  color: 'white',
  border: '1px solid #334155'
}

const blueBtn = {
  marginTop: 15,
  padding: '12px 18px',
  background: '#2563eb',
  border: 'none',
  borderRadius: 12,
  color: 'white',
  fontWeight: 'bold'
}