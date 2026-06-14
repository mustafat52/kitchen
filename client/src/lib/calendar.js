// Fatimi Calendar — Ashara 1448H London
// Day 1 = Tuesday 16th June 2026 = 2nd Muharram

const ARABIC_DAYS = [
  'الثاني',   // 2nd
  'الثالث',   // 3rd
  'الرابع',   // 4th
  'الخامس',   // 5th
  'السادس',   // 6th
  'السابع',   // 7th
  'الثامن',   // 8th
  'التاسع',   // 9th
  'العاشر',   // 10th
  'الحادي عشر', // 11th
]

const ARABIC_MUHARRAM = 'مُحَرَّم'

// Returns today's Ashara day number (1-10), or null if outside Ashara
export function getAsharaDay(date = new Date()) {
  const londonStr  = date.toLocaleString('en-GB', { timeZone: 'Europe/London' })
  const londonDate = new Date(londonStr)
  const start      = new Date('2026-06-16')
  const d          = new Date(londonDate.getFullYear(), londonDate.getMonth(), londonDate.getDate())
  const s          = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const diff       = Math.floor((d - s) / (1000 * 60 * 60 * 24))
  if (diff < 0 || diff > 9) return null
  return diff + 1
}

// Returns Hijri date — English
export function getHijriDate(dayNumber) {
  const hijriDay = dayNumber + 1
  return `${ordinal(hijriDay)} Muharram 1448H`
}

// Returns Hijri date — Arabic
export function getHijriDateArabic(dayNumber) {
  const arabicDay = ARABIC_DAYS[dayNumber - 1] || ''
  return `${arabicDay} ${ARABIC_MUHARRAM} ١٤٤٨`
}

// Returns Gregorian date string
export function getGregorianDate(dayNumber) {
  const date = new Date('2026-06-16')
  date.setDate(date.getDate() + (dayNumber - 1))
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

// Returns today's full info object
export function getTodayInfo() {
  const day = getAsharaDay()
  if (!day) return null
  return {
    day,
    hijri:        getHijriDate(day),
    hijriArabic:  getHijriDateArabic(day),
    gregorian:    getGregorianDate(day),
  }
}

function ordinal(n) {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n + (s[(v-20)%10] || s[v] || s[0])
}

export const ASHARA_DAYS = Array.from({ length: 10 }, (_, i) => ({
  day:          i + 1,
  hijri:        getHijriDate(i + 1),
  hijriArabic:  getHijriDateArabic(i + 1),
  gregorian:    getGregorianDate(i + 1),
}))