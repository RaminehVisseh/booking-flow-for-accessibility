import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  Button,
  Heading,
  IconButton,
  PrimaryButton,
  TextInput,
  vars,
} from '@janeapp/burrito-design-system'

/* ─────────────────────────────────────────────────────────────────
 *  Date helpers
 * ───────────────────────────────────────────────────────────────── */

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function differenceInCalendarDays(a: Date, b: Date): number {
  const msPerDay = 86400000
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((utcA - utcB) / msPerDay)
}

const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getDayLabel(date: Date, today: Date): string {
  const diff = differenceInCalendarDays(date, today)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return WEEKDAYS[date.getDay()]
}

function getShortDate(date: Date, today: Date): string {
  const diff = differenceInCalendarDays(date, today)
  const mon = MONTHS[date.getMonth()]
  const day = date.getDate()
  if (diff <= 1) return `${WEEKDAYS[date.getDay()].slice(0, 3)}, ${mon} ${day}`
  return `${mon} ${day}`
}

function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/* ─────────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────────── */

interface DayOption {
  iso: string
  label: string
  shortDate: string
}

export interface BookingResult {
  patient: string
  treatmentLabel: string
  startHour: number
  endHour: number
  staff: string
}

interface PanelProps {
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
  onBook?: (result: BookingResult) => void
  initialStaff?: string
  initialTime?: string
  initialDateISO?: string
  availableUntil?: number
}

/* ─────────────────────────────────────────────────────────────────
 *  Focus trap
 * ───────────────────────────────────────────────────────────────── */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const el = containerRef.current
    if (!el) return

    function getFocusable() {
      return Array.from(el!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => !n.closest('[hidden]') && !n.closest('[aria-hidden="true"]')
      )
    }

    // Cycle focus on Tab / Shift+Tab
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.defaultPrevented) return
      const nodes = getFocusable()
      if (!nodes.length) return
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first || !el!.contains(document.activeElement)) {
          e.preventDefault(); last.focus()
        }
      } else {
        if (document.activeElement === last || !el!.contains(document.activeElement)) {
          e.preventDefault(); first.focus()
        }
      }
    }

    // Catch any focus that escapes the panel (e.g. from tabIndex=-1 heading)
    function handleFocusIn(e: FocusEvent) {
      if (!el!.contains(e.target as Node)) {
        const nodes = getFocusable()
        if (nodes.length) nodes[0].focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [active, containerRef])
}

/* ─────────────────────────────────────────────────────────────────
 *  ComboSelect — keyboard-friendly dropdown (Enter to select)
 * ───────────────────────────────────────────────────────────────── */

interface ComboOption { value: string; label: string }

