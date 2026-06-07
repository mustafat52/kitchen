import { getAvatarColor } from '../data/users'

// size: 'sm' = 24px, 'md' = 32px, 'lg' = 40px, 'xl' = 48px
const sizeMap = {
  sm:  { width: 24, fontSize: 10 },
  md:  { width: 32, fontSize: 12 },
  lg:  { width: 40, fontSize: 15 },
  xl:  { width: 48, fontSize: 18 },
}

export default function Avatar({ user, size = 'md' }) {
  if (!user) return null
  const { width, fontSize } = sizeMap[size] || sizeMap.md
  const { bg, fg } = getAvatarColor(user.id)

  return (
    <div
      style={{
        width,
        height: width,
        borderRadius: '50%',
        background: bg,
        color: fg,
        fontSize,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        letterSpacing: '0.01em',
        userSelect: 'none',
      }}
      aria-label={user.name}
    >
      {user.initials}
    </div>
  )
}