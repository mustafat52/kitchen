import { useState } from 'react'
import { getTodayInfo, getAsharaLabel } from '../../lib/calendar'
import { todayLondon, formatTime } from '../../lib/time'
import useAuthStore from '../../store/authStore'
import useTaskStore from '../../store/taskStore'
import useUserStore from '../../store/userStore'
import useMoodStore from '../../store/moodStore'
import { displayName } from '../../data/users'

async function generatePDF(data) {
  const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 14
  const contentW = W - margin * 2
  let y = 0

  const color = (hex) => {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    doc.setTextColor(r, g, b)
  }
  const fillColor = (hex) => {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    doc.setFillColor(r, g, b)
  }
  const drawColor = (hex) => {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    doc.setDrawColor(r, g, b)
  }
  const text = (str, x, yy, opts = {}) => doc.text(str, x, yy, opts)
  const ln = (n = 6) => { y += n }

  // ── BROWN HEADER BAND ──
  fillColor('#7C5C3E')
  doc.rect(0, 0, W, 38, 'F')

  // Logo circle
  fillColor('#3E2A18')
  doc.circle(margin + 7, 19, 7, 'F')
  color('#FFFFFF')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  text('K', margin + 7, 22, { align: 'center' })

  // Title
  color('#FFFFFF')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  text('Kitchen Cleaning — Daily Zone Report', margin + 18, 15)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  text(`Ashara 1448H London  ·  Day ${data.dayNumber}  ·  ${data.date}`, margin + 18, 22)
  text(`Zone: ${data.zoneName}  ·  Admin: ${displayName(data.adminName)}`, margin + 18, 29)

  y = 46

  // ── SUMMARY BOXES ──
  const boxes = [
    { label: 'Total Tasks',  value: data.stats.total,      bg: '#F2EDE8', text: '#2C2118' },
    { label: 'Completed',    value: data.stats.done,        bg: '#EAF2E0', text: '#2E5A18' },
    { label: 'In Progress',  value: data.stats.inProgress,  bg: '#FAF0E2', text: '#7A4A10' },
    { label: 'Pending',      value: data.stats.pending,     bg: '#FAECEC', text: '#A32D2D' },
  ]
  const boxW = contentW / 4 - 2
  boxes.forEach((b, i) => {
    const bx = margin + i * (boxW + 2.6)
    fillColor(b.bg)
    drawColor('#D0C0B0')
    doc.setLineWidth(0.2)
    doc.roundedRect(bx, y, boxW, 18, 2, 2, 'FD')
    color(b.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    text(String(b.value), bx + boxW / 2, y + 9, { align: 'center' })
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    text(b.label, bx + boxW / 2, y + 15, { align: 'center' })
  })

  // Completion bar
  y += 22
  const pct = data.stats.total > 0 ? data.stats.done / data.stats.total : 0
  fillColor('#F2EDE8')
  doc.roundedRect(margin, y, contentW, 5, 2, 2, 'F')
  fillColor('#7C5C3E')
  doc.roundedRect(margin, y, contentW * pct, 5, 2, 2, 'F')
  color('#3E2A18')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  text(`${Math.round(pct * 100)}% complete`, W - margin, y + 4, { align: 'right' })

  y += 12

  // ── TASK TABLE ──
  fillColor('#3E2A18')
  doc.rect(margin, y, contentW, 7, 'F')
  color('#FFFFFF')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  text('TASK DETAILS', margin + 3, y + 5)
  y += 7

  const cols = { task: 85, volunteer: 45, status: 28, time: 24 }
  const colX = {
    task:      margin,
    volunteer: margin + cols.task,
    status:    margin + cols.task + cols.volunteer,
    time:      margin + cols.task + cols.volunteer + cols.status,
  }

  fillColor('#F2EDE8')
  drawColor('#D0C0B0')
  doc.setLineWidth(0.2)
  doc.rect(margin, y, contentW, 6, 'FD')
  color('#5F4F3A')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  text('Task', colX.task + 2, y + 4.2)
  text('Volunteer', colX.volunteer + 2, y + 4.2)
  text('Status', colX.status + 2, y + 4.2)
  text('Time', colX.time + 2, y + 4.2)
  y += 6

  const STATUS_COLORS = {
    done:        { bg: '#EAF2E0', text: '#2E5A18', label: 'Done'        },
    in_progress: { bg: '#FAF0E2', text: '#7A4A10', label: 'In Progress' },
    pending:     { bg: '#FAECEC', text: '#A32D2D', label: 'Pending'     },
  }

  const sorted = [...data.tasks].sort((a, b) => {
    const order = { done: 0, in_progress: 1, pending: 2 }
    return order[a.status] - order[b.status]
  })

  sorted.forEach((task, i) => {
    const rowH = 8
    const sc   = STATUS_COLORS[task.status] || STATUS_COLORS.pending
    const rowBg = i % 2 === 0 ? '#FFFDF9' : '#F7F2EC'

    if (y + rowH > 270) {
      doc.addPage()
      y = 20
    }

    fillColor(rowBg)
    drawColor('#E0D8D0')
    doc.setLineWidth(0.1)
    doc.rect(margin, y, contentW, rowH, 'FD')

    color('#2C2118')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    const maxLen   = task.retroactive ? 38 : 48
    const titleStr = task.title.length > maxLen ? task.title.slice(0, maxLen - 2) + '…' : task.title
    text(titleStr, colX.task + 2, y + 5.2)
    if (task.retroactive) {
      color('#B07030')
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      text('⚠ logged late', colX.task + 2 + doc.getTextWidth(titleStr) + 2, y + 5.2)
    }

    color('#44341E')
    doc.setFontSize(7)
    const vName = task.volunteerName ? displayName(task.volunteerName).split(' ').slice(0,2).join(' ') : '—'
    text(vName, colX.volunteer + 2, y + 5.2)

    fillColor(sc.bg)
    doc.roundedRect(colX.status + 1, y + 1.5, cols.status - 3, 5, 1, 1, 'F')
    color(sc.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    text(sc.label, colX.status + (cols.status - 3) / 2 + 1, y + 5.2, { align: 'center' })

    color('#8C7A6A')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    const timeStr = task.completedAt
      ? formatTime(task.completedAt)
      : '—'
    text(timeStr, colX.time + 2, y + 5.2)

    y += rowH
  })

  y += 8

  // ── MOOD SECTION ──
  if (data.moods && data.moods.total > 0) {
    if (y + 50 > 270) { doc.addPage(); y = 20 }

    fillColor('#3E2A18')
    doc.rect(margin, y, contentW, 7, 'F')
    color('#FFFFFF')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    text('VOLUNTEER MOOD SUMMARY', margin + 3, y + 5)
    y += 10

    const moodLabels = ['Overwhelmed', 'Tired', 'Neutral', 'Satisfied', 'Very Satisfied']
    const maxCount   = Math.max(...Object.values(data.moods.summary), 1)

    ;[5,4,3,2,1].forEach((rating) => {
      const count  = data.moods.summary[rating] || 0
      const barPct = count / maxCount

      color('#44341E')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      text(`${moodLabels[rating-1]}`, margin, y + 3.5)

      fillColor('#F2EDE8')
      doc.roundedRect(margin + 38, y, 100, 5, 1, 1, 'F')
      fillColor('#7C5C3E')
      if (barPct > 0) doc.roundedRect(margin + 38, y, 100 * barPct, 5, 1, 1, 'F')
      color('#3E2A18')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      text(String(count), margin + 142, y + 4)

      y += 8
    })

    y += 2
    color('#8C7A6A')
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    text(`Average mood score: ${data.moods.avg} / 5  ·  ${data.moods.total} submission(s)`, margin, y)
    y += 10
  }

  // ── RETROACTIVE NOTE ──
  const retroTasks = data.tasks.filter((t) => t.retroactive)
  if (retroTasks.length > 0) {
    if (y + 20 > 270) { doc.addPage(); y = 20 }
    fillColor('#FAF0E2')
    drawColor('#B07030')
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, y, contentW, 14, 2, 2, 'FD')
    color('#7A4A10')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    text('⚠  Note:', margin + 3, y + 5.5)
    doc.setFont('helvetica', 'normal')
    text(`${retroTasks.length} task(s) marked ⚠ were completed on a previous day but logged today.`, margin + 18, y + 5.5)
    doc.setFontSize(7)
    text('These are included in today\'s report as per volunteer update.', margin + 18, y + 11)
    y += 18
  }

  // ── FOOTER ──
  const footerY = 285
  fillColor('#F2EDE8')
  doc.rect(0, footerY - 4, W, 12, 'F')
  color('#8C7A6A')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  text('Kitchen Cleaning Task Manager  ·  Ashara 1448H London', margin, footerY + 2)
  text(`Report by: ${displayName(data.adminName)}  ·  ${data.zoneName}`, W - margin, footerY + 2, { align: 'right' })

  doc.save(`Kitchen_Zone_Report_${data.zoneName.replace(/\s+/g, '_')}_Day${data.dayNumber}.pdf`)
}

// ── React Component ──
export default function DailyReport() {
  const { user }                          = useAuthStore()
  const { getTasksByZone, getZoneStats }  = useTaskStore()
  const { getZoneById, getUserById }      = useUserStore()
  const { getSummary }                    = useMoodStore()
  const [generating, setGenerating]       = useState(false)
  const [done, setDone]                   = useState(false)

  if (!user) return null

  const todayInfo = getTodayInfo()

  const zone      = getZoneById(user.zone_id)
  const stats     = getZoneStats(user.zone_id)
  const rawTasks  = getTasksByZone(user.zone_id)
  const moodData  = getSummary(1)
  const today = todayLondon()

  const tasks = rawTasks.map((t) => {
    const v = getUserById(t.assigned_to)
    return { ...t, volunteerName: v?.name || null }
  })

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await generatePDF({
        zoneName:   zone?.name || 'CMZ',
        adminName:  user.name,
        dayNumber:  todayInfo?.day || 1,
        date:       today,
        hijriDate:  todayInfo ? todayInfo.hijri : '2nd Muharram 1448H',
        hijriArabic: todayInfo ? todayInfo.hijriArabic : 'مُحَرَّم ١٤٤٨',
        stats,
        tasks,
        moods: moodData,
      })
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Could not generate PDF. Please try again.')
    }
    setGenerating(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Preview card */}
      <div style={{
        background: 'var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        color: '#fff',
      }}>
        <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Daily report</p>
        <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: '4px 0 2px', fontFamily: 'var(--font-sans)' }}>
          {zone?.name || 'CMZ'}
        </p>
        <p style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
          {today}
        </p>
        {todayInfo && (
          <p style={{ fontSize: 'var(--text-xs)', opacity: 0.9, marginTop: 2, fontWeight: 600 }}>
            Day {todayInfo.day} · {todayInfo.hijri}
          </p>
        )}
      </div>

      {/* Stats preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-sm)' }}>
        {[
          { label: 'Total',    value: stats.total,      color: 'var(--color-text-primary)'  },
          { label: 'Done',     value: stats.done,        color: 'var(--color-done)'          },
          { label: 'Active',   value: stats.inProgress,  color: 'var(--color-progress)'      },
          { label: 'Pending',  value: stats.pending,     color: 'var(--color-high)'          },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm)', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* What's included */}
      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-sm)' }}>
          Report includes
        </p>
        {[
          '✅ All tasks with status and completion time',
          '👤 Volunteer name for each task',
          '📊 Zone completion summary',
          '😊 Volunteer mood summary',
          '📅 Date, day number and zone admin name',
        ].map((item) => (
          <p key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', padding: '5px 0', borderBottom: '0.5px solid var(--color-border)' }}>
            {item}
          </p>
        ))}
      </div>

      {/* Generate button */}
      {done ? (
        <div style={{ height: 52, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            PDF downloaded — send via WhatsApp
          </span>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            width: '100%', height: 52,
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: generating ? 'var(--color-border)' : 'var(--color-primary)',
            color: generating ? 'var(--color-text-secondary)' : '#fff',
            fontSize: 'var(--text-md)', fontWeight: 600,
            cursor: generating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {generating ? <>⏳ Generating PDF…</> : <>📄 Download Daily Report</>}
        </button>
      )}

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        Share the downloaded PDF with your admin on WhatsApp
      </p>
    </div>
  )
}