function ComboSelect({
  id, label, placeholder, options, value, onChange, triggerRef,
}: {
  id: string
  label: string
  placeholder: string
  options: ComboOption[]
  value: string
  onChange: (v: string) => void
  triggerRef?: React.RefObject<HTMLButtonElement>
}) {
  const [open, setOpen]       = useState(false)
  const [cursor, setCursor]   = useState(-1)
  const ownBtnRef             = useRef<HTMLButtonElement>(null)
  const btnRef                = triggerRef ?? ownBtnRef
  const listRef               = useRef<HTMLUListElement>(null)
  const wrapRef               = useRef<HTMLDivElement>(null)
  const [listPos, setListPos] = useState<{top: number; left: number; width: number} | null>(null)
  const [focused, setFocused] = useState(false)
  const selectedLabel = options.find(o => o.value === value)?.label ?? ''

  // Move cursor focus into list item
  useEffect(() => {
    if (!open) return
    const items = listRef.current?.querySelectorAll<HTMLLIElement>('[role="option"]')
    if (items && cursor >= 0) items[cursor]?.focus()
  }, [open, cursor])

  function openList() {
    const idx = options.findIndex(o => o.value === value)
    setCursor(idx >= 0 ? idx : 0)
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setListPos({ top: r.bottom + 2, left: r.left, width: r.width })
    }
    setOpen(true)
  }

  function closeList() {
    setOpen(false)
    btnRef.current?.focus()
  }

  function select(v: string) {
    onChange(v)
    closeList()
  }

  function handleBtnKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault(); openList()
    }
  }

  function handleItemKeyDown(e: React.KeyboardEvent, v: string, idx: number) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(v) }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(Math.min(idx + 1, options.length - 1)) }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(Math.max(idx - 1, 0)) }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); closeList() }
  }

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '8px 12px',
    border: `2px solid ${(focused || open) ? vars.global.color.brand['60'] : '#ccc'}`,
    borderRadius: 4, background: '#fff', cursor: 'pointer',
    fontSize: 14, color: value ? '#222' : '#999',
    outline: 'none',
    boxShadow: (focused || open) ? `0 0 0 3px ${vars.global.color.brand['20']}` : 'none',
  }

  const listStyle: React.CSSProperties = {
    position: 'fixed',
    top: listPos?.top ?? 0,
    left: listPos?.left ?? 0,
    width: listPos?.width ?? 0,
    zIndex: 2000,
    background: '#fff', border: `1px solid ${vars.global.color.brand['60']}`,
    borderRadius: 4, padding: 0, listStyle: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: 220, overflowY: 'auto',
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }} id={id}>
      <button
        ref={btnRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        onClick={() => open ? closeList() : openList()}
        onKeyDown={handleBtnKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={btnStyle}
      >
        <span>{value ? selectedLabel : placeholder}</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.8"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
          <path d="M1 1l5 5 5-5"/>
        </svg>
      </button>

      {open && (
        <ul ref={listRef} id={`${id}-list`} role="listbox" aria-label={label} style={listStyle}>
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              tabIndex={-1}
              aria-selected={opt.value === value}
              onClick={() => select(opt.value)}
              onKeyDown={(e) => handleItemKeyDown(e, opt.value, idx)}
              style={{
                padding: '9px 14px', cursor: 'pointer', fontSize: 14,
                background: opt.value === value ? vars.global.color.brand['10']
                  : cursor === idx ? '#f5f5f5' : '#fff',
                color: opt.value === value ? vars.global.color.brand['70'] : '#222',
                fontWeight: opt.value === value ? 600 : 400,
                outline: 'none',
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Shared section styles
 * ───────────────────────────────────────────────────────────────── */

const DIVIDER: React.CSSProperties = {
  borderWidth: '1px 0 0 0',
  borderStyle: 'solid',
  borderColor: '#e8e8e8',
  margin: 0,
}

const SECTION: React.CSSProperties = {
  padding: '14px 16px',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  margin: 0,
}

const SUB_LABEL: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#444',
  margin: '0 0 4px',
}

/* ─────────────────────────────────────────────────────────────────
 *  Booked detail view (mimics Jane appointment panel)
 * ───────────────────────────────────────────────────────────────── */

const TREATMENT_LABELS: Record<string, string> = {
  '30-massage': '30 min Massage',
  '45-massage': '45 min Massage',
  '60-massage': '60 min Massage',
  '90-massage': '90 min Massage',
}
const TREATMENT_PRICES: Record<string, string> = {
  '30-massage': '$60.00',
  '45-massage': '$80.00',
  '60-massage': '$100.00',
  '90-massage': '$140.00',
}
const TIME_LABELS: Record<string, string> = {
  '09:00': '9:00 AM', '09:30': '9:30 AM', '10:00': '10:00 AM',
  '14:00': '2:00 PM', '14:30': '2:30 PM', '16:15': '4:15 PM', '16:30': '4:30 PM',
}
const TIME_DURATIONS: Record<string, number> = {
  '30-massage': 30, '45-massage': 45, '60-massage': 60, '90-massage': 90,
}

function addMinutesToTime(timeStr: string, mins: number): string {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + mins
  const endH = Math.floor(total / 60)
  const endM = total % 60
  const ampm = endH >= 12 ? 'PM' : 'AM'
  const displayH = endH > 12 ? endH - 12 : endH === 0 ? 12 : endH
  return `${displayH}:${String(endM).padStart(2, '0')} ${ampm}`
}

const BOOKED_PATIENT_DATA: Record<string, {
  email: string; home: string; mobile: string; dob: string;
  creditCard: boolean; accountOwing: string; accountCredit: string;
}> = {
  'Madison Barnaby':   { email: 'madison.barnaby@example.com',  home: '0061866812',     mobile: '(267) 181-4466', dob: 'September 12, 1974', creditCard: false, accountOwing: '$181.75', accountCredit: '$0.00' },
  'Marcus Gregory':    { email: 'marcus.gregory@example.com',   home: '+1 604 555 0132', mobile: '+1 604 555 9874', dob: 'March 4, 1988',       creditCard: true,  accountOwing: '$0.00',   accountCredit: '$0.00' },
  'Maya Chen':         { email: 'maya.chen@example.com',        home: '+1 778 555 3310', mobile: '+1 778 555 7612', dob: 'July 22, 1995',        creditCard: true,  accountOwing: '$20.00',  accountCredit: '$0.00' },
  'Zoe Gagnon':        { email: 'zoe.gagnon@example.com',       home: '+1 514 555 8801', mobile: '+1 514 555 2240', dob: 'November 3, 1990',     creditCard: false, accountOwing: '$0.00',   accountCredit: '$0.00' },
  'Aubrey French':     { email: 'aubrey.french@example.com',    home: '+1 416 555 4423', mobile: '+1 416 555 6690', dob: 'February 14, 1985',    creditCard: true,  accountOwing: '$0.00',   accountCredit: '$0.00' },
  'Eva Mackay':        { email: 'eva.mackay@example.com',       home: '+1 250 555 1193', mobile: '+1 250 555 7744', dob: 'August 9, 1978',       creditCard: false, accountOwing: '$0.00',   accountCredit: '$10.00' },
  'Beatrice Clark':    { email: 'beatrice.clark@example.com',   home: '+1 403 555 2281', mobile: '+1 403 555 5509', dob: 'April 27, 1967',       creditCard: true,  accountOwing: '$0.00',   accountCredit: '$0.00' },
}

const DEFAULT_PATIENT = { email: 'patient@example.com', home: '', mobile: '', dob: '', creditCard: false, accountOwing: '$0.00', accountCredit: '$0.00' }

function BookedDetail({ patient, treatment, selectedDate, time, staff, onClose }: {
  patient: string
  treatment: string
  selectedDate: DayOption | null
  time: string
  staff: string
  onClose: () => void
}) {
  const pd = BOOKED_PATIENT_DATA[patient] ?? DEFAULT_PATIENT
  const treatmentLabel = TREATMENT_LABELS[treatment] ?? treatment
  const treatmentPrice = TREATMENT_PRICES[treatment] ?? '$0.00'
  const startLabel = TIME_LABELS[time] ?? time
  const duration = TIME_DURATIONS[treatment] ?? 30
  const endLabel = time ? addMinutesToTime(time, duration) : ''

  const teal = vars.global.color.brand['70']
  const divider: React.CSSProperties = { borderWidth: '1px 0 0 0', borderStyle: 'solid', borderColor: '#e8e8e8', margin: 0 }

  const sectionLabel: React.CSSProperties = {
    fontSize: 16, fontWeight: 600, color: teal, padding: '14px 16px', cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  }
  const chevronUp = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={teal} strokeWidth="2" strokeLinecap="round"><polyline points="4 10 8 6 12 10"/></svg>

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f0f0', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ background: '#f0f0f0', padding: '16px 16px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Heading level={2} style={{ margin: 0, fontSize: 26, fontWeight: 300, color: '#222', lineHeight: 1.2 }}>Appointment</Heading>
        <button onClick={onClose} aria-label="Close" style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, width: 36, height: 36, cursor: 'pointer', fontSize: 16, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      {/* Action bar */}
      <div style={{ background: '#f0f0f0', padding: '0 16px 12px', display: 'flex', gap: 8 }}>
        <button style={{ padding: '7px 16px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333', fontWeight: 500 }}>Arrive</button>
        <button style={{ padding: '7px 16px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333', fontWeight: 500 }}>No Show</button>
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
          <button style={{ padding: '7px 16px', border: '1px solid #ccc', borderRadius: '6px 0 0 6px', background: '#fff', fontSize: 14, cursor: 'pointer', color: '#aaa', fontWeight: 500 }}>Pay</button>
          <button style={{ padding: '7px 10px', border: '1px solid #ccc', borderLeft: 'none', borderRadius: '0 6px 6px 0', background: '#fff', cursor: 'pointer', color: '#aaa' }}>▾</button>
        </div>
      </div>

      {/* Booking Info section */}
      <div style={{ background: '#fff', margin: '0 0 8px' }}>
        <div style={sectionLabel}>Booking Info {chevronUp}</div>
        <hr style={divider} />

        {/* Patient card */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: '#222' }}>{patient}</p>
          <p style={{ margin: '0 0 3px', fontSize: 13, color: '#444', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {pd.home && <span>🏠 {pd.home}</span>}
            {pd.mobile && <span>📱 {pd.mobile}</span>}
          </p>
          {pd.dob && <p style={{ margin: '0 0 3px', fontSize: 13, color: '#444' }}>🎁 {pd.dob}</p>}
          <p style={{ margin: '0 0 6px', fontSize: 13, color: teal }}>{pd.email}</p>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#444', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>💳</span>
            <span>{pd.creditCard ? 'Visa ending in 4242' : 'No credit card on file'}</span>
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333', marginBottom: 2 }}>
            <span>Account Owing</span><span>{pd.accountOwing}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333' }}>
            <span>Account Credit</span><span>{pd.accountCredit}</span>
          </div>
        </div>

        {/* Date/time/location */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 14, color: '#333', lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>{selectedDate ? `${selectedDate.label.replace('Today', 'Monday')} June 23, 2026` : 'June 23, 2026'}</p>
          <p style={{ margin: 0 }}>{startLabel}{endLabel ? ` - ${endLabel}` : ''}</p>
          <p style={{ margin: 0 }}>The Village</p>
        </div>

        {/* Treatment / staff */}
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 14, color: '#333', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>{treatmentLabel}</p>
            <p style={{ margin: 0 }}>({treatmentPrice})</p>
            <p style={{ margin: 0 }}>{staff}</p>
          </div>
          <button aria-label="Edit treatment" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>✏️</button>
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{ background: '#f0f0f0', padding: '4px 16px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button style={{ padding: '7px 14px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333' }}>Copy</button>
        <button style={{ padding: '7px 14px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333' }}>Move</button>
        <button style={{ padding: '7px 10px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333' }}>»</button>
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
          <button style={{ padding: '7px 14px', border: '1px solid #ccc', borderRadius: '6px 0 0 6px', background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333' }}>Cancel/Delete</button>
          <button style={{ padding: '7px 10px', border: '1px solid #ccc', borderLeft: 'none', borderRadius: '0 6px 6px 0', background: '#fff', cursor: 'pointer', color: '#333' }}>▾</button>
        </div>
      </div>

      {/* Collapsed sections */}
      {(['Notes', 'Billing Info', 'Insurance Info', 'Return Visit Reminders', 'History & Status'] as const).map(label => (
        <div key={label} style={{ background: '#fff', marginBottom: 4 }}>
          <div style={sectionLabel}>{label} {chevronUp}</div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Panel
 * ───────────────────────────────────────────────────────────────── */

export function NewAppointmentPanel({ onClose, triggerRef, onBook, initialStaff = '', initialTime = '', initialDateISO = '', availableUntil }: PanelProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = toISO(today)

  const next10Days: DayOption[] = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i)
    return { iso: toISO(d), label: getDayLabel(d, today), shortDate: getShortDate(d, today) }
  })

  const initialDayOption = initialDateISO
    ? next10Days.find(d => d.iso === initialDateISO) ?? null
    : null

  const [treatment,       setTreatment]       = useState('')
  const [patientQuery,    setPatientQuery]    = useState('')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedDate,    setSelectedDate]    = useState<DayOption | null>(initialDayOption)
  const [time,         setTime]         = useState(initialTime)
  const [staff,        setStaff]        = useState(initialStaff)
  const [notes,        setNotes]        = useState('')
  const [isCustomOpen,  setIsCustomOpen]  = useState(false)
  const [customDateVal, setCustomDateVal] = useState('')
  const [announcement,  setAnnouncement]  = useState('')
  const [booked,        setBooked]        = useState(false)

  const panelRef           = useRef<HTMLDivElement>(null)
  const headingRef         = useRef<HTMLHeadingElement>(null)
  const customDateInputRef = useRef<HTMLInputElement>(null)
  const dateListboxRef     = useRef<HTMLDivElement>(null)
  const bookBtnFooterRef   = useRef<HTMLButtonElement>(null)
  const cancelBtnRef       = useRef<HTMLButtonElement>(null)
  const notesRef           = useRef<HTMLTextAreaElement>(null)
  const timeComboRef       = useRef<HTMLButtonElement>(null)
  const treatmentComboRef  = useRef<HTMLButtonElement>(null)
  const patientInputRef    = useRef<HTMLInputElement>(null)
  const staffComboRef      = useRef<HTMLButtonElement>(null)

  // On open: if staff+date+time pre-filled → focus Treatment; otherwise focus Staff
  useLayoutEffect(() => {
    if (initialStaff && initialTime && initialDayOption) {
      setTimeout(() => treatmentComboRef.current?.focus(), 50)
    } else {
      setTimeout(() => staffComboRef.current?.focus(), 50)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Staff selected → focus Treatment
  const prevStaff = useRef(initialStaff)
  useEffect(() => {
    if (staff && !prevStaff.current) {
      setTimeout(() => treatmentComboRef.current?.focus(), 50)
    }
    prevStaff.current = staff
  }, [staff])

  // Treatment selected → focus Date (skip if pre-filled)
  const prevTreatment = useRef('')
  useEffect(() => {
    if (treatment && !prevTreatment.current) {
      if (!selectedDate) {
        setTimeout(() => dateListboxRef.current?.querySelector<HTMLElement>('[role="option"]')?.focus(), 50)
      } else if (!time) {
        setTimeout(() => timeComboRef.current?.focus(), 50)
      } else {
        setTimeout(() => patientInputRef.current?.focus(), 50)
      }
    }
    prevTreatment.current = treatment
  }, [treatment, selectedDate, time])

  // Time selected → focus Client
  const prevTime = useRef(initialTime)
  useEffect(() => {
    if (time && !prevTime.current) {
      setTimeout(() => patientInputRef.current?.focus(), 50)
    }
    prevTime.current = time
  }, [time])

  // Client selected → focus Notes
  const prevPatient = useRef('')
  useEffect(() => {
    if (selectedPatient && !prevPatient.current) {
      setTimeout(() => notesRef.current?.focus(), 50)
    }
    prevPatient.current = selectedPatient
  }, [selectedPatient])
  useEffect(() => { if (isCustomOpen) customDateInputRef.current?.focus() }, [isCustomOpen])
  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])
  useEffect(() => { return () => { triggerRef.current?.focus() } }, [triggerRef])
  useFocusTrap(panelRef, true)

  const selectDay = useCallback((day: DayOption) => {
    setSelectedDate(day)
    setIsCustomOpen(false)
    setAnnouncement(`${day.label} selected`)
    setTimeout(() => timeComboRef.current?.focus(), 50)
  }, [timeComboRef])

  const resetDate = useCallback(() => {
    setSelectedDate(null)
    setCustomDateVal('')
    setAnnouncement('')
  }, [])

  const confirmCustomDate = useCallback(() => {
    if (!customDateVal) return
    const d = fromISO(customDateVal)
    selectDay({ iso: customDateVal, label: getDayLabel(d, today), shortDate: getShortDate(d, today) })
  }, [customDateVal, today, selectDay])

  const MOCK_PATIENTS = [
    'Madison Barnaby', 'Marcus Gregory', 'Maya Chen', 'Michael Torres',
    'Zoe Gagnon', 'Aubrey French', 'Eva Mackay', 'Beatrice Clark',
    'Dylan Grewal', 'Samuel Clark', 'Owen Anderson', 'Lily Smith',
    'James Martin', 'Avery Chan', 'Thomas Chu', 'Nathan Addy',
    'Elizabeth Bélanger',
  ]

  const PATIENT_DATA: Record<string, { email: string; home: string; mobile: string; dob: string; upcoming: number; creditCard: boolean; lastVisit: string; balance: string; tags: string[] }> = {
    'Madison Barnaby':   { email: 'madison.barnaby@example.com', home: '+1 786 913 6558', mobile: '+1 410 690 5720', dob: 'September 12, 1974', upcoming: 55, creditCard: false, lastVisit: 'June 16, 2026 · Group Counselling with Maya Lopez-Chapman', balance: '$0.00', tags: ['1 No Show'] },
    'Marcus Gregory':    { email: 'marcus.gregory@example.com',  home: '+1 604 555 0132', mobile: '+1 604 555 9874', dob: 'March 4, 1988',       upcoming: 3,  creditCard: true,  lastVisit: 'June 10, 2026 · 60 min Massage with Amy Kendrick',             balance: '$0.00', tags: [] },
    'Maya Chen':         { email: 'maya.chen@example.com',       home: '+1 778 555 3310', mobile: '+1 778 555 7612', dob: 'July 22, 1995',        upcoming: 1,  creditCard: true,  lastVisit: 'May 30, 2026 · 45 min Massage with Michael Carroll',           balance: '-$20.00', tags: [] },
    'Zoe Gagnon':        { email: 'zoe.gagnon@example.com',      home: '+1 514 555 8801', mobile: '+1 514 555 2240', dob: 'November 3, 1990',     upcoming: 7,  creditCard: false, lastVisit: 'June 1, 2026 · 90 min Massage with Susan Lo',                  balance: '$0.00', tags: [] },
    'Aubrey French':     { email: 'aubrey.french@example.com',   home: '+1 416 555 4423', mobile: '+1 416 555 6690', dob: 'February 14, 1985',    upcoming: 2,  creditCard: true,  lastVisit: 'June 23, 2026 · 30 min Massage with Amy Kendrick',             balance: '$0.00', tags: [] },
    'Eva Mackay':        { email: 'eva.mackay@example.com',      home: '+1 250 555 1193', mobile: '+1 250 555 7744', dob: 'August 9, 1978',       upcoming: 4,  creditCard: false, lastVisit: 'June 23, 2026 · 30 min Massage with Marcus Gregory',           balance: '$10.00', tags: ['VIP'] },
    'Beatrice Clark':    { email: 'beatrice.clark@example.com',  home: '+1 403 555 2281', mobile: '+1 403 555 5509', dob: 'April 27, 1967',       upcoming: 12, creditCard: true,  lastVisit: 'June 23, 2026 · 30 min Massage with Marcus Gregory',           balance: '$0.00', tags: [] },
  }
  const patientMatches = patientQuery.length >= 2
    ? MOCK_PATIENTS.filter(n => n.toLowerCase().includes(patientQuery.toLowerCase()))
    : []

  const TREATMENT_META: Record<string, { label: string; duration: number }> = {
    '30-massage': { label: '30 min Massage', duration: 0.5 },
    '45-massage': { label: '45 min Massage', duration: 0.75 },
    '60-massage': { label: '60 min Massage', duration: 1.0 },
    '90-massage': { label: '90 min Massage', duration: 1.5 },
  }

  const TIME_TO_HOUR: Record<string, number> = {
    '09:00': 9.0, '09:30': 9.5, '10:00': 10.0,
    '14:00': 14.0, '14:30': 14.5, '16:15': 16.25, '16:30': 16.5,
  }

  const canBook = !!(treatment && selectedDate && time && staff)

  function confirmBooking() {
    if (!canBook) return
    const meta = TREATMENT_META[treatment]
    const startHour = TIME_TO_HOUR[time]
    onBook?.({
      patient: selectedPatient || 'New Patient',
      treatmentLabel: meta?.label ?? '30 min Massage',
      startHour,
      endHour: startHour + (meta?.duration ?? 0.5),
      staff,
    })
    setBooked(true)
  }

  const srOnly: React.CSSProperties = {
    position: 'absolute', width: 1, height: 1,
    overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap',
  }

  /* ─── Day listbox row ─── */
  function DayRow({ day }: { day: DayOption }) {
    const selected = selectedDate?.iso === day.iso
    return (
      <button
        id={`day-${day.iso}`}
        role="option"
        aria-selected={selected}
        onClick={() => selectDay(day)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '9px 0',
          background: selected ? vars.global.color.brand['10'] : 'none',
          border: 'none',
          borderBottom: '1px solid #f0f0f0',
          cursor: 'pointer',
          fontSize: 14,
          color: selected ? vars.global.color.brand['70'] : '#333',
          fontWeight: selected ? 600 : 400,
        }}
      >
        <span>{day.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#888', fontSize: 13 }}>{day.shortDate}</span>
          {selected && <span aria-hidden="true" style={{ color: vars.global.color.brand['60'] }}>✓</span>}
        </div>
      </button>
    )
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div aria-live="polite" aria-atomic="true" style={srOnly}>{announcement}</div>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-appt-title"
        style={{
          width: 340,
          height: '100%',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.14)',
          overflowY: 'auto',
        }}
      >
        {/* ── Booked confirmation — Appointment detail view ── */}
        {booked && <BookedDetail
          patient={selectedPatient || 'New Patient'}
          treatment={treatment}
          selectedDate={selectedDate}
          time={time}
          staff={staff}
          onClose={onClose}
        />}

        {/* ── Header ─────────────────────────────────────── */}
        {!booked && <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <Heading
              id="new-appt-title"
              level={2}
              tabIndex={-1}
              ref={headingRef}
              style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}
            >
              New Appointment
            </Heading>
            <IconButton aria-label="Close new appointment panel" onClick={onClose}>
              ✕
            </IconButton>
          </div>
          {/* Tab row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #e8e8e8' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#222', borderBottom: `2px solid ${vars.global.color.brand['60']}`, paddingBottom: 4 }}>
              Booking Info
            </span>
            <PrimaryButton disabled={!canBook} onClick={confirmBooking} style={{ fontSize: 13 }}>
              Book Appointment
            </PrimaryButton>
          </div>
        </div>}

        {/* ── Body ───────────────────────────────────────── */}
        {!booked && <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>

          {/* Staff Member */}
          <div style={SECTION}>
            <p style={SECTION_TITLE}>Staff Member</p>
            {staff ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#333' }}>{staff}</span>
                <button onClick={() => setStaff('')} aria-label="Change staff member"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: vars.global.color.brand['60'], fontSize: 13, padding: 0 }}>
                  Change
                </button>
              </div>
            ) : (
              <ComboSelect
                id="combo-staff"
                triggerRef={staffComboRef}
                label="Select a staff member"
                placeholder="Select a staff member..."
                value={staff}
                onChange={setStaff}
                options={[
                  { value: 'Amy Kendrick',       label: 'Amy Kendrick' },
                  { value: 'Jo-Ellen McKay',     label: 'Jo-Ellen McKay' },
                  { value: 'Marcus Gregory',     label: 'Marcus Gregory' },
                  { value: 'Michael Carroll',    label: 'Michael Carroll' },
                  { value: 'Maya Lopez-Chapman', label: 'Maya Lopez-Chapman' },
                  { value: 'Susan Lo',           label: 'Susan Lo' },
                ]}
              />
            )}
          </div>

          <hr style={DIVIDER} />

          {/* Session (Treatment) */}
          <div style={SECTION}>
            <p style={SECTION_TITLE}>Session</p>
            <ComboSelect
              id="combo-treatment"
              triggerRef={treatmentComboRef}
              label="Treatment"
              placeholder="Select a treatment..."
              value={treatment}
              onChange={setTreatment}
              options={(() => {
                const ALL_TREATMENTS = [
                  { value: '30-massage', label: '30 minute massage — $60', mins: 30 },
                  { value: '45-massage', label: '45 minute massage — $80', mins: 45 },
                  { value: '60-massage', label: '60 minute massage — $100', mins: 60 },
                  { value: '90-massage', label: '90 minute massage — $125', mins: 90 },
                ]
                if (availableUntil == null || !time) return ALL_TREATMENTS
                const [h, m] = time.split(':').map(Number)
                const startMins = h * 60 + m
                const endMins = Math.round(availableUntil * 60)
                const slotMins = endMins - startMins
                return ALL_TREATMENTS.filter(t => t.mins <= slotMins)
              })()}
            />
          </div>

          <hr style={DIVIDER} />

          {/* Date — accessible listbox */}
          <div style={SECTION}>
            <p style={SECTION_TITLE}>Date</p>


            {selectedDate ? (
              /* Confirmed state */
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: vars.global.color.brand['10'], border: `1px solid ${vars.global.color.brand['40']}`, borderRadius: 4, fontSize: 14 }}>
                <div role="status" aria-live="polite">
                  <strong>{selectedDate.label}</strong>
                  <span style={{ marginLeft: 8, color: '#777' }}>{selectedDate.shortDate}</span>
                </div>
                <button onClick={resetDate} aria-label="Change selected date"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: vars.global.color.brand['60'], fontSize: 13, padding: 0 }}>
                  Change
                </button>
              </div>
            ) : (
              /* Selection state */
              <>
                <div
                  ref={dateListboxRef}
                  role="listbox"
                  aria-label="Select appointment date"
                  aria-activedescendant={selectedDate ? `day-${(selectedDate as DayOption).iso}` : undefined}
                  tabIndex={-1}
                >
                  {next10Days.map((day) => <DayRow key={day.iso} day={day} />)}
                </div>
                <button
                  aria-expanded={isCustomOpen}
                  aria-controls="custom-date-section"
                  onClick={() => setIsCustomOpen((v) => !v)}
                  style={{
                    display: 'block', width: '100%', padding: '9px 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: vars.global.color.brand['60'], fontWeight: 500, fontSize: 14, textAlign: 'left',
                  }}
                >
                  Choose a specific date
                </button>

                <div id="custom-date-section" hidden={!isCustomOpen} aria-hidden={!isCustomOpen}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <TextInput
                    type="date"
                    name="custom-date"
                    aria-label="Enter a specific appointment date"
                    min={todayISO}
                    value={customDateVal}
                    onChange={(e) => setCustomDateVal(e.target.value)}
                    ref={customDateInputRef}
                  />
                  <PrimaryButton onClick={confirmCustomDate} disabled={!customDateVal}>
                    Confirm date
                  </PrimaryButton>
                </div>
              </>
            )}
          </div>

          <hr style={DIVIDER} />

          {/* Time */}
          <div style={SECTION}>
            <p style={SECTION_TITLE}>Time</p>
            <ComboSelect
              id="combo-time"
              triggerRef={timeComboRef}
              label="Select an available time slot"
              placeholder="Select a time..."
              value={time}
              onChange={setTime}
              options={[
                { value: '09:00', label: '9:00 AM' },
                { value: '09:30', label: '9:30 AM' },
                { value: '10:00', label: '10:00 AM' },
                { value: '10:30', label: '10:30 AM' },
                { value: '11:00', label: '11:00 AM' },
                { value: '11:30', label: '11:30 AM' },
                { value: '12:00', label: '12:00 PM' },
                { value: '12:30', label: '12:30 PM' },
                { value: '13:00', label: '1:00 PM' },
                { value: '13:30', label: '1:30 PM' },
                { value: '14:00', label: '2:00 PM' },
                { value: '14:30', label: '2:30 PM' },
                { value: '15:00', label: '3:00 PM' },
                { value: '15:30', label: '3:30 PM' },
                { value: '16:00', label: '4:00 PM' },
                { value: '16:30', label: '4:30 PM' },
                { value: '17:00', label: '5:00 PM' },
              ]}
            />
            {selectedDate && time && (
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                {selectedDate.shortDate} {
                  ({ '09:00': '9:00 AM – 9:30 AM', '09:30': '9:30 AM – 10:00 AM', '10:00': '10:00 AM – 10:30 AM',
                     '14:00': '2:00 PM – 2:30 PM', '14:30': '2:30 PM – 3:00 PM',
                     '16:15': '4:15 PM – 4:30 PM', '16:30': '4:30 PM – 5:00 PM' } as Record<string,string>)[time]
                }
              </p>
            )}
          </div>

          <hr style={DIVIDER} />

          {/* Client */}
          <div style={SECTION}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={SECTION_TITLE}>Client</p>
              <Button style={{ fontSize: 12, padding: '3px 10px' }}>New Client</Button>
            </div>
            <div>
              {selectedPatient ? (
                <div style={{ border: `1px solid ${vars.global.color.neutral['30']}`, borderRadius: 6, overflow: 'hidden', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: vars.global.color.brand['10'], borderBottom: `1px solid ${vars.global.color.neutral['20']}` }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#222' }}>{selectedPatient}</span>
                    <button onClick={() => { setSelectedPatient(''); setPatientQuery('') }} aria-label="Remove selected client"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: vars.global.color.brand['60'], fontSize: 13, padding: 0, lineHeight: 1 }}>✕</button>
                  </div>
                  {(() => {
                    const p = PATIENT_DATA[selectedPatient]
                    if (!p) return null
                    return (
                      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5, background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: vars.global.color.brand['60'] }}>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v.5H2V4zm0 2h12v7a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 3a.5.5 0 000 1h4a.5.5 0 000-1H6z"/></svg>
                          <span>{p.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#555' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2a1 1 0 011-1h2.5a1 1 0 01.95.684l.813 2.437a1 1 0 01-.23 1.041L6.97 6.22a8.001 8.001 0 004.81 4.81l1.058-1.063a1 1 0 011.041-.23l2.437.813A1 1 0 0117 11.5V14a1 1 0 01-1 1h-1C7.163 15 1 8.837 1 3V2a1 1 0 011-1h1z"/></svg>
                            {p.home}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M11 1a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V2a1 1 0 011-1h6zM5 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V2a2 2 0 00-2-2H5zm3 13.5a.5.5 0 100-1 .5.5 0 000 1z"/></svg>
                            {p.mobile}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#555' }}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM2 2a1 1 0 00-1 1v1h14V3a1 1 0 00-1-1H2zm13 3H1v9a1 1 0 001 1h12a1 1 0 001-1V5z"/></svg>
                          <span>{p.dob}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#555' }}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v1h14V4a1 1 0 00-1-1H2zm13 4H1v5a1 1 0 001 1h12a1 1 0 001-1V7zM2 10h2a1 1 0 010 2H2a1 1 0 010-2z"/></svg>
                          <span>{p.creditCard ? 'Visa ending in 4242' : 'No credit card on file'}</span>
                        </div>
                        <div style={{ paddingTop: 4, borderTop: `1px solid ${vars.global.color.neutral['20']}`, marginTop: 2, fontSize: 12, color: '#555' }}>
                          <span style={{ fontWeight: 700, color: '#333' }}>Last Visit </span>{p.lastVisit}
                        </div>
                        <div style={{ fontSize: 12, color: '#555' }}>
                          <span style={{ fontWeight: 700, color: '#333' }}>Account Balance </span>{p.balance}
                        </div>
                        {p.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                            {p.tags.map(tag => (
                              <span key={tag} style={{ background: '#F59E0B', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#999" strokeWidth="1.5"
                    style={{ position: 'absolute', left: 10, top: 10, pointerEvents: 'none' }}>
                    <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5L13 13"/>
                  </svg>
                  <TextInput
                    ref={patientInputRef}
                    type="search"
                    aria-label="Search for a client"
                    aria-autocomplete="list"
                    aria-controls={patientMatches.length > 0 ? 'patient-listbox' : undefined}
                    placeholder="Add Client..."
                    value={patientQuery}
                    onChange={(e) => setPatientQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && patientMatches.length === 1) {
                        e.preventDefault()
                        setSelectedPatient(patientMatches[0]); setPatientQuery('')
                      } else if (e.key === 'Enter' && patientMatches.length > 1) {
                        e.preventDefault()
                        document.querySelector<HTMLElement>('#patient-listbox [role="option"]')?.focus()
                      } else if (e.key === 'ArrowDown' && patientMatches.length) {
                        e.preventDefault()
                        document.querySelector<HTMLElement>('#patient-listbox [role="option"]')?.focus()
                      }
                    }}
                    style={{ paddingLeft: 30 }}
                  />
                  {patientMatches.length > 0 && (
                    <ul id="patient-listbox" role="listbox" aria-label="Client suggestions"
                      style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2000,
                        background: '#fff', border: `1px solid ${vars.global.color.brand['60']}`,
                        borderRadius: 4, marginTop: 2, padding: 0, listStyle: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: 200, overflowY: 'auto' }}>
                      {patientMatches.map((name, idx) => (
                        <li key={name} role="option" tabIndex={-1} aria-selected={false}
                          onClick={() => { setSelectedPatient(name); setPatientQuery('') }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPatient(name); setPatientQuery('') }
                            else if (e.key === 'ArrowDown') { e.preventDefault(); document.querySelectorAll<HTMLElement>('#patient-listbox [role="option"]')[idx + 1]?.focus() }
                            else if (e.key === 'ArrowUp')   { e.preventDefault(); idx === 0 ? document.querySelector<HTMLElement>('[aria-label="Search for a client"]')?.focus() : document.querySelectorAll<HTMLElement>('#patient-listbox [role="option"]')[idx - 1]?.focus() }
                            else if (e.key === 'Escape')    { setPatientQuery('') }
                          }}
                          style={{ padding: '9px 14px', cursor: 'pointer', fontSize: 14, color: '#222', outline: 'none' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                        >{name}</li>
                      ))}
                    </ul>
                  )}
                  {patientQuery.length >= 2 && patientMatches.length === 0 && (
                    <p style={{ fontSize: 13, color: '#999', fontStyle: 'italic', margin: '6px 0 0' }}>No clients found</p>
                  )}
                  {!patientQuery && (
                    <p style={{ fontSize: 13, color: '#999', fontStyle: 'italic', margin: '6px 0 0' }}>No client selected...</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <hr style={DIVIDER} />

          {/* Notes */}
          <div style={SECTION}>
            <p style={SECTION_TITLE}>Notes</p>
            <textarea
              ref={notesRef}
              aria-label="Appointment notes"
              placeholder="Add Note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Tab' && !e.shiftKey) {
                  e.preventDefault()
                  if (canBook) bookBtnFooterRef.current?.focus()
                  else cancelBtnRef.current?.focus()
                }
              }}
              rows={3}
              style={{
                width: '100%', resize: 'vertical',
                border: `1px solid ${vars.global.color.neutral['30']}`,
                borderRadius: 4, padding: '8px 10px',
                fontSize: 13, fontFamily: 'inherit',
                color: '#333', boxSizing: 'border-box',
              }}
            />
          </div>

        </div>}

        {/* ── Footer ─────────────────────────────────────── */}
        {!booked && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px', borderTop: '1px solid #e8e8e8', background: '#fff', flexShrink: 0 }}>
          <Button ref={cancelBtnRef} onClick={onClose}>Cancel</Button>
          <PrimaryButton
            ref={bookBtnFooterRef}
            aria-disabled={!canBook}
            onClick={confirmBooking}
            style={{ opacity: canBook ? 1 : 0.45, cursor: canBook ? 'pointer' : 'default' }}
          >Book Appointment</PrimaryButton>
        </div>}
      </div>
    </div>
  )
}
