// All times displayed in Europe/London timezone

const LONDON_TZ = 'Europe/London'

export function formatTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    timeZone: LONDON_TZ,
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    timeZone: LONDON_TZ,
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', {
    timeZone: LONDON_TZ,
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export function todayLondon() {
  return new Date().toLocaleDateString('en-GB', {
    timeZone: LONDON_TZ,
    day: '2-digit', month: 'long', year: 'numeric',
  })
}