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

  // REALTIME AUTO REFRESH
  useEffect(() => {

    loadStaff()
    loadAttendance()

    const interval = setInterval(() => {

      loadStaff()
      loadAttendance()

    }, 3000)

    return () => {
      clearInterval(interval)
    }

  }, [])

  // FILTER STAFF
  const filteredStaff = staffList.filter((staff) => {

    const matchSearch =
      staff.nama
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchJabatan =
      filterJabatan === '' ||
      staff.jabatan === filterJabatan

    return matchSearch && matchJabatan
  })

  // HITUNG JAM
  const calculateHours = (onDuty, offDuty) => {

    if (!onDuty || !offDuty) return 0

    const start =
      new Date(`2000-01-01T${onDuty}`)

    const end =
      new Date(`2000-01-01T${offDuty}`)

    const diff =
      (end - start) / 1000 / 60 / 60

    return diff.toFixed(1)
  }

  // TAMBAH STAFF
  const addStaff = async () => {

    if (!nama || !jabatan) {
      alert('Lengkapi data')
      return
    }

    await supabase
      .from('government_staff')
      .insert({
        nama,
        jabatan
      })

    setNama('')
    setJabatan('')

    loadStaff()
  }

  // HAPUS STAFF
  const deleteStaff = async (id) => {

    const confirmDelete =
      confirm('Hapus staff ini?')

    if (!confirmDelete) return

    await supabase
      .from('government_staff')
      .delete()
      .eq('id', id)

    loadStaff()
  }

  // TANGGAL HARI INI
  const today =
    new Date()
      .toISOString()
      .split('T')[0]

  // EXPORT PDF
  const exportPDF = () => {

    const doc = new jsPDF()

    doc.setFontSize(18)

    doc.text(
      'Laporan Absensi Pemerintah Kota Cemara',
      14,
      20
    )

    const tableData =
      filteredStaff.map((staff) => {

        const attendance =
          attendanceList.find(
            (a) =>
              a.staff_id === staff.id &&
              a.tanggal === today
          )

        let status = 'BELUM ABSEN'

        if (
          attendance?.on_duty &&
          !attendance?.off_duty
        ) {
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
      head: [[
        'Nama',
        'Jabatan',
        'Status',
        'ON DUTY',
        'OFF DUTY'
      ]],
      body: tableData
    })

    doc.save('laporan-absensi.pdf')
  }

  // STATISTIK
  const onDutyCount =
    attendanceList.filter(
      (a) =>
        a.tanggal === today &&
        a.on_duty &&
        !a.off_duty
    ).length

  const offDutyCount =
    attendanceList.filter(
      (a) =>
        a.tanggal === today &&
        a.off_duty
    ).length

  const notAttendanceCount =
    staffList.length -
    onDutyCount -
    offDutyCount

  return (
    <div style={{ padding: 25 }}>

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
          flexWrap: 'wrap'
        }}
      >

        <div>
          <h1>🏛️ Government Monitoring Center</h1>

          <p style={{ color: '#94a3b8' }}>
            Pemerintah Kota Cemara
          </p>
        </div>

        <button
          onClick={goBack}
          style={{
            padding: '12px 18px',
            border: 'none',
            borderRadius: 12,
            background: '#334155',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ⬅ Dashboard
        </button>

      </div>

      {/* STATISTIK */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 30
        }}
      >

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

      {/* EXPORT PDF */}
      <div style={{ marginBottom: 20 }}>

        <button
          onClick={exportPDF}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderRadius: 14,
            background: '#16a34a',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📄 EXPORT PDF
        </button>

      </div>

      {/* SEARCH */}
      <div
        style={{
          display: 'flex',
          gap: 15,
          marginBottom: 30,
          flexWrap: 'wrap'
        }}
      >

        <input
          placeholder='🔎 Cari Staff...'
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={searchStyle}
        />

        <select
          value={filterJabatan}
          onChange={(e) =>
            setFilterJabatan(e.target.value)
          }
          style={searchStyle}
        >

          <option value=''>
            Semua Jabatan
          </option>

          {[...new Set(
            staffList.map((s) => s.jabatan)
          )].map((jabatan) => (

            <option
              key={jabatan}
              value={jabatan}
            >
              {jabatan}
            </option>

          ))}

        </select>

      </div>

      {/* FORM */}
      <div style={sectionStyle}>

        <h2>➕ Tambah Staff Pemerintah</h2>

        <input
          placeholder='Nama Staff'
          value={nama}
          onChange={(e) =>
            setNama(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder='Jabatan'
          value={jabatan}
          onChange={(e) =>
            setJabatan(e.target.value)
          }
          style={{
            ...inputStyle,
            marginTop: 14
          }}
        />

        <button
          onClick={addStaff}
          style={blueButton}
        >
          Simpan Staff
        </button>

      </div>

      {/* LIVE STATUS */}
      <div style={sectionStyle}>

        <h2>🟢 Live Status Duty</h2>

        <table style={tableStyle}>

          <thead>
            <tr>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Jabatan</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>ON DUTY</th>
              <th style={thStyle}>OFF DUTY</th>
            </tr>
          </thead>

          <tbody>

            {filteredStaff.map((staff) => {

              const attendance =
                attendanceList.find(
                  (a) =>
                    a.staff_id === staff.id &&
                    a.tanggal === today
                )

              let status = '⚪ BELUM ABSEN'

              if (
                attendance?.on_duty &&
                !attendance?.off_duty
              ) {
                status = '🟢 ON DUTY'
              }

              if (attendance?.off_duty) {
                status = '🔴 OFF DUTY'
              }

              return (
                <tr key={staff.id}>

                  <td style={tdStyle}>
                    {staff.nama}
                  </td>

                  <td style={tdStyle}>
                    {staff.jabatan}
                  </td>

                  <td style={tdStyle}>
                    {status}
                  </td>

                  <td style={tdStyle}>
                    {attendance?.on_duty || '-'}
                  </td>

                  <td style={tdStyle}>
                    {attendance?.off_duty || '-'}
                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>

      </div>

    </div>
  )
}

const sectionStyle = {
  marginTop: 30,
  padding: 25,
  borderRadius: 22,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  overflowX: 'auto'
}

const tableStyle = {
  width: '100%',
  marginTop: 20,
  borderCollapse: 'collapse'
}

const thStyle = {
  padding: 14,
  textAlign: 'left',
  borderBottom:
    '1px solid rgba(255,255,255,0.08)'
}

const tdStyle = {
  padding: 14,
  borderBottom:
    '1px solid rgba(255,255,255,0.05)'
}

const inputStyle = {
  width: '100%',
  padding: 14,
  marginTop: 20,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a',
  color: 'white'
}

const searchStyle = {
  flex: 1,
  minWidth: 250,
  padding: 14,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a',
  color: 'white'
}

const blueButton = {
  padding: '14px 20px',
  marginTop: 20,
  border: 'none',
  borderRadius: 14,
  background: '#2563eb',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const cardStyle = {
  padding: 25,
  borderRadius: 22,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)'
}