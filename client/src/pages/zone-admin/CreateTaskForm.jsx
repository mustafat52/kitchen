import { useState } from 'react'
import useTaskStore from '../../store/taskStore'
import useUserStore from '../../store/userStore'
import useAuthStore from '../../store/authStore'

const inputStyle = {
  width: '100%',
  height: 44,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  padding: '0 var(--space-md)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-primary)',
}

const labelStyle = {
  fontSize: 'var(--text-xs)',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  display: 'block',
  marginBottom: 'var(--space-xs)',
}

export default function CreateTaskForm({ onCreated }) {
  const { user } = useAuthStore()
  const { createTask } = useTaskStore()
  const { getVolunteersByZone, getActiveTemplates } = useUserStore()

  const [mode, setMode]           = useState('template') // 'template' | 'adhoc'
  const [templateId, setTemplateId] = useState('')
  const [title, setTitle]         = useState('')
  const [volunteerId, setVolunteerId] = useState('')
  const [priority, setPriority]   = useState('medium')
  const [notes, setNotes]         = useState('')
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const volunteers  = [
    ...(user ? [{ ...user, name: `${user.name} (me)` }] : []),
    ...getVolunteersByZone(user?.zone_id),
  ]
  const templates   = getActiveTemplates()

  const handleTemplateSelect = (e) => {
    const id = parseInt(e.target.value)
    setTemplateId(id)
    const tmpl = templates.find((t) => t.id === id)
    if (tmpl) {
      setTitle(tmpl.title)
      setPriority(tmpl.default_priority)
    }
  }

  const handleSubmit = () => {
    setError('')
    if (!title.trim()) return setError('Please enter a task description.')
    if (!volunteerId)  return setError('Please select a volunteer.')

    createTask({
      title:       title.trim(),
      zoneId:      user.zone_id,
      assignedTo:  parseInt(volunteerId),
      assignedBy:  user.id,
      priority,
      notes:       notes.trim() || null,
      templateId:  mode === 'template' && templateId ? templateId : null,
    })

    // Reset form
    setTitle('');  setVolunteerId(''); setNotes(''); setTemplateId('')
    setPriority('medium'); setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
    if (onCreated) onCreated()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* Mode toggle */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        padding: 3,
        border: '0.5px solid var(--color-border)',
      }}>
        {[['template', '📋 From template'], ['adhoc', '✏️ Custom task']].map(([m, label]) => (
          <button
            key={m}
            onClick={() => { setMode(m); setTitle(''); setTemplateId('') }}
            style={{
              height: 36,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === m ? 'var(--color-surface)' : 'transparent',
              color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: mode === m ? 600 : 400,
              cursor: 'pointer',
              boxShadow: mode === m ? 'var(--shadow-card)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Template picker */}
      {mode === 'template' && (
        <div>
          <label style={labelStyle}>Select template</label>
          <select
            value={templateId}
            onChange={handleTemplateSelect}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Choose a recurring task…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Task title */}
      <div>
        <label style={labelStyle}>Task description</label>
        <input
          style={inputStyle}
          placeholder={mode === 'adhoc' ? 'Describe the task…' : 'Auto-filled from template'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Volunteer + Priority row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
        <div>
          <label style={labelStyle}>Assign to</label>
          <select
            value={volunteerId}
            onChange={(e) => setVolunteerId(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select…</option>
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Note for volunteer <span style={{ fontWeight: 400 }}>(optional)</span></label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific instructions…"
          rows={2}
          style={{
            ...inputStyle,
            height: 'auto',
            padding: 'var(--space-sm) var(--space-md)',
            resize: 'none',
            lineHeight: 1.5,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-high)', marginTop: -8 }}>
          ⚠️ {error}
        </p>
      )}

      {/* Submit */}
      {success ? (
        <div style={{
          height: 48,
          background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-xs)',
        }}>
          <span>✅</span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            Task assigned!
          </span>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Assign task →
        </button>
      )}
    </div>
  )
}