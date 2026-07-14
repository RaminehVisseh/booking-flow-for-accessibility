import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Checkbox,
  CriticalButton,
  Fieldset,
  FormField,
  Heading,
  Modal,
  NumberInput,
  PrimaryButton,
  Radio,
  Select,
  Text,
  Toaster,
  showToast,
  useModal,
  vars,
} from '@janeapp/burrito-design-system'
import { JaneNavBar } from '../../jane-nav/src/components/JaneNavBar'
import { NewAppointmentPanel as AccessibleBookingPanel } from './NewAppointmentPanel'

/* ─────────────────────────────────────────────────────────────────
 *  Data
 * ───────────────────────────────────────────────────────────────── */

type StaffMember = {
  name: string
  initials: string
  discipline: string
  credentials?: string
  email: string
  username: string
  home: string
  mobile: string
  address: string[]
  bio: string
  photo?: string
}

const STAFF: StaffMember[] = [
  {
    name: 'Michael Carroll', initials: 'MC', discipline: 'Naturopathic Medicine', credentials: 'BSc, ND',
    email: 'michael.carroll@jane.clinic', username: 'naturopath',
    home: '+1 515 203 2105', mobile: '+1 718 896 4901',
    address: ['25238 Nitzsche Meadow', 'Whitehorse NB M6N 8K7', 'CA'],
    bio: 'Dr. Michael Carroll first brought naturopathy to the clinic after earning his Doctorate of Naturopathic Medicine in 2006. He also holds a Bachelor of Science degree in both pre-medical science and env...',
  },
  {
    name: 'Marcus Gregory', initials: 'MG', discipline: 'Chiropractic', credentials: 'DC',
    email: 'marcus.gregory@jane.clinic', username: 'chiropractor',
    home: '+1 604 555 0142', mobile: '+1 778 555 0188',
    address: ['1450 Robson Street', 'Vancouver BC V6E 1C1', 'CA'],
    bio: 'Dr. Marcus Gregory has been practicing chiropractic for over 12 years, with a focus on sports injuries and rehabilitation.',
  },
  {
    name: 'Amy Kendrick', initials: 'AK', discipline: 'Massage Therapy', credentials: 'RMT',
    email: 'amy.kendrick@jane.clinic', username: 'rmt-amy',
    home: '+1 250 555 0177', mobile: '+1 250 555 0123',
    address: ['88 Lonsdale Avenue', 'North Vancouver BC V7M 2E6', 'CA'],
    bio: 'Amy is a Registered Massage Therapist with 8 years of experience treating chronic pain, sports injuries, and pregnancy-related discomfort.',
  },
  {
    name: 'April Kennedy', initials: 'AK', discipline: 'Physiotherapy', credentials: 'PT',
    email: 'april.kennedy@jane.clinic', username: 'pt-april',
    home: '+1 403 555 0192', mobile: '+1 587 555 0144',
    address: ['12 Riverbend Way', 'Calgary AB T2C 4M1', 'CA'],
    bio: 'April is a Physiotherapist focused on post-surgical rehab and orthopedic conditions.',
  },
  {
    name: 'Susan Lo', initials: 'SL', discipline: 'Massage Therapy', credentials: 'RMT',
    email: 'susan.lo@gmail.com', username: 'therapist',
    home: '(376) 051-4691', mobile: '(095) 936-8772',
    address: ['527 Streich Alley', 'Erin ON R5S 9S4', 'CA'],
    bio: 'Susan graduated in 2009, and has a special interest in the the treatment of headaches, sports injuries and maintenance, and lower back pain. She believes in using evidence-based treatment and encourag...',
    photo: '/susan-lo.jpg',
  },
  {
    name: 'Maya Lopez-Chapman', initials: 'ML', discipline: 'Counselling / Psychology', credentials: 'MA, RCC',
    email: 'maya.lopez-chapman@jane.clinic', username: 'counsellor',
    home: '+1 604 555 0166', mobile: '+1 778 555 0199',
    address: ['2110 Granville Street', 'Vancouver BC V6H 3E6', 'CA'],
    bio: 'Maya is a Registered Clinical Counsellor offering individual therapy and couples counselling.',
  },
  {
    name: 'Jo-Ellen McKay', initials: 'JM', discipline: 'Physiotherapy / Clinical Pilates', credentials: 'PT',
    email: 'joellen.mckay@jane.clinic', username: 'pt-joellen',
    home: '+1 416 555 0133', mobile: '+1 647 555 0177',
    address: ['350 Bay Street', 'Toronto ON M5H 2S6', 'CA'],
    bio: 'Jo-Ellen combines physiotherapy and Clinical Pilates for rehab and movement re-education.',
  },
  {
    name: 'Jonathan Morris', initials: 'JM', discipline: 'Acupuncture / Physiotherapy', credentials: 'PT, R.Ac',
    email: 'jonathan.morris@jane.clinic', username: 'pt-jonathan',
    home: '+1 902 555 0145', mobile: '+1 902 555 0198',
    address: ['44 Spring Garden Road', 'Halifax NS B3J 3R8', 'CA'],
    bio: 'Jonathan integrates acupuncture into physiotherapy treatment for pain and recovery.',
  },
  {
    name: 'Helen Rosewood', initials: 'HR', discipline: 'Counselling / Psychology', credentials: 'PhD, RCC',
    email: 'helen.rosewood@jane.clinic', username: 'psychologist',
    home: '+1 604 555 0121', mobile: '+1 778 555 0166',
    address: ['1199 W Pender Street', 'Vancouver BC V6E 2R1', 'CA'],
    bio: 'Dr. Rosewood is a Registered Clinical Counsellor with a doctorate in psychology, specializing in anxiety and trauma.',
  },
  {
    name: 'Zoey Swift', initials: 'ZS', discipline: 'Acupuncture / Massage Therapy', credentials: 'R.Ac, RMT',
    email: 'zoey.swift@jane.clinic', username: 'racrmt',
    home: '+1 250 555 0188', mobile: '+1 250 555 0144',
    address: ['101 Yates Street', 'Victoria BC V8W 1L4', 'CA'],
    bio: 'Zoey is a dual-licensed Acupuncturist and RMT focused on integrated bodywork.',
  },
  {
    name: 'Frank Warren', initials: 'FW', discipline: 'Physiotherapy', credentials: 'PT',
    email: 'frank.warren@jane.clinic', username: 'pt-frank',
    home: '+1 780 555 0192', mobile: '+1 780 555 0123',
    address: ['10222 Jasper Avenue', 'Edmonton AB T5J 5K4', 'CA'],
    bio: 'Frank is a Physiotherapist with a focus on geriatric rehab and balance training.',
  },
]

const getStaff = (name: string): StaffMember =>
  STAFF.find(s => s.name === name) ?? STAFF[0]

const NAV_ITEMS = [
  { label: 'Day' },
  { label: 'Schedule' },
  { label: 'Patients' },
  { label: 'Staff' },
  { label: 'Billing' },
  { label: 'Reports' },
  { label: 'Settings' },
]

const PROFILE_TABS = [
  'Profile', 'Edit/Settings', 'Treatments, Classes & Group Appointments',
  'Templates', 'AI Scribe', 'Charts', 'Communications', 'Tasks', 'Phrases', 'Billing', 'Timesheets',
]

const EDIT_TABS = [
  'Personal Info', 'Photo & Bio', 'Settings', 'Online Booking', 'Permissions & Commissions',
]

const HOUR_START = 12
const HOUR_END = 19
const ROW_HEIGHT = 80
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i)

const TREATMENTS = [
  { id: '30-min-massage', label: '30 Minute Massage', duration: 0.5 },
  { id: '45-min-massage', label: '45 Minute Massage', duration: 0.75 },
  { id: '60-min-massage', label: '60 Minute Massage', duration: 1.0 },
  { id: '90-min-massage', label: '90 Minute Massage', duration: 1.5 },
]

const PATIENTS = [
  { name: 'Madison Barnaby', detail: 'F · DOB 1991-03-12' },
  { name: 'Avery Chan',      detail: 'F · DOB 1988-07-04' },
  { name: 'Aubrey French',   detail: 'F · DOB 1995-11-23' },
  { name: 'Lily Smith',      detail: 'F · DOB 1990-02-09' },
  { name: 'James Martin',    detail: 'M · DOB 1982-05-18' },
  { name: 'Owen Anderson',   detail: 'M · DOB 1985-09-27' },
]

type Page = 'profile' | 'edit' | 'schedule' | 'booking-site' | 'booking-appointment' | 'exploration4'

type BookingTarget = { staff: StaffMember; locationName: string; locationArea: string }

/* ─────────────────────────────────────────────────────────────────
 *  App
 * ───────────────────────────────────────────────────────────────── */

export function App() {
  const isMobile = useNarrowScreen(768)
  const [page, setPage] = useState<Page>('schedule')
  const [activeStaff, setActiveStaff] = useState<string>('Susan Lo')
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null)
  const [limitMode, setLimitMode] = useState<'no-limit' | 'set-limit'>('no-limit')
  const [limitValue, setLimitValue] = useState('')
  const [showIndicator, setShowIndicator] = useState(true)
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true)
  const [rollingAvailability, setRollingAvailability] = useState('no-limit')
  const [startTimes, setStartTimes] = useState('sequentially')
  const [clustering, setClustering] = useState('no-clustering')

  // The booking-limit feature is only modeled for Susan Lo (the demo target).
  // When viewing other staff, hide the limit form & treat their cap as null.
  const isSusan = activeStaff === 'Susan Lo'

  // Reset the limit form to "No Limit" each time the user opens the Edit page,
  // so prior session clicks don't leak across.
  React.useEffect(() => {
    if (page === 'edit') {
      setLimitMode('no-limit')
      setLimitValue('')
    }
  }, [page])

  const handleSave = () => {
    const n = limitMode === 'set-limit' ? (limitValue || '0') : null
    setPage('profile')
    showToast({
      content: n != null
        ? `Daily booking limit for ${activeStaff} updated to ${n} appointments.`
        : `Daily booking limit removed for ${activeStaff}.`,
      tone: 'success',
      isDismissible: true,
      timeout: 5000,
    })
  }

  const handleNavClick = (label: string) => {
    if (label === 'Schedule') setPage('schedule')
    else if (label === 'Day') setPage('exploration4')
    else if (label === 'Staff') {
      setActiveStaff('Michael Carroll')
      setPage('profile')
    }
  }

  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false)

  const handleAccountMenuClick = (label: string) => {
    if (label === 'Online Booking Site') setPage('booking-site')
    if (label === 'Keyboard Shortcuts') {
      console.log('opening shortcuts modal')
      setShortcutsModalOpen(true)
    }
  }

  const handleStaffClick = (name: string) => {
    setActiveStaff(name)
    setPage('profile')
  }

  const activeNav = page === 'schedule' ? 'Schedule' : page === 'exploration4' ? 'Day' : 'Staff'
  const cap = limitMode === 'set-limit' ? Number(limitValue) : null

  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f4', display: 'flex', flexDirection: 'column' }}>
      {!(isMobile && page === 'schedule') && page !== 'booking-site' && page !== 'booking-appointment' && (
        <JaneNavBar
          activeNav={activeNav}
          navItems={NAV_ITEMS}
          onNavClick={handleNavClick}
          onAccountMenuClick={handleAccountMenuClick}
        />
      )}
      {page === 'schedule' && (
        <nav aria-label="Skip links">
          <a
            href="#schedule-main"
            onClick={(e) => { e.preventDefault(); document.getElementById('schedule-main')?.focus() }}
            style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
            onFocus={(e) => { Object.assign(e.currentTarget.style, { left: '50%', transform: 'translateX(-50%)', top: '64px', width: 'auto', height: 'auto', overflow: 'visible', background: '#fff', padding: '8px 16px', border: '2px solid #0d6e6e', borderRadius: 4, zIndex: 9999, fontSize: 14, fontWeight: 600, color: '#0d6e6e', textDecoration: 'none' }) }}
            onBlur={(e) => { Object.assign(e.currentTarget.style, { left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden', transform: '' }) }}
          >
            Skip to schedule
          </a>
          <a
            href="#patient-search-input"
            onClick={(e) => { e.preventDefault(); document.getElementById('patient-search-input')?.focus() }}
            style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
            onFocus={(e) => { Object.assign(e.currentTarget.style, { left: '50%', transform: 'translateX(-50%)', top: '64px', width: 'auto', height: 'auto', overflow: 'visible', background: '#fff', padding: '8px 16px', border: '2px solid #0d6e6e', borderRadius: 4, zIndex: 9999, fontSize: 14, fontWeight: 600, color: '#0d6e6e', textDecoration: 'none' }) }}
            onBlur={(e) => { Object.assign(e.currentTarget.style, { left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden', transform: '' }) }}
          >
            Skip to patient search
          </a>
        </nav>
      )}
      <Toaster zIndex={2000} />
      {shortcutsModalOpen && <KeyboardShortcutsModal onClose={() => setShortcutsModalOpen(false)} />}

      {page === 'booking-site'
        ? <OnlineBookingSite
            onBack={() => setPage('profile')}
            onSelectPractitioner={(target) => { setBookingTarget(target); setPage('booking-appointment') }}
            onJaneClick={() => setPage('schedule')}
          />
        : page === 'booking-appointment' && bookingTarget
        ? <BookingAppointmentPage
            target={bookingTarget}
            onBack={() => setPage('booking-site')}
            onAccount={() => setPage('profile')}
            onJaneClick={() => setPage('schedule')}
          />
        : page === 'exploration4'
        ? <Exploration4Page />
        : page === 'schedule'
        ? <SchedulePage cap={cap} showIndicator={showIndicator} shortcutsModalOpen={shortcutsModalOpen} setShortcutsModalOpen={setShortcutsModalOpen} />
        : (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <StaffSidebar activeStaff={activeStaff} onStaffClick={handleStaffClick} />
            {page === 'profile'
              ? <ProfilePage staff={getStaff(activeStaff)} onEdit={() => setPage('edit')} dailyLimit={isSusan ? cap : null} />
              : <EditPage
                  staff={getStaff(activeStaff)}
                  onSave={handleSave}
                  onCancel={() => setPage('profile')}
                  onlineBookingEnabled={onlineBookingEnabled}
                  setOnlineBookingEnabled={setOnlineBookingEnabled}
                  limitMode={limitMode}
                  setLimitMode={setLimitMode}
                  limitValue={limitValue}
                  setLimitValue={setLimitValue}
                  rollingAvailability={rollingAvailability}
                  setRollingAvailability={setRollingAvailability}
                  startTimes={startTimes}
                  setStartTimes={setStartTimes}
                  clustering={clustering}
                  setClustering={setClustering}
                  showIndicator={showIndicator}
                  setShowIndicator={setShowIndicator}
                />
            }
          </div>
        )
      }
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Avatar
 * ───────────────────────────────────────────────────────────────── */

function Avatar({ initials, size = 32, color }: { initials: string; size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color ?? 'linear-gradient(135deg, #C9D7DF, #A4B7C2)',
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Left sidebar — Staff list
 * ───────────────────────────────────────────────────────────────── */

function StaffSidebar({ activeStaff, onStaffClick }: { activeStaff: string; onStaffClick: (name: string) => void }) {
  return (
    <aside style={{
      width: 240, background: 'white', borderRight: '1px solid #e2e2e2',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f5f5f5', borderRadius: 4, padding: '7px 10px',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#999" strokeWidth="1.5">
            <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5L13 13"/>
          </svg>
          <input
            placeholder="Staff Search..."
            style={{ border: 'none', background: 'transparent', fontSize: 13, flex: 1, fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ textAlign: 'center', padding: '10px 0 4px', fontSize: 13, color: '#444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          All Staff
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="#666" strokeWidth="1.5"><path d="M1 1l3 3 3-3"/></svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {STAFF.map(s => {
          const isActive = s.name === activeStaff
          const [first, ...rest] = s.name.split(' ')
          const last = rest.join(' ')
          return (
            <div
              key={s.name}
              onClick={() => onStaffClick(s.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                background: isActive ? '#d6ecec' : 'transparent', cursor: 'pointer',
                borderBottom: '1px solid #f3f3f3',
              }}
            >
              <Avatar initials={s.initials} size={28} />
              <Text size="sm" style={{ flex: 1 }}>{first} <strong>{last}</strong></Text>
              {isActive && (
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#bbb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>+</div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
        <Button>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: vars.global.color.brand['70'], color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, lineHeight: 1 }}>+</span>
            New Staff Member
          </span>
        </Button>
      </div>
    </aside>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  PROFILE PAGE
 * ───────────────────────────────────────────────────────────────── */

function ProfilePage({ staff, onEdit, dailyLimit }: { staff: StaffMember; onEdit: () => void; dailyLimit: number | null }) {
  return (
    <main style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Avatar initials={staff.initials} size={36} />
        <Heading level={1} style={{ margin: 0 }}>{staff.name}</Heading>
      </div>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <ProfileTab active>Profile</ProfileTab>
        {PROFILE_TABS.slice(1).map(t => (
          <ProfileTab key={t} onClick={t === 'Edit/Settings' ? onEdit : undefined}>{t}</ProfileTab>
        ))}
        <button style={{
          marginLeft: 'auto', background: '#e0e0e0', border: 'none', borderRadius: 4,
          width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="#666" fill="none" strokeWidth="1.5"><path d="M2 8l4-4 4 4"/></svg>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <Card>
            <ProfileRow label="Name">
              <Text size="sm">{staff.name}{staff.credentials ? ` ${staff.credentials}` : ''}</Text>
            </ProfileRow>
            <ProfileRow label="Discipline">
              <Text size="sm">{staff.discipline}</Text>
            </ProfileRow>
            <ProfileRow label="Email">
              <a href="#" style={{ color: vars.global.color.brand['70'], textDecoration: 'none' }}>{staff.email}</a>
              <Pill text="Do Not Email" tone="grey" />
            </ProfileRow>
            <ProfileRow label="Username / Logins">
              <Pill text={`Username: ${staff.username}`} tone="green" />
            </ProfileRow>
            <ProfileRow label="2-Step Verification">
              <Pill text="Inactive" tone="yellow" />
              <HelpIcon />
            </ProfileRow>
            <ProfileRow label="Home" icon={<HomeIcon />}>
              <Text size="sm">{staff.home}</Text>
            </ProfileRow>
            <ProfileRow label="Mobile" icon={<MobileIcon />}>
              <Text size="sm">{staff.mobile}</Text>
            </ProfileRow>
            <ProfileRow label="Address">
              <div>
                {staff.address.map((line, i) => (
                  <Text key={i} size="sm" style={{ display: 'block' }}>{line}</Text>
                ))}
              </div>
            </ProfileRow>
            <ProfileRow label="Bio">
              <Text size="sm">{staff.bio}</Text>
            </ProfileRow>

            <div style={{ display: 'flex', gap: 8, padding: 14, borderTop: '1px solid #eee', background: '#fafafa' }}>
              <Button>Manage Shifts</Button>
              <Button>View Schedule</Button>
              <Button>View Day Sheet</Button>
              <div style={{ flex: 1 }} />
              <Button onClick={onEdit}>Edit Profile</Button>
            </div>
          </Card>

          <Heading level={2} style={{ margin: '24px 0 12px' }}>Calendars</Heading>

          <Card>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <GoogleCalendarIcon />
                <Heading level={3} style={{ margin: 0 }}>Google Calendar in Jane</Heading>
              </div>
              <Text size="sm" style={{ color: '#555', display: 'block', marginBottom: 12 }}>
                Creating a connection to your Google calendar lets you view your calendar events within Jane on the Day and Schedule views.
              </Text>
              <Button>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ExternalLinkIcon /> Connect to Google Calendar
                </span>
              </Button>
              <div style={{ marginTop: 12 }}>
                <a href="#" style={{ color: vars.global.color.brand['70'], fontSize: 13, textDecoration: 'none' }}>
                  Learn what you can do with Google Calendar
                </a>
              </div>
            </div>
          </Card>

          <div style={{ marginTop: 12 }}>
            <Card>
              <div style={{ padding: 16 }}>
                <Heading level={3} style={{ margin: '0 0 8px' }}>Calendar subscription feeds</Heading>
                <Text size="sm" style={{ color: '#555', display: 'block', marginBottom: 12 }}>
                  View your appointments and shifts in any calendar software by subscribing to your calendar feeds.
                </Text>
                <Button>Create calendar feeds</Button>
                <div style={{ marginTop: 12 }}>
                  <a href="#" style={{ color: vars.global.color.brand['70'], fontSize: 13, textDecoration: 'none' }}>
                    Consent and help information ▾
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text size="sm" style={{ flex: 1 }}>Send Welcome Email</Text>
              <Button>Add A Note</Button>
            </div>
          </Card>

          <Card>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Heading level={3} style={{ margin: 0, flex: 1 }}>Supervision</Heading>
                <Pill text="New" tone="yellow" />
              </div>
              <Text size="sm" style={{ display: 'block', marginBottom: 8 }}>
                You are supervising 1 staff member.
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar initials="ZS" size={24} />
                <Text size="sm">Zoey Swift</Text>
              </div>
            </div>
          </Card>

          {dailyLimit != null && (
            <Card>
              <div style={{ padding: 14 }}>
                <Heading level={3} style={{ margin: '0 0 6px' }}>Online Booking</Heading>
                <Text size="sm" style={{ display: 'block', color: '#555' }}>
                  Daily booking limit: <strong>{dailyLimit} appointments</strong>
                </Text>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  EDIT PAGE — Online Booking tab
 * ───────────────────────────────────────────────────────────────── */

function EditPage({
  staff,
  onSave, onCancel,
  onlineBookingEnabled, setOnlineBookingEnabled,
  limitMode, setLimitMode,
  limitValue, setLimitValue,
  rollingAvailability, setRollingAvailability,
  startTimes, setStartTimes,
  clustering, setClustering,
  showIndicator, setShowIndicator,
}: {
  staff: StaffMember
  onSave: () => void; onCancel: () => void
  onlineBookingEnabled: boolean; setOnlineBookingEnabled: (v: boolean) => void
  limitMode: 'no-limit' | 'set-limit'; setLimitMode: (v: 'no-limit' | 'set-limit') => void
  limitValue: string; setLimitValue: (v: string) => void
  rollingAvailability: string; setRollingAvailability: (v: string) => void
  startTimes: string; setStartTimes: (v: string) => void
  clustering: string; setClustering: (v: string) => void
  showIndicator: boolean; setShowIndicator: (v: boolean) => void
}) {
  return (
    <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <Heading level={1} style={{ margin: '0 0 16px' }}>Edit Staff Member - {staff.name}</Heading>

        <Card>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #eee', display: 'flex' }}>
            {EDIT_TABS.map(t => <EditTab key={t} active={t === 'Online Booking'}>{t}</EditTab>)}
          </div>

          <div style={{ padding: 24, maxWidth: 640 }}>
            <Heading level={2} style={{ margin: '0 0 16px' }}>Online Booking</Heading>

            <div style={{ marginBottom: 24 }}>
              <Checkbox
                checked={onlineBookingEnabled}
                onChange={(e) => setOnlineBookingEnabled(e.target.checked)}
              >
                Enable Online Booking
              </Checkbox>
            </div>

            <FormField.Label>Daily Booking Limit</FormField.Label>
            <FormField.HelperText>
              Limit how many appointments this practitioner takes per day. Once the limit is reached, patients won't see any available times online. Appointments can still be added directly from the schedule.
            </FormField.HelperText>

            <Fieldset>
              <FormField>
                <Radio
                  name="limit-mode"
                  value="no-limit"
                  checked={limitMode === 'no-limit'}
                  onChange={(e) => setLimitMode(e.target.value as 'no-limit' | 'set-limit')}
                >
                  No Limit
                </Radio>
              </FormField>
              <FormField>
                <Radio
                  name="limit-mode"
                  value="set-limit"
                  checked={limitMode === 'set-limit'}
                  onChange={(e) => setLimitMode(e.target.value as 'no-limit' | 'set-limit')}
                >
                  Set a Limit
                </Radio>
              </FormField>
            </Fieldset>

            {limitMode === 'set-limit' && (
              <div style={{ marginTop: 16, maxWidth: 360 }}>
                <FormField>
                  <FormField.Label>Appointments Bookable Online Per Day</FormField.Label>
                  <NumberInput
                    value={limitValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLimitValue(e.target.value)}
                    min={0}
                    required
                    placeholder="e.g. 6"
                  />
                </FormField>
                <div style={{ marginTop: 16 }}>
                  <Checkbox
                    checked={showIndicator}
                    onChange={(e) => setShowIndicator(e.target.checked)}
                  >
                    Show booking count on schedule
                  </Checkbox>
                  <FormField.HelperText style={{ marginTop: 4 }}>
                    Shows a count of booked appointments (e.g. 4/6)
                  </FormField.HelperText>
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, maxWidth: 360 }}>
              <FormField>
                <FormField.Label>Online Rolling Availability</FormField.Label>
                <Select
                  value={rollingAvailability}
                  onChange={(e) => setRollingAvailability(e.target.value)}
                >
                  <Select.Option value="no-limit">No Limit</Select.Option>
                  <Select.Option value="2-weeks">2 Weeks</Select.Option>
                  <Select.Option value="4-weeks">4 Weeks</Select.Option>
                </Select>
              </FormField>
            </div>

            <div style={{ marginTop: 24, maxWidth: 360 }}>
              <FormField>
                <FormField.Label>Online Booking Start Times</FormField.Label>
                <FormField.HelperText>
                  Choose how Jane will offer start times in Online Booking. Default is sequentially.
                </FormField.HelperText>
                <Select
                  value={startTimes}
                  onChange={(e) => setStartTimes(e.target.value)}
                >
                  <Select.Option value="sequentially">Sequentially</Select.Option>
                  <Select.Option value="shortest">Based on My Shortest Session</Select.Option>
                </Select>
              </FormField>
            </div>

            <div style={{ marginTop: 24, maxWidth: 360 }}>
              <FormField>
                <FormField.Label>Cluster Online Bookings</FormField.Label>
                <FormField.HelperText>
                  Allow bookings any time within your shift or only adjacent to existing bookings.
                </FormField.HelperText>
                <Select
                  value={clustering}
                  onChange={(e) => setClustering(e.target.value)}
                >
                  <Select.Option value="no-clustering">Display all availability (No Clustering)</Select.Option>
                  <Select.Option value="cluster">Cluster bookings together</Select.Option>
                </Select>
              </FormField>
            </div>
          </div>
        </Card>

        <div style={{ height: 80 }} />
      </div>

      <div style={{
        position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #e2e2e2',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <CriticalButton>Delete Staff Member</CriticalButton>
        <div style={{ flex: 1 }} />
        <Button onClick={onCancel}>Cancel</Button>
        <PrimaryButton onClick={onSave}>Save</PrimaryButton>
      </div>
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  SCHEDULE PAGE
 * ───────────────────────────────────────────────────────────────── */

type Appt = {
  startHour: number
  endHour: number
  patient: string
  treatment: string
  insurance?: string
  color?: 'teal' | 'darkTeal' | 'green'
}

type Practitioner = {
  name: string
  initials: string
  discipline: string
  cap: number | null
  booked: number
  waitlist: number
  appts: Appt[]
}

function SchedulePage({ cap, showIndicator, shortcutsModalOpen, setShortcutsModalOpen }: { cap: number | null; showIndicator: boolean; shortcutsModalOpen: boolean; setShortcutsModalOpen: (v: boolean) => void }) {
  const isMobile = useNarrowScreen(768)
  const susanCap = cap && cap > 0 ? cap : 6

  const [susanAppts, setSusanAppts] = useState<Appt[]>([
    { startHour: 12.0, endHour: 13.5, patient: 'Zoe Gagnon', treatment: '90 Minute Massage', insurance: 'Pacific Blue Cross (Paper)', color: 'teal' },
    { startHour: 13.5, endHour: 14.0, patient: 'Aubrey French', treatment: '30 Minute Massage', color: 'teal' },
    { startHour: 14.0, endHour: 14.5, patient: 'Eva Mackay', treatment: '30 Minute Massage', insurance: 'WSBC', color: 'green' },
    { startHour: 15.5, endHour: 16.0, patient: 'Aubrey French', treatment: '30 Minute Massage', insurance: 'Pacific Blue Cross (Paper)', color: 'teal' },
    { startHour: 16.0, endHour: 16.5, patient: 'Beatrice Clark', treatment: '30 Minute Massage', color: 'teal' },
    { startHour: 17.25, endHour: 18.0, patient: 'Dylan Grewal', treatment: '45 Minute Massage', color: 'teal' },
  ])

  const [sidebarKey, setSidebarKey] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelPractitioner, setPanelPractitioner] = useState<string | null>(null)
  const [panelTime, setPanelTime] = useState<number | null>(null)
  const [panelAvailableUntil, setPanelAvailableUntil] = useState<number | null>(null)
  const [formTreatment, setFormTreatment] = useState<string>('')
  const [formPatient, setFormPatient] = useState<string>('')
  const [formNotes, setFormNotes] = useState<string>('')

  const { state, modalProps } = useModal()
  const [bookingPanelOpen, setBookingPanelOpen] = useState(false)
  const [prefillStaff, setPrefillStaff] = useState('')
  const [prefillTime, setPrefillTime] = useState('')
  const [prefillDateISO, setPrefillDateISO] = useState('')
  const [confirmedAppt, setConfirmedAppt] = useState<{ patient: string; staff: string; time: string; dateISO: string; treatment: string } | null>(null)
  const [scheduleView, setScheduleView] = useState<'grid' | 'list'>('grid')

  const ALL_STATES = ['Unarrived', 'Checked In', 'Arrived', 'No Show', 'Breaks', 'Available', 'Cancelled', 'Rescheduled', 'Deleted', 'Never Booked']
  const [stateFilterOpen, setStateFilterOpen] = useState(false)
  const [activeStates, setActiveStates] = useState<string[]>(['Unarrived', 'Checked In', 'Arrived', 'No Show', 'Breaks', 'Available'])
  const statesBtnRef = useRef<HTMLButtonElement>(null)
  function toggleState(s: string) {
    setActiveStates(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const [listDate, setListDate] = useState(new Date(2026, 6, 13)) // July 13 2026
  const [goToDateOpen, setGoToDateOpen] = useState(false)
  const [goToDateVal, setGoToDateVal] = useState('')
  const goToDateInputRef = useRef<HTMLInputElement>(null)
  const prevDayBtnRef = useRef<HTMLButtonElement>(null)
  const [listDateAnnouncement, setListDateAnnouncement] = useState('')

  function formatListDate(d: Date) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
  function moveDay(delta: number) {
    setListDate(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() + delta)
      setListDateAnnouncement(`Showing ${formatListDate(next)}`)
      return next
    })
  }
  const bookBtnRef = useRef<HTMLButtonElement>(null)
  const listBookBtnRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  function openBookingPanel(staff = '', sortHour = -1, availableUntil?: number) {
    setPrefillStaff(staff)
    setPanelAvailableUntil(availableUntil ?? null)
    if (sortHour >= 0) {
      const h = Math.floor(sortHour)
      const m = Math.round((sortHour % 1) * 60)
      setPrefillTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      const today = new Date(); today.setHours(0,0,0,0)
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      setPrefillDateISO(`${yyyy}-${mm}-${dd}`)
    } else {
      setPrefillTime('')
      setPrefillDateISO('')
    }
    setBookingPanelOpen(true)
  }

  function openBookingPanelFromSidebar(staff: string, timeStr: string, dateISO: string, patient = '', treatment = '') {
    setConfirmedAppt({ patient, staff, time: timeStr, dateISO, treatment })
    setBookingPanelOpen(false)
    setSidebarKey(k => k + 1)
  }

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === '=') {
        e.preventDefault()
        setScheduleView(v => v === 'grid' ? 'list' : 'grid')
      }
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        openBookingPanel()
      }
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        setActiveStates(prev => {
          const onlyAvailable = prev.length === 1 && prev[0] === 'Available'
          return onlyAvailable
            ? ['Unarrived', 'Checked In', 'Arrived', 'No Show', 'Breaks', 'Available']
            : ['Available']
        })
      }
      if (e.key === '?') {
        e.preventDefault()
        setShortcutsModalOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const practitioners: Practitioner[] = [
    {
      name: 'Jo-Ellen McKay', initials: 'JM', discipline: 'Physiotherapy / Clinical Pilates',
      cap: null, booked: 1, waitlist: 1,
      appts: [
        { startHour: 12.5, endHour: 13.5, patient: 'Elizabeth Bélanger', treatment: 'Subsequent Treatment', color: 'teal' },
        { startHour: 15.0, endHour: 16.0, patient: 'No patient', treatment: 'Clinical Pilates', color: 'darkTeal' },
        { startHour: 16.0, endHour: 17.0, patient: 'Chloe Ma', treatment: 'Initial Assessment and Treatment', color: 'teal' },
      ],
    },
    {
      name: 'Amy Kendrick', initials: 'AK', discipline: 'Massage Therapy',
      cap: 8, booked: 3, waitlist: 1,
      appts: [
        { startHour: 13.0, endHour: 14.5, patient: 'Samuel Clark', treatment: '90 Minute Massage', insurance: 'Manulife', color: 'teal' },
        { startHour: 16.0, endHour: 16.5, patient: 'Owen Anderson', treatment: '30 Minute Massage', insurance: 'Manulife', color: 'teal' },
      ],
    },
    {
      name: 'Susan Lo', initials: 'SL', discipline: 'Massage Therapy',
      cap: susanCap, booked: susanAppts.length, waitlist: 1,
      appts: susanAppts,
    },
    {
      name: 'Michael Carroll', initials: 'MC', discipline: 'Naturopathic Medicine',
      cap: 8, booked: 3, waitlist: 3,
      appts: [
        { startHour: 12.5, endHour: 13.0, patient: 'Lily Smith', treatment: '30 Minute Return Visit', insurance: 'WCB', color: 'teal' },
        { startHour: 15.5, endHour: 16.0, patient: 'Aubrey French', treatment: '30 Minute Massage', insurance: 'Pacific Blue Cross (Paper)', color: 'teal' },
        { startHour: 16.5, endHour: 17.0, patient: 'James Smith', treatment: '30 Minute Return Visit', insurance: 'WCB', color: 'teal' },
      ],
    },
  ]

  const openPanel = (pName: string, hour: number) => {
    setPanelPractitioner(pName)
    setPanelTime(hour)
    setFormTreatment('')
    setFormPatient('')
    setFormNotes('')
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setPanelPractitioner(null)
    setPanelTime(null)
  }

  const handleBookAppointment = () => {
    const p = practitioners.find(x => x.name === panelPractitioner)
    if (p && p.cap != null && p.booked >= p.cap) {
      state.open()
    } else {
      commitBooking()
    }
  }

  const commitBooking = () => {
    if (panelPractitioner !== 'Susan Lo' || panelTime == null) {
      closePanel()
      state.close()
      return
    }
    const treatment = TREATMENTS.find(t => t.id === formTreatment)
    const duration = treatment?.duration ?? 0.5
    const label = treatment?.label ?? '30 Minute Massage'
    const patient = formPatient.trim() || 'New Patient'

    setSusanAppts(prev => [...prev, {
      startHour: panelTime,
      endHour: panelTime + duration,
      patient,
      treatment: label,
      color: 'teal',
    }])
    showToast({
      content: `Appointment booked for ${patient} at ${formatHour(panelTime)}.`,
      tone: 'success',
      isDismissible: true,
      timeout: 5000,
    })
    closePanel()
    state.close()
  }

  if (isMobile) {
    return (
      <MobileSchedule
        practitioners={practitioners}
        susanCap={susanCap}
        modalState={state}
        modalProps={modalProps}
        panelOpen={panelOpen}
        panelPractitioner={panelPractitioner}
        panelTime={panelTime}
        formTreatment={formTreatment}
        setFormTreatment={setFormTreatment}
        formPatient={formPatient}
        setFormPatient={setFormPatient}
        formNotes={formNotes}
        setFormNotes={setFormNotes}
        openPanel={openPanel}
        closePanel={closePanel}
        handleBookAppointment={handleBookAppointment}
        commitBooking={commitBooking}
        showIndicator={showIndicator}
      />
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f4f4f4' }}>
      {/* Sidebar is after main in DOM so tab order hits Book first, CSS order places it visually on the left */}

      <main id="schedule-main" tabIndex={-1} style={{ flex: 1, padding: scheduleView === 'list' ? '14px 24px' : '14px 18px', overflowY: 'auto', minWidth: 0, order: 2, width: scheduleView === 'list' ? '100%' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 6 }}>
          {scheduleView === 'grid' && <Heading level={1} style={{ margin: 0, flex: 1 }}>July 13th 2026</Heading>}
          {scheduleView === 'list' && <div style={{ flex: 1 }} />}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {scheduleView === 'grid' && <>
              <PrimaryButton id="schedule-book-btn" ref={bookBtnRef} onClick={() => openBookingPanel()} style={{ margin: 0 }}>Book</PrimaryButton>
              <Button>Reminders</Button>
              <Button>Wait List</Button>
              <Button>Shifts ▾</Button>
              <Button>Resources</Button>
              <Button>Rooms ▾</Button>
            </>}
            {/* View toggle */}
            <button
              onClick={() => setScheduleView(v => v === 'grid' ? 'list' : 'grid')}
              aria-label={scheduleView === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              title={scheduleView === 'grid' ? 'List view' : 'Grid view'}
              style={{ background: scheduleView === 'list' ? vars.global.color.brand['10'] : '#fff', border: `1px solid ${scheduleView === 'list' ? vars.global.color.brand['60'] : '#ccc'}`, borderRadius: 6, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              {/* Grid/list icon */}
              {scheduleView === 'grid' ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#444" strokeWidth="1.5">
                  <rect x="1" y="1" width="14" height="3" rx="1"/><rect x="1" y="6" width="14" height="3" rx="1"/><rect x="1" y="11" width="14" height="3" rx="1"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#444" strokeWidth="1.5">
                  <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {bookingPanelOpen && (
          <AccessibleBookingPanel
            onClose={() => {
              setBookingPanelOpen(false)
              // Return focus to whichever button opened the panel
              const lastListBtn = Object.values(listBookBtnRefs.current).find(b => b === document.activeElement)
              if (!lastListBtn) bookBtnRef.current?.focus()
            }}
            triggerRef={bookBtnRef}
            initialStaff={prefillStaff}
            initialTime={prefillTime}
            initialDateISO={prefillDateISO}
            availableUntil={panelAvailableUntil ?? undefined}
            onBook={(result) => {
              setSusanAppts(prev => [...prev, {
                startHour: result.startHour,
                endHour: result.endHour,
                patient: result.patient,
                treatment: result.treatmentLabel,
                color: 'teal',
              }])
              showToast({
                content: `Appointment booked for ${result.patient} at ${result.startHour % 1 === 0 ? result.startHour + ':00' : Math.floor(result.startHour) + ':30'}.`,
                tone: 'success',
                isDismissible: true,
                timeout: 5000,
              })
            }}
          />
        )}

        {scheduleView === 'grid' ? (
          <div style={{ background: 'white', border: '1px solid #e2e2e2', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
              <Text size="sm" style={{ color: '#E8A33D', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>Today</Text>
              <Text size="sm" style={{ color: '#E8A33D', fontWeight: 600 }}>July 13, 2026</Text>
            </div>

            {/* Practitioner header row */}
            <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${practitioners.length}, 1fr)`, borderBottom: '1px solid #e2e2e2' }}>
              <div />
              {practitioners.map(p => (
                <div key={p.name} style={{ borderRight: '1px solid #e2e2e2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px' }}>
                    <Avatar initials={p.initials} size={28} />
                    <Text size="sm" style={{ flex: 1, color: vars.global.color.brand['70'] }}>{p.name}</Text>
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `60px repeat(${practitioners.length}, 1fr)` }}>
              <div>
                {HOURS.map(h => (
                  <div key={h} style={{ height: ROW_HEIGHT, borderBottom: '1px solid #f0f0f0', padding: '4px 6px', boxSizing: 'border-box' }}>
                    <Text size="sm" style={{ color: '#777', lineHeight: 1.1 }}>{formatHour(h)}</Text>
                  </div>
                ))}
              </div>

              {practitioners.map(p => {
                const reservedDuration = TREATMENTS.find(t => t.id === formTreatment)?.duration ?? 0.25
                const reservedSlot = panelOpen && panelPractitioner === p.name && panelTime != null
                  ? { startHour: panelTime, duration: reservedDuration }
                  : null
                return (
                  <PractitionerSchedule
                    key={p.name}
                    p={p}
                    onSlotClick={hour => openPanel(p.name, hour)}
                    reservedSlot={reservedSlot}
                  />
                )
              })}

              <CurrentTimeMarker hour={13.27} />
            </div>
          </div>
        ) : (
          /* ── List view ── */
          <div>
            {/* Live region for date change announcements */}
            <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              {listDateAnnouncement}
            </div>

            {/* Date navigation */}
            <nav aria-label="Date navigation" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <button
                ref={prevDayBtnRef}
                onClick={() => moveDay(-1)}
                aria-label={`Previous day, go to ${formatListDate(new Date(listDate.getFullYear(), listDate.getMonth(), listDate.getDate() - 1))}`}
                style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >‹</button>
              <button
                onClick={() => { setListDate(new Date(2026, 6, 13)); setListDateAnnouncement('Returned to today, July 13th 2026') }}
                style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '0 12px', height: 32, cursor: 'pointer', fontSize: 13 }}
              >Today</button>
              <button
                onClick={() => moveDay(1)}
                aria-label={`Next day, go to ${formatListDate(new Date(listDate.getFullYear(), listDate.getMonth(), listDate.getDate() + 1))}`}
                style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >›</button>
              <Heading level={1} style={{ margin: 0, fontSize: 20, flex: 1 }}>
                {listDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Heading>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    const iso = `${listDate.getFullYear()}-${String(listDate.getMonth() + 1).padStart(2, '0')}-${String(listDate.getDate()).padStart(2, '0')}`
                    setGoToDateVal(iso)
                    setGoToDateOpen(o => !o)
                    setTimeout(() => goToDateInputRef.current?.focus(), 50)
                  }}
                  aria-expanded={goToDateOpen}
                  aria-haspopup="dialog"
                  style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '0 12px', height: 32, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#555" strokeWidth="1.5"><rect x="1" y="2" width="12" height="11" rx="1"/><path d="M4 1v2M10 1v2M1 5h12"/></svg>
                  Go to date
                </button>
                {goToDateOpen && (
                  <>
                    <div onClick={() => setGoToDateOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} aria-hidden="true" />
                    <div role="dialog" aria-label="Go to a specific date" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 100, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 16, width: 240 }}>
                      <label htmlFor="list-date-input" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                        Select a date
                      </label>
                      <input
                        id="list-date-input"
                        ref={goToDateInputRef}
                        type="date"
                        value={goToDateVal}
                        onChange={e => setGoToDateVal(e.target.value)}
                        style={{ width: '100%', fontSize: 13, padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={() => {
                          if (goToDateVal) {
                            const [y, m, d] = goToDateVal.split('-').map(Number)
                            const next = new Date(y, m - 1, d)
                            setListDate(next)
                            setGoToDateOpen(false)
                            setGoToDateVal('')
                            setTimeout(() => prevDayBtnRef.current?.focus(), 50)
                          }
                        }}
                        disabled={!goToDateVal}
                        style={{ marginTop: 10, width: '100%', background: vars.global.color.brand['70'], color: '#fff', border: 'none', borderRadius: 4, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: goToDateVal ? 'pointer' : 'not-allowed', opacity: goToDateVal ? 1 : 0.5 }}
                      >
                        Go
                      </button>
                    </div>
                  </>
                )}
              </div>
            </nav>

            {/* Filter bar */}
            {(() => {
              const stateCount = activeStates.length
              const stateLabel = stateCount === ALL_STATES.length ? 'All States' : `${stateCount} State${stateCount !== 1 ? 's' : ''}`
              return (
                <div role="toolbar" aria-label="Schedule filters" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 4 }}>
                  <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#555" strokeWidth="1.5"><path d="M1 3h12M3 7h8M5 11h4"/></svg>

                  {/* States filter */}
                  <div style={{ position: 'relative' }}>
                    <button
                      ref={statesBtnRef}
                      aria-label={`Filter by appointment state, currently ${stateLabel} selected`}
                      aria-haspopup="dialog"
                      aria-expanded={stateFilterOpen}
                      onClick={() => setStateFilterOpen(o => !o)}
                      style={{ fontSize: 13, color: '#333', background: '#fff', border: `1px solid ${stateFilterOpen ? vars.global.color.brand['60'] : '#ccc'}`, borderRadius: 16, padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {stateLabel} <span aria-hidden="true" style={{ fontSize: 10 }}>▾</span>
                    </button>

                    {stateFilterOpen && (
                      <>
                        <div onClick={() => setStateFilterOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} aria-hidden="true" />
                        <div role="dialog" aria-label="Filter by appointment state" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', width: 240, padding: '8px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 14px 8px', borderBottom: '1px solid #eee', marginBottom: 4 }}>
                            <button onClick={() => setActiveStates([ALL_STATES[0]])} style={{ fontSize: 12, color: '#555', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 1"/></svg>
                              Select One
                            </button>
                            <button onClick={() => setActiveStates([...ALL_STATES])} style={{ fontSize: 12, color: '#555', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                              Select Many
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 1"/></svg>
                            </button>
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: '#444' }}>
                            <span>Select All</span>
                            <input type="checkbox" checked={activeStates.length === ALL_STATES.length} onChange={e => setActiveStates(e.target.checked ? [...ALL_STATES] : [])} style={{ width: 18, height: 18, accentColor: vars.global.color.brand['60'] }} />
                          </label>
                          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '4px 0' }} />
                          {ALL_STATES.map(s => (
                            <label key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: '#333' }}>
                              <span>{s}</span>
                              <input type="checkbox" checked={activeStates.includes(s)} onChange={() => toggleState(s)} style={{ width: 18, height: 18, accentColor: vars.global.color.brand['60'] }} />
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {[
                    { label: 'All Locations',     ariaLabel: 'Filter by location, currently all locations' },
                    { label: 'All Staff Members',  ariaLabel: 'Filter by staff member, currently all staff members' },
                    { label: 'All Billing States', ariaLabel: 'Filter by billing state, currently all billing states' },
                  ].map(f => (
                    <button key={f.label} aria-label={f.ariaLabel} aria-haspopup="listbox" style={{ fontSize: 13, color: '#333', background: '#fff', border: '1px solid #ccc', borderRadius: 16, padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {f.label} <span aria-hidden="true" style={{ fontSize: 10 }}>▾</span>
                    </button>
                  ))}
                </div>
              )
            })()}

            {/* List */}
            <div style={{ background: 'white', border: '1px solid #e2e2e2', borderRadius: 4, overflow: 'hidden' }}>
              {/* Column headers — visual only, hidden from screen readers */}
              <div aria-hidden="true" style={{
                display: 'grid',
                gridTemplateColumns: '140px 100px 180px 200px 160px 120px 140px 100px',
                gap: 16,
                padding: '8px 16px',
                borderBottom: '2px solid #e2e2e2',
                background: '#fafafa',
              }}>
                {['Time', 'Status', 'Patient', 'Treatment', 'Staff', 'Location', 'Insurance', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
                ))}
              </div>
              {(() => {
                const BILLING_COLORS: Record<string, { bg: string; text: string }> = {
                  Paid:        { bg: '#3ab5a0', text: '#fff' },
                  Uninvoiced:  { bg: '#e0e0e0', text: '#555' },
                  Unpaid:      { bg: '#e05252', text: '#fff' },
                }

                type ListRow = {
                  status: string
                  location: string
                  timeLabel: string
                  patient: string
                  treatment: string
                  staffName: string
                  insurance?: string
                  billing?: string
                  isAvailable?: boolean
                  sortHour: number
                  endHour?: number
                }

                const bookedRows: ListRow[] = practitioners.flatMap(p =>
                  p.appts.map(a => ({
                    status: 'Booked',
                    location: 'The Village',
                    timeLabel: `${formatHour(a.startHour)} – ${formatHour(a.endHour)}`,
                    patient: a.patient,
                    treatment: a.treatment,
                    staffName: p.name,
                    insurance: a.insurance,
                    billing: 'Uninvoiced',
                    sortHour: a.startHour,
                  }))
                )

                const openRows: ListRow[] = HOURS.filter(h => h >= 9 && h <= 17).flatMap(h =>
                  practitioners
                    .filter(p => !p.appts.some(a => a.startHour <= h && a.endHour > h))
                    .map(p => {
                      // Find when the next appointment starts for this practitioner after h
                      const nextApptStart = p.appts
                        .map(a => a.startHour)
                        .filter(s => s > h)
                        .sort((a, b) => a - b)[0] ?? 18
                      const endHour = Math.min(nextApptStart, 18)
                      const timeLabel = `${formatHour(h)} – ${formatHour(endHour)}`
                      return {
                        status: 'Available',
                        location: 'The Village',
                        timeLabel,
                        patient: '',
                        treatment: '',
                        staffName: p.name,
                        isAvailable: true,
                        sortHour: h,
                        endHour,
                      }
                    })
                )

                const BOOKED_STATES = new Set(['Unarrived', 'Checked In', 'Arrived', 'No Show', 'Breaks', 'Cancelled', 'Rescheduled', 'Deleted'])
                const AVAILABLE_STATES = new Set(['Available', 'Never Booked'])
                const showBooked = [...BOOKED_STATES].some(s => activeStates.includes(s))
                const showAvailable = [...AVAILABLE_STATES].some(s => activeStates.includes(s))

                const rows = [...bookedRows, ...openRows]
                  .sort((a, b) => a.sortHour - b.sortHour)
                  .filter(r => r.isAvailable ? showAvailable : showBooked)

                return rows.map((row, i) => {
                  const bc = row.billing ? BILLING_COLORS[row.billing] : null
                  const rowLabel = row.isAvailable
                    ? `Available slot. ${speakHour(row.timeLabel)}. ${row.staffName}. ${row.location}. Book.`
                    : [speakHour(row.timeLabel), 'Booked', row.patient, row.treatment, row.staffName, row.location, row.insurance].filter(Boolean).join('. ') + '.'

                  return (
                    <div key={i} role="presentation" style={{ position: 'relative', borderBottom: '1px solid #f0f0f0', background: row.isAvailable ? '#fafffe' : '#fff' }}>
                      {/* Visual grid — hidden from screen readers */}
                      <div aria-hidden="true" style={{
                        display: 'grid',
                        gridTemplateColumns: '140px 100px 180px 200px 160px 120px 140px 100px',
                        alignItems: 'center',
                        padding: '10px 16px',
                        gap: 16,
                      }}>
                        <span style={{ fontSize: 13, color: '#444', fontWeight: 500 }}>{row.timeLabel}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: row.isAvailable ? '#3daf82' : vars.global.color.brand['70'] }}>
                          {row.status}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: row.isAvailable ? 400 : 500, color: row.isAvailable ? '#aaa' : '#222', fontStyle: row.isAvailable ? 'italic' : 'normal' }}>
                          {row.isAvailable ? 'No patient' : row.patient}
                        </span>
                        <span style={{ fontSize: 13, color: row.isAvailable ? '#bbb' : '#444' }}>
                          {row.isAvailable ? '' : row.treatment}
                        </span>
                        <span style={{ fontSize: 13, color: vars.global.color.brand['70'] }}>{row.staffName}</span>
                        <span style={{ fontSize: 13, color: '#555' }}>{row.location}</span>
                        <span style={{ fontSize: 13, color: '#666' }}>{row.insurance ?? ''}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {row.isAvailable ? (
                            <span style={{ fontSize: 12, fontWeight: 600, color: vars.global.color.brand['70'], background: '#fff', border: `1px solid ${vars.global.color.brand['40']}`, borderRadius: 4, padding: '5px 14px', whiteSpace: 'nowrap' }}>
                              Book
                            </span>
                          ) : bc ? (
                            <span style={{ fontSize: 11, fontWeight: 600, color: bc.text, background: bc.bg, borderRadius: 4, padding: '3px 10px', textAlign: 'center', display: 'inline-block', whiteSpace: 'nowrap' }}>
                              {row.billing}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {/* Invisible overlay button — no children, so VoiceOver reads only aria-label */}
                      <button
                        ref={el => { listBookBtnRefs.current[i] = el }}
                        aria-label={rowLabel}
                        onClick={() => { if (row.isAvailable) openBookingPanel(row.staffName, row.sortHour, row.endHour) }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'transparent', border: 'none',
                          cursor: row.isAvailable ? 'pointer' : 'default',
                          outline: 'none',
                        }}
                        onFocus={e => { e.currentTarget.parentElement!.style.boxShadow = `inset 0 0 0 2px ${vars.global.color.brand['60']}` }}
                        onBlur={e => { e.currentTarget.parentElement!.style.boxShadow = 'none' }}
                      />
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}

        {scheduleView === 'grid' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 8, borderTop: '1px solid #eee' }}>
            <Button aria-label="Previous day">‹</Button>
            <Button>Today</Button>
            <Button aria-label="Next day">›</Button>
            <Button>Day</Button>
            <Button>Week</Button>
            <Button>Staff Today</Button>
            <div style={{ flex: 1 }} />
            <Button>Go To Date</Button>
          </div>
        )}
      </main>

      {scheduleView === 'grid' && <ScheduleSidebar key={sidebarKey} onBook={(staff, time, dateISO, patient, treatment) => openBookingPanelFromSidebar(staff, time, dateISO, patient, treatment)} />}

      {confirmedAppt && (
        <ConfirmedAppointmentPanel
          appt={confirmedAppt}
          onClose={() => setConfirmedAppt(null)}
        />
      )}

      {panelOpen && panelPractitioner && panelTime != null && (
        <NewAppointmentPanel
          practitioner={panelPractitioner}
          time={panelTime}
          availableUntil={panelAvailableUntil ?? undefined}
          treatment={formTreatment}
          setTreatment={setFormTreatment}
          patient={formPatient}
          setPatient={setFormPatient}
          notes={formNotes}
          setNotes={setFormNotes}
          onClose={closePanel}
          onBook={handleBookAppointment}
        />
      )}

      <Modal state={state} {...modalProps} size="md">
        <Modal.Header>
          <Modal.Title>This practitioner has reached their daily booking limit</Modal.Title>
          <Modal.CloseButton onClick={state.close} />
        </Modal.Header>
        <Modal.Content>
          <Text style={{ margin: 0 }}>
            Susan Lo has reached their daily limit of {susanCap} appointments.
            Online booking is paused for today, but you can still add this appointment manually.
          </Text>
        </Modal.Content>
        <Modal.Footer>
          <Button onClick={state.close}>Cancel</Button>
          <PrimaryButton onClick={commitBooking}>Book Anyway</PrimaryButton>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  KEYBOARD SHORTCUTS MODAL
 * ───────────────────────────────────────────────────────────────── */

function Kbd({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 28, padding: '2px 7px', background: '#f0f0f0',
      border: '1px solid #ccc', borderBottom: '2px solid #aaa',
      borderRadius: 4, fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
      color: '#333', whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  )
}

function ShortcutRow({ label, keys }: { label: string; keys: React.ReactNode[] }) {
  return (
    <tr>
      <td style={{ padding: '5px 0', textAlign: 'right', paddingRight: 16, fontSize: 14, color: '#333', whiteSpace: 'nowrap' }}>{label}</td>
      <td style={{ padding: '5px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
        {keys.map((k, i) => <React.Fragment key={i}>{i > 0 && <span style={{ fontSize: 12, color: '#888', margin: '0 2px' }}>+</span>}{k}</React.Fragment>)}
      </td>
    </tr>
  )
}
function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div role="presentation" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="shortcuts-title"
        style={{ background: '#fff', borderRadius: 8, width: 700, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Heading level={1} id="shortcuts-title" style={{ margin: 0, fontSize: 28, fontWeight: 400 }}>Keyboard Shortcuts</Heading>
        </div>

        {/* Two-column body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, padding: '20px 32px 0' }}>

          {/* Left column — General */}
          <div style={{ paddingRight: 32, paddingBottom: 28 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <ShortcutRow label="Keyboard Shortcuts" keys={[<Kbd>Shift</Kbd>, <Kbd>?</Kbd>]} />
                <ShortcutRow label="Search" keys={[<Kbd>S</Kbd>]} />
                <ShortcutRow label="Privacy" keys={[<Kbd>Shift</Kbd>, <Kbd>P</Kbd>]} />
                <tr><td colSpan={2} style={{ height: 12 }} /></tr>
                <ShortcutRow label="View Next Dates" keys={[<Kbd>N</Kbd>]} />
                <ShortcutRow label="View Previous Dates" keys={[<Kbd>P</Kbd>]} />
                <tr><td colSpan={2} style={{ height: 12 }} /></tr>
                <ShortcutRow label="Hide / Show Weekends" keys={[<Kbd>`</Kbd>]} />
                <ShortcutRow label="Vertical Zoom In" keys={[<Kbd>Shift</Kbd>, <Kbd>↑</Kbd>]} />
                <ShortcutRow label="Vertical Zoom Out" keys={[<Kbd>Shift</Kbd>, <Kbd>↓</Kbd>]} />
                <ShortcutRow label="Full Screen" keys={[<Kbd>Shift</Kbd>, <Kbd>F</Kbd>]} />
                <tr><td colSpan={2} style={{ height: 12 }} /></tr>
                <ShortcutRow label="Schedule" keys={[<Kbd>Shift</Kbd>, <Kbd>1</Kbd>]} />
                <ShortcutRow label="Patients" keys={[<Kbd>Shift</Kbd>, <Kbd>2</Kbd>]} />
                <ShortcutRow label="Staff" keys={[<Kbd>Shift</Kbd>, <Kbd>3</Kbd>]} />
                <ShortcutRow label="Next Location" keys={[<Kbd>L</Kbd>]} />
                <ShortcutRow label="Previous Location" keys={[<Kbd>Shift</Kbd>, <Kbd>L</Kbd>]} />
                <ShortcutRow label="Tasks" keys={[<Kbd>K</Kbd>]} />
              </tbody>
            </table>
          </div>

          {/* Right column — Schedule Only */}
          <div style={{ background: '#f6f6f6', borderRadius: 8, padding: '20px 24px 24px', marginBottom: 28 }}>
            <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 15, textAlign: 'center' }}>Schedule Only</p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <ShortcutRow label="Today" keys={[<Kbd>T</Kbd>]} />
                <ShortcutRow label="Staff Working Today" keys={[<Kbd>Shift</Kbd>, <Kbd>T</Kbd>]} />
                <ShortcutRow label="Shifts" keys={[<Kbd>Shift</Kbd>, <Kbd>S</Kbd>]} />
                <ShortcutRow label="Wait List" keys={[<Kbd>W</Kbd>]} />
                <ShortcutRow label="Double Book View" keys={[<Kbd>D</Kbd>]} />
                <ShortcutRow label="Scroll" keys={[<Kbd>←</Kbd>, <Kbd>↑</Kbd>, <Kbd>↓</Kbd>, <Kbd>→</Kbd>]} />
                <ShortcutRow label="Schedule View" keys={[<Kbd>Shift</Kbd>, <Kbd>=</Kbd>]} />
                <ShortcutRow label="List" keys={[<Kbd>=</Kbd>]} />
                <tr><td colSpan={2} style={{ height: 12 }} /></tr>
                <tr><td colSpan={2} style={{ borderTop: '1px solid #ddd', paddingTop: 12 }} /></tr>
                <ShortcutRow label="New Appointment" keys={[<Kbd style={{ background: vars.global.color.brand['10'], borderColor: vars.global.color.brand['40'], color: vars.global.color.brand['70'] }}>B</Kbd>]} />
                <ShortcutRow label="Toggle Available Slots" keys={[<Kbd style={{ background: vars.global.color.brand['10'], borderColor: vars.global.color.brand['40'], color: vars.global.color.brand['70'] }}>A</Kbd>]} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 32px 24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button ref={closeRef} onClick={onClose} style={{ padding: '8px 20px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  ONLINE BOOKING SITE
 * ───────────────────────────────────────────────────────────────── */

type Location = {
  name: string
  area: string
  address: string
  staff: StaffMember[]
}

function OnlineBookingSite({
  onBack, onSelectPractitioner, onJaneClick,
}: {
  onBack: () => void
  onSelectPractitioner: (target: BookingTarget) => void
  onJaneClick: () => void
}) {
  const teal = vars.global.color.brand['70']
  const locations: Location[] = [
    {
      name: 'The Village', area: 'Lynn Valley',
      address: '1000 Mountain Hwy., North Vancouver',
      staff: STAFF.slice(0, 10),
    },
    {
      name: 'The District', area: 'Downtown',
      address: '1234 Main St., Vancouver',
      staff: [STAFF[1], STAFF[7], STAFF[3], STAFF[5], STAFF[4], STAFF[9], STAFF[10]],
    },
  ]

  return (
    <div style={{ flex: 1, background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Top teal strip */}
      <div style={{
        background: teal, color: 'white',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <Text size="sm" style={{ color: 'white', flex: 1 }}>
          Welcome back Demo. You have 4 upcoming appointments.
        </Text>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: 'white',
          fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0,
        }}>My Account</button>
        <button style={{
          background: 'transparent', border: 'none', color: 'white',
          fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0,
        }}>Sign Out</button>
        <button
          onClick={onJaneClick}
          aria-label="Back to admin schedule"
          style={{
            background: 'transparent', border: 'none', color: 'white',
            fontFamily: 'inherit', fontStyle: 'italic', fontWeight: 700,
            fontSize: 20, lineHeight: 1, cursor: 'pointer', padding: 0,
          }}
        >Jane</button>
      </div>

      {/* Clinic branding */}
      <div style={{ padding: '28px 56px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontStyle: 'italic', fontWeight: 700, fontSize: 36,
          color: teal, lineHeight: 1,
        }}>Jane</div>
        <Text size="lg" style={{ color: '#9a9a9a', fontWeight: 400, fontSize: 26 }}>
          Demo Clinic
        </Text>
      </div>

      {/* Main card */}
      <div style={{ padding: '0 56px 56px' }}>
        <div style={{ background: 'white', border: '1px solid #e2e2e2', borderRadius: 2 }}>
          {/* Welcome banner */}
          <div style={{ background: teal, padding: '20px 28px' }}>
            <Heading level={1} style={{ margin: 0, color: 'white', fontWeight: 500, fontSize: 28 }}>
              Welcome to our online booking site
            </Heading>
          </div>

          {/* Locations */}
          {locations.map((loc, i) => (
            <div key={loc.name} style={{
              padding: '32px 32px 40px',
              borderTop: i > 0 ? '1px solid #e8e8e8' : 'none',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                    <Heading level={2} style={{ margin: 0, color: teal, fontWeight: 500 }}>
                      {loc.name}
                    </Heading>
                    <Text size="md" style={{ color: '#666' }}>{loc.area}</Text>
                  </div>
                  <Text size="sm" style={{ display: 'block', color: '#444', marginBottom: 16 }}>
                    {loc.address}
                  </Text>
                  <button style={{
                    background: teal, color: 'white', border: 'none',
                    padding: '12px 18px', borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                    width: '100%', maxWidth: 380,
                  }}>
                    Book an Appointment at {loc.name}
                  </button>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
                }}>
                  {loc.staff.map(s => (
                    <PractitionerTile
                      key={s.name + i}
                      staff={s}
                      onClick={() => onSelectPractitioner({ staff: s, locationName: loc.name, locationArea: loc.area })}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PractitionerTile({ staff, onClick }: { staff: StaffMember; onClick?: () => void }) {
  return (
    <button onClick={onClick} title={staff.name} style={{
      aspectRatio: '1 / 1',
      border: '1px solid #e2e2e2', borderRadius: 2,
      background: staff.photo ? '#eef0f1' : 'linear-gradient(135deg, #C9D7DF, #8FA4B0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px',
      cursor: 'pointer', padding: 0, fontFamily: 'inherit', overflow: 'hidden',
    }}>
      {staff.photo
        ? <img src={staff.photo} alt={staff.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : staff.initials}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  BOOKING APPOINTMENT PAGE  (Susan Lo treatment picker + calendar)
 * ───────────────────────────────────────────────────────────────── */

type Treatment = {
  id: string
  category: string
  label: string
  description: string
  duration: number   // minutes
  price: number      // $
  hasAddOns?: boolean
  footnote?: string
}

const BOOKING_TREATMENTS: Treatment[] = [
  { id: '30', category: 'Massage Therapy', label: '30 Minute Massage', description: 'A half hour Registered Massage Therapy visit with an RMT.', duration: 30, price: 60 },
  { id: '60', category: 'Massage Therapy', label: '60 Minute Massage', description: 'A one hour Registered Massage Therapy visit with an RMT.', duration: 60, price: 100, hasAddOns: true },
  { id: '90', category: 'Massage Therapy', label: '90 Minute Massage', description: 'An hour and a half Registered Massage Therapy visit with an RMT.', duration: 90, price: 125 },
  { id: '120', category: 'Massage Therapy', label: '2 Hour Massage', description: 'A 120 minute Registered Massage Therapy visit with an RMT. Offered only at the Village', duration: 120, price: 90 },
]

type DaySlots =
  | { kind: 'none' }
  | { kind: 'booked'; startHour: number; endHour: number }
  | { kind: 'slots'; slots: Array<{ time: string; extra?: number; bookedBefore?: boolean }>; bookedBands?: Array<{ row: number }> }

const SAMPLE_WEEK: { date: string; day: DaySlots }[] = [
  { date: 'Sun May 31', day: { kind: 'slots', slots: [
    { time: '9:30 AM PDT' },
    { time: '10:00 AM PDT', extra: 1 },
    { time: '11:00 AM PDT', extra: 1 },
    { time: '12:30 PM PDT' },
    { time: '2:15 PM PDT' },
    { time: '4:00 PM PDT' },
  ] } },
  { date: 'Mon Jun 1',   day: { kind: 'slots', slots: [
    { time: '11:00 AM PDT' },
  ] } },
  { date: 'Tue Jun 2',   day: { kind: 'slots', slots: [
    { time: '12:00 PM PDT', extra: 1 },
    { time: '2:00 PM PDT',  extra: 1 },
    { time: '4:00 PM PDT',  extra: 1, bookedBefore: true },
    { time: '5:30 PM PDT' },
  ] } },
  { date: 'Wed Jun 3',   day: { kind: 'slots', slots: [
    { time: '9:00 AM PDT' },
    { time: '10:45 AM PDT' },
    { time: '1:00 PM PDT',  extra: 1, bookedBefore: true },
    { time: '2:00 PM PDT',  extra: 1 },
  ] } },
  { date: 'Thu Jun 4',   day: { kind: 'booked', startHour: 10, endHour: 19 } },
  { date: 'Fri Jun 5',   day: { kind: 'none' } },
  { date: 'Sat Jun 6',   day: { kind: 'slots', slots: [
    { time: '9:00 AM PDT', extra: 1 },
    { time: '10:00 AM PDT', extra: 1 },
    { time: '11:30 AM PDT' },
    { time: '1:00 PM PDT',  extra: 1, bookedBefore: true },
    { time: '2:00 PM PDT',  extra: 1 },
    { time: '3:00 PM PDT' },
    { time: '4:00 PM PDT',  extra: 1 },
  ] } },
]

function BookingAppointmentPage({
  target, onBack, onAccount, onJaneClick,
}: { target: BookingTarget; onBack: () => void; onAccount: () => void; onJaneClick: () => void }) {
  const teal = vars.global.color.brand['70']
  const tealLight = '#7EC7C7'
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null)
  const treatmentSelected = selectedTreatment != null

  return (
    <div style={{ flex: 1, background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Top teal strip */}
      <div style={{
        background: teal, color: 'white',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <Text size="sm" style={{ color: 'white', flex: 1 }}>
          Welcome back Demo. You have 4 upcoming appointments.
        </Text>
        <button onClick={onAccount} style={transparentLink}>My Account</button>
        <button style={transparentLink}>Sign Out</button>
        <button
          onClick={onJaneClick}
          aria-label="Back to admin schedule"
          style={{
            ...transparentLink, fontStyle: 'italic', fontWeight: 700, fontSize: 20, lineHeight: 1,
          }}
        >Jane</button>
      </div>

      {/* Last-booked banner (only when no treatment selected) */}
      {!treatmentSelected && (
        <div style={{
          background: tealLight, color: 'white',
          padding: '14px 32px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}>
            <rect x="3" y="4" width="14" height="14" rx="1.5"/><path d="M3 8h14M7 2v3M13 2v3"/>
          </svg>
          <div style={{ flex: 1 }}>
            <Text size="sm" style={{ color: 'white', display: 'block', lineHeight: 1.45 }}>
              You last booked a 90 Minute Massage with {target.staff.name} at {target.locationName}. {target.staff.name.split(' ')[0]}'s next opening is Sunday May 31, 2026 at 9:30am PDT
            </Text>
            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedTreatment('30') }} style={{ color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              View {target.staff.name.split(' ')[0]}'s Availability ›
            </a>
          </div>
        </div>
      )}

      {/* Clinic branding (only when no treatment selected) */}
      {!treatmentSelected && (
        <div style={{ padding: '28px 56px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 36, color: teal, lineHeight: 1 }}>Jane</div>
          <Text size="lg" style={{ color: '#9a9a9a', fontWeight: 400, fontSize: 26 }}>Demo Clinic</Text>
        </div>
      )}

      {/* Main card */}
      <div style={{ padding: treatmentSelected ? '0 56px 56px' : '0 56px 56px' }}>
        <div style={{ background: 'white', border: '1px solid #e2e2e2', borderRadius: 2 }}>
          {/* Header banner (only when no treatment selected) */}
          {!treatmentSelected && (
            <div style={{ background: teal, padding: '20px 28px' }}>
              <Heading level={1} style={{ margin: 0, color: 'white', fontWeight: 300, fontSize: 30 }}>
                Book an Appointment <span style={{ fontSize: 18, opacity: 0.9, fontWeight: 400 }}>at {target.locationName} - {target.locationArea}</span>
              </Heading>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0 }}>
            {/* Left column: practitioner + treatments */}
            <div style={{ padding: '24px 24px 32px', borderRight: '1px solid #f0f0f0' }}>
              <button onClick={onBack} style={{
                background: 'white', border: '1px solid #d0d0d0', borderRadius: 4,
                padding: '7px 12px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 18,
              }}>
                <svg width="6" height="9" viewBox="0 0 6 9" fill="none" stroke="#444" strokeWidth="1.4"><path d="M5 1L1 4.5 5 8"/></svg>
                Back to Booking Page
              </button>

              <div style={{
                width: 100, height: 100, borderRadius: 4,
                background: target.staff.photo ? '#eef0f1' : 'linear-gradient(135deg, #C9D7DF, #8FA4B0)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 600, letterSpacing: '-1px', marginBottom: 12,
                overflow: 'hidden',
              }}>
                {target.staff.photo
                  ? <img src={target.staff.photo} alt={target.staff.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : target.staff.initials}
              </div>

              <Heading level={2} style={{ margin: '0 0 2px' }}>{target.staff.name}</Heading>
              <Text size="sm" style={{ display: 'block', color: '#444', fontWeight: 500, marginBottom: 8 }}>{target.staff.credentials || ''}</Text>
              <Text size="sm" style={{ display: 'block', color: '#444', lineHeight: 1.5, marginBottom: 18 }}>
                {target.staff.bio}{' '}
                <a href="#" style={{ color: teal, textDecoration: 'none' }}>Read more</a>
              </Text>

              <Heading level={3} style={{ margin: '0 0 12px' }}>Select a treatment</Heading>
              <Heading level={4} style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 14 }}>{target.staff.discipline.includes('Massage') ? 'Massage Therapy' : target.staff.discipline}</Heading>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BOOKING_TREATMENTS.map(t => (
                  <TreatmentCard
                    key={t.id}
                    treatment={t}
                    selected={selectedTreatment === t.id}
                    onSelect={() => setSelectedTreatment(t.id)}
                  />
                ))}
              </div>

              {!treatmentSelected && (
                <div style={{ marginTop: 18 }}>
                  <Text size="sm" style={{ display: 'block', color: '#444', marginBottom: 8 }}>Can't find a time?</Text>
                  <a href="#" style={{ display: 'block', color: teal, fontSize: 13, textDecoration: 'underline', marginBottom: 8 }}>
                    See availability of all registered massage therapists (Massage Therapy).
                  </a>
                  <a href="#" style={{ display: 'block', color: teal, fontSize: 13, textDecoration: 'underline' }}>
                    Add yourself to {target.staff.name}'s wait list.
                  </a>
                </div>
              )}
            </div>

            {/* Right column: empty state OR calendar */}
            <div style={{ padding: '24px 28px 32px' }}>
              {treatmentSelected
                ? <AvailabilityCalendar />
                : <BookingEmptyState />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const transparentLink: React.CSSProperties = {
  background: 'transparent', border: 'none', color: 'white',
  fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0,
}

function TreatmentCard({
  treatment, selected, onSelect,
}: { treatment: Treatment; selected: boolean; onSelect: () => void }) {
  const teal = vars.global.color.brand['70']
  return (
    <div style={{
      border: `${selected ? 2 : 1}px solid ${selected ? teal : '#dcdcdc'}`,
      borderRadius: 4, padding: '12px 14px', cursor: 'pointer',
      background: 'white',
    }} onClick={onSelect}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `1.5px solid ${selected ? teal : '#bbb'}`,
          background: 'white', flexShrink: 0, marginTop: 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: teal }} />}
        </span>
        <div style={{ flex: 1 }}>
          <Text size="sm" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>{treatment.label}</Text>
          <Text size="sm" style={{ display: 'block', color: '#555', marginBottom: 8, lineHeight: 1.4 }}>
            {treatment.description}
          </Text>
          <div style={{ display: 'flex', gap: 6 }}>
            <Pill text={`${treatment.duration} minutes`} tone="grey" />
            <Pill text={`$${treatment.price.toFixed(2)}`} tone="grey" />
          </div>
          {treatment.hasAddOns && (
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
              <a href="#" onClick={e => e.stopPropagation()} style={{ color: teal, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                View add-ons
                <svg width="9" height="6" viewBox="0 0 9 6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l3.5 3.5L8 1"/></svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BookingEmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
      <Text size="md" style={{ display: 'block', marginBottom: 24 }}>
        <strong>Select a treatment</strong> from the list on the left<br />
        to view available appointment times
      </Text>
      <svg width="320" height="220" viewBox="0 0 320 220" fill="none" style={{ opacity: 0.18 }}>
        <rect x="40" y="50" width="220" height="140" rx="6" stroke="#999" strokeWidth="2"/>
        <rect x="40" y="50" width="220" height="20" rx="6" fill="#999"/>
        <rect x="60" y="90" width="180" height="14" rx="2" fill="#bbb"/>
        <rect x="60" y="110" width="60" height="50" rx="2" fill="#bbb"/>
        <rect x="130" y="110" width="60" height="50" rx="2" fill="#bbb"/>
        <rect x="200" y="110" width="40" height="50" rx="2" fill="#bbb"/>
        <circle cx="250" cy="170" r="22" stroke="#999" strokeWidth="2"/>
        <path d="M250 158v12l8 6" stroke="#999" strokeWidth="2"/>
      </svg>
    </div>
  )
}

function AvailabilityCalendar() {
  const teal = vars.global.color.brand['70']
  const hatched = 'repeating-linear-gradient(135deg, #e8e8e8 0 2px, #f4f4f4 2px 8px)'
  const HOURS_CAL = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  const ROW = 50

  // Edge case: Mon Jun 1 has only one slot. Clicking it shows the "no longer
  // available" modal (race condition with another patient claiming the cap).
  // After dismissal, the slot flips to a "Booked" gray band.
  const EDGE_DATE = 'Mon Jun 1'
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set())
  const { state: capState, modalProps: capModalProps } = useModal()
  const pendingRef = React.useRef<string | null>(null)

  const slotId = (date: string, time: string) => `${date}::${time}`
  const handleSlotClick = (date: string, time: string) => {
    const id = slotId(date, time)
    if (takenSlots.has(id)) return
    if (date === EDGE_DATE) {
      pendingRef.current = id
      capState.open()
    }
  }
  const handleCapModalClose = () => {
    if (pendingRef.current) {
      const id = pendingRef.current
      setTakenSlots(prev => { const n = new Set(prev); n.add(id); return n })
      pendingRef.current = null
    }
    capState.close()
  }

  function rowForTime(t: string): number {
    const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!m) return 0
    let h = parseInt(m[1], 10)
    const min = parseInt(m[2], 10)
    const period = m[3].toUpperCase()
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return ((h - 8) + min / 60)
  }

  return (
    <div>
      {/* Calendar header: prev / range / next */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <button style={calNavBtn}>
          <svg width="6" height="9" viewBox="0 0 6 9" fill="none" stroke="#444" strokeWidth="1.4"><path d="M5 1L1 4.5 5 8"/></svg>
          Previous 7 Days
        </button>
        <div style={{ flex: 1, textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Heading level={2} style={{ margin: 0, fontWeight: 500 }}>Sun May 31 - Sat Jun 6</Heading>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={teal} strokeWidth="1.5"><rect x="2" y="3" width="14" height="13" rx="1.5"/><path d="M2 7h14M6 1v3M12 1v3"/></svg>
        </div>
        <button style={calNavBtn}>
          Next 7 Days
          <svg width="6" height="9" viewBox="0 0 6 9" fill="none" stroke="#444" strokeWidth="1.4"><path d="M1 1l4 3.5L1 8"/></svg>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <Text size="sm" style={{ color: '#555' }}>
          Vancouver - America (GMT -07:00){' '}
          <a href="#" style={{ color: teal, textDecoration: 'none', marginLeft: 4 }}>Change Time Zone</a>
        </Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: 4 }}>
        {/* Day headers */}
        <div />
        {SAMPLE_WEEK.map(d => (
          <div key={d.date} style={{ textAlign: 'center', color: teal, fontWeight: 500, fontSize: 13, marginBottom: 8 }}>
            {d.date}
          </div>
        ))}

        {/* Hour labels column */}
        <div style={{ position: 'relative' }}>
          {HOURS_CAL.map((h, i) => (
            <div key={h} style={{
              position: 'absolute', top: i * ROW - 6, left: 0,
              fontSize: 11, color: '#888',
            }}>{formatHourLabel(h)}</div>
          ))}
          <div style={{ height: HOURS_CAL.length * ROW }} />
        </div>

        {/* Day columns */}
        {SAMPLE_WEEK.map(d => (
          <div key={d.date} style={{
            position: 'relative', height: HOURS_CAL.length * ROW,
            background: d.day.kind === 'none' ? '#ececec' : hatched,
            borderRadius: 2,
          }}>
            {d.day.kind === 'none' && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#555', fontSize: 13, fontWeight: 500,
              }}>No Availability</div>
            )}

            {d.day.kind === 'booked' && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2C2C2C', fontSize: 14, fontWeight: 500,
              }}>Booked</div>
            )}

            {d.day.kind === 'slots' && (
              d.day.slots.map((s, idx) => {
                const top = rowForTime(s.time) * ROW
                const id = slotId(d.date, s.time)
                const taken = takenSlots.has(id)
                return (
                  <React.Fragment key={idx}>
                    {s.bookedBefore && (
                      <div style={{
                        position: 'absolute', top: top - 26, left: 4, right: 4,
                        textAlign: 'center', fontSize: 14, fontWeight: 500, color: '#2C2C2C',
                      }}>Booked</div>
                    )}
                    {taken ? (
                      <div style={{
                        position: 'absolute', top, left: 2, right: 2, height: ROW - 4,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2C2C2C', fontSize: 13, fontWeight: 500,
                      }}>Booked</div>
                    ) : (
                      <button
                        onClick={() => handleSlotClick(d.date, s.time)}
                        style={{
                          position: 'absolute', top, left: 2, right: 2, height: ROW - 4,
                          background: teal, border: 'none', borderRadius: 2,
                          color: 'white', fontFamily: 'inherit', cursor: 'pointer',
                          padding: '6px 8px', display: 'flex', flexDirection: 'column',
                          justifyContent: 'space-between', alignItems: 'flex-start',
                          textAlign: 'left',
                        }}>
                        <div style={{ fontSize: 11, fontWeight: 600 }}>{s.time}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', fontSize: 10 }}>
                          {s.extra ? <span>+ {s.extra} more</span> : <span />}
                          <svg width="6" height="9" viewBox="0 0 6 9" fill="none" stroke="white" strokeWidth="1.4"><path d="M1 1l4 3.5L1 8"/></svg>
                        </div>
                      </button>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <Text size="sm" style={{ color: '#444' }}>
          Can't find a time? <a href="#" style={{ color: teal, textDecoration: 'underline' }}>Add yourself to the wait list.</a>
        </Text>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <span style={legendChip('#e8e8e8', '#666')}>Unavailable</span>
        <span style={legendChip(teal, 'white')}>Available</span>
      </div>

      <Modal state={capState} {...capModalProps} size="md">
        <Modal.Header>
          <Modal.Title>This time is no longer available.</Modal.Title>
          <Modal.CloseButton onClick={handleCapModalClose} />
        </Modal.Header>
        <Modal.Content>
          <Text style={{ margin: 0 }}>
            Sorry, this appointment time is no longer available. Please select a different time.
          </Text>
        </Modal.Content>
        <Modal.Footer>
          <PrimaryButton onClick={handleCapModalClose}>Select a new time</PrimaryButton>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

function formatHourLabel(h: number): string {
  const period = h >= 12 ? 'pm' : 'am'
  const d = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${d}${period}`
}

const calNavBtn: React.CSSProperties = {
  background: 'white', border: '1px solid #d0d0d0', borderRadius: 4,
  padding: '7px 12px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
}

function legendChip(bg: string, fg: string): React.CSSProperties {
  return {
    background: bg, color: fg, fontSize: 11, fontWeight: 500,
    padding: '3px 10px', borderRadius: 12,
  }
}

/* ─────────────────────────────────────────────────────────────────
 *  MOBILE SCHEDULE
 * ───────────────────────────────────────────────────────────────── */

function MobileSchedule({
  practitioners, susanCap, modalState, modalProps,
  panelOpen, panelPractitioner, panelTime,
  formTreatment, setFormTreatment,
  formPatient, setFormPatient,
  formNotes, setFormNotes,
  openPanel, closePanel,
  handleBookAppointment, commitBooking,
  showIndicator,
}: {
  practitioners: Practitioner[]
  susanCap: number
  modalState: ReturnType<typeof useModal>['state']
  modalProps: ReturnType<typeof useModal>['modalProps']
  panelOpen: boolean
  panelPractitioner: string | null
  panelTime: number | null
  formTreatment: string; setFormTreatment: (v: string) => void
  formPatient: string;   setFormPatient:  (v: string) => void
  formNotes: string;     setFormNotes:    (v: string) => void
  openPanel: (pName: string, hour: number) => void
  closePanel: () => void
  handleBookAppointment: () => void
  commitBooking: () => void
  showIndicator: boolean
}) {
  const COL_WIDTH = 180
  const HOUR_COL_WIDTH = 50
  const teal = vars.global.color.brand['70']
  const teal20 = vars.global.color.brand['20']

  // Group practitioners by discipline so we can render the discipline header spanning their columns
  const groups: { discipline: string; start: number; count: number }[] = []
  practitioners.forEach((p, i) => {
    const last = groups[groups.length - 1]
    if (last && last.discipline === p.discipline) last.count += 1
    else groups.push({ discipline: p.discipline, start: i, count: 1 })
  })

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Mobile top header */}
      <header style={{
        background: teal, color: 'white',
        height: 56, padding: '0 12px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button style={{
          background: 'transparent', border: 'none', color: 'white',
          fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2,
          padding: 0, cursor: 'pointer',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4l-6 6 6 6"/></svg>
          Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontStyle: 'italic', fontWeight: 600, fontSize: 22 }}>Jane</div>
        <button style={{
          width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer',
        }}>?</button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: teal20, color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>DO</div>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="white" strokeWidth="1.8"><path d="M1 1l4 4 4-4"/></svg>
        </div>
      </header>

      {/* Schedule content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <div style={{ width: HOUR_COL_WIDTH + COL_WIDTH * practitioners.length, minWidth: '100%' }}>
          {/* Date row */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }}>
            <Text size="sm" style={{ color: '#E8A33D', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>Today</Text>
            <Text size="sm" style={{ color: '#E8A33D', fontWeight: 600 }}>July 13, 2026</Text>
          </div>

          {/* Discipline header row */}
          <div style={{ display: 'grid', gridTemplateColumns: `${HOUR_COL_WIDTH}px repeat(${practitioners.length}, ${COL_WIDTH}px)`, borderBottom: '1px solid #f0f0f0' }}>
            <div />
            {groups.map(g => (
              <div key={g.discipline + g.start} style={{
                gridColumn: `span ${g.count}`,
                padding: '8px 10px',
              }}>
                <Text size="sm" style={{ color: teal, fontWeight: 500 }}>{g.discipline}</Text>
              </div>
            ))}
          </div>

          {/* Practitioner header row */}
          <div style={{ display: 'grid', gridTemplateColumns: `${HOUR_COL_WIDTH}px repeat(${practitioners.length}, ${COL_WIDTH}px)`, borderBottom: '1px solid #e2e2e2' }}>
            <div />
            {practitioners.map(p => (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                borderRight: '1px solid #f0f0f0',
              }}>
                <Avatar initials={p.initials} size={26} />
                <Text size="sm" style={{ flex: 1, color: teal, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</Text>
                {p.cap != null && showIndicator && <AvailabilityBadge cap={p.cap} booked={p.booked} />}
                <WaitlistBadge count={p.waitlist} />
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `${HOUR_COL_WIDTH}px repeat(${practitioners.length}, ${COL_WIDTH}px)` }}>
            <div>
              {HOURS.map(h => (
                <div key={h} style={{ height: ROW_HEIGHT, borderBottom: '1px solid #f0f0f0', padding: '4px 6px', boxSizing: 'border-box' }}>
                  <Text size="sm" style={{ color: '#777', lineHeight: 1.1, fontSize: 11 }}>{formatHour(h)}</Text>
                </div>
              ))}
            </div>
            {practitioners.map(p => {
              const reservedDuration = TREATMENTS.find(t => t.id === formTreatment)?.duration ?? 0.25
              const reservedSlot = panelOpen && panelPractitioner === p.name && panelTime != null
                ? { startHour: panelTime, duration: reservedDuration }
                : null
              return (
                <PractitionerSchedule
                  key={p.name}
                  p={p}
                  onSlotClick={hour => openPanel(p.name, hour)}
                  reservedSlot={reservedSlot}
                />
              )
            })}
            <CurrentTimeMarker hour={13.27} />
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        flexShrink: 0, background: 'white', borderTop: '1px solid #e2e2e2',
        padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Button>‹</Button>
        <Button>›</Button>
        <Button>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="3"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2"/></svg>
            Today
          </span>
        </Button>
        <Button>Shifts</Button>
        <div style={{ flex: 1 }} />
        <button style={iconBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#444" strokeWidth="1.4"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6h12M5 1v3M11 1v3"/></svg>
        </button>
        <button style={iconBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#444" strokeWidth="1.4"><circle cx="8" cy="8" r="2.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/></svg>
        </button>
      </div>

      {/* Bottom tab nav */}
      <nav style={{
        flexShrink: 0, background: teal, color: 'white',
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        padding: '6px 0 8px',
      }}>
        {[
          { label: 'Schedule', icon: 'cal' },
          { label: 'Patients', icon: 'users' },
          { label: 'Staff',    icon: 'user' },
          { label: 'Billing',  icon: 'dollar' },
          { label: 'Reports',  icon: 'chart' },
        ].map((t, i) => (
          <div key={t.label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            fontSize: 10, fontWeight: 500, opacity: i === 0 ? 1 : 0.85,
          }}>
            <TabIcon name={t.icon} />
            {t.label}
          </div>
        ))}
      </nav>

      {/* New appointment panel — slides up as bottom sheet */}
      {panelOpen && panelPractitioner && panelTime != null && (
        <div onClick={closePanel} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 100, display: 'flex', alignItems: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxHeight: '85vh', background: '#f4f4f4',
            borderTopLeftRadius: 14, borderTopRightRadius: 14, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <div style={{ width: '100%' }}>
                <NewAppointmentPanel
                  practitioner={panelPractitioner}
                  time={panelTime}
                  treatment={formTreatment}
                  setTreatment={setFormTreatment}
                  patient={formPatient}
                  setPatient={setFormPatient}
                  notes={formNotes}
                  setNotes={setFormNotes}
                  onClose={closePanel}
                  onBook={handleBookAppointment}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal state={modalState} {...modalProps} size="md">
        <Modal.Header>
          <Modal.Title>This practitioner has reached their daily booking limit</Modal.Title>
          <Modal.CloseButton onClick={modalState.close} />
        </Modal.Header>
        <Modal.Content>
          <Text style={{ margin: 0 }}>
            Susan Lo has reached their daily limit of {susanCap} appointments.
            Online booking is paused for today, but you can still add this appointment manually.
          </Text>
        </Modal.Content>
        <Modal.Footer>
          <Button onClick={modalState.close}>Cancel</Button>
          <PrimaryButton onClick={commitBooking}>Book Anyway</PrimaryButton>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, border: '1px solid #ddd', background: 'white',
  borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
}

function TabIcon({ name }: { name: string }) {
  const stroke = 'white'
  const s = { stroke, fill: 'none', strokeWidth: 1.5 } as const
  switch (name) {
    case 'cal':    return <svg width="18" height="18" viewBox="0 0 18 18" {...s}><rect x="2" y="4" width="14" height="12" rx="1.5"/><path d="M2 7h14M6 2v3M12 2v3"/></svg>
    case 'users':  return <svg width="20" height="18" viewBox="0 0 20 18" {...s}><circle cx="7" cy="6" r="2.5"/><circle cx="14" cy="7" r="2"/><path d="M2 15c0-2.5 2.2-4 5-4s5 1.5 5 4M11 15c0-1.7 1.4-3 3-3s3 1.3 3 3"/></svg>
    case 'user':   return <svg width="16" height="18" viewBox="0 0 16 18" {...s}><circle cx="8" cy="6" r="3"/><path d="M2 16c0-3 2.7-5 6-5s6 2 6 5"/></svg>
    case 'dollar': return <svg width="14" height="18" viewBox="0 0 14 18" {...s}><path d="M7 2v14M10.5 5.5c0-1.4-1.6-2.5-3.5-2.5s-3.5 1.1-3.5 2.5S5.1 8 7 8s3.5 1.1 3.5 2.5S8.9 13 7 13s-3.5-1.1-3.5-2.5"/></svg>
    case 'chart':  return <svg width="18" height="18" viewBox="0 0 18 18" {...s}><path d="M2 15V8M7 15V4M12 15v-5M2 15h14"/></svg>
    default: return null
  }
}

function formatHour(h: number): string {
  const hour = Math.floor(h)
  const minutes = Math.round((h % 1) * 60)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`
}

function speakHour(h: string): string {
  return h.replace(/:00\b/g, '')
}

function PractitionerSchedule({
  p, onSlotClick, reservedSlot,
}: {
  p: Practitioner
  onSlotClick: (hour: number) => void
  reservedSlot: { startHour: number; duration: number } | null
}) {
  return (
    <div style={{ position: 'relative', borderRight: '1px solid #e2e2e2' }}>
      {HOURS.map(h => (
        <div
          key={h}
          onClick={(e) => { e.stopPropagation(); onSlotClick(h) }}
          style={{ height: ROW_HEIGHT, borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
        />
      ))}

      {p.appts.map((a, i) => <AppointmentBlock key={i} appt={a} />)}

      {reservedSlot && <ReservedBlock startHour={reservedSlot.startHour} duration={reservedSlot.duration} />}
    </div>
  )
}

function ReservedBlock({ startHour, duration }: { startHour: number; duration: number }) {
  const top = (startHour - HOUR_START) * ROW_HEIGHT
  const height = duration * ROW_HEIGHT
  return (
    <div style={{
      position: 'absolute', top, height, left: 2, right: 2,
      background: '#dcdcdc', border: '1px dashed #999', borderRadius: 3,
      padding: '5px 7px', fontSize: 11, lineHeight: 1.25,
      display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 16, height: 16, borderRadius: 2, background: 'white', border: '1px solid #999', flexShrink: 0,
      }}>
        <svg width="10" height="7" viewBox="0 0 10 7" stroke="#444" strokeWidth="1.6" fill="none"><path d="M1 3.5l2.5 2.5L9 1"/></svg>
      </span>
      <span style={{ fontWeight: 600, color: '#444' }}>{formatHour(startHour)} -</span>
      <span style={{
        background: '#9c9c9c', color: 'white', fontSize: 10, fontWeight: 600,
        padding: '2px 7px', borderRadius: 2,
      }}>Reserved</span>
    </div>
  )
}

function AppointmentBlock({ appt }: { appt: Appt }) {
  const top = (appt.startHour - HOUR_START) * ROW_HEIGHT
  const height = (appt.endHour - appt.startHour) * ROW_HEIGHT
  const colors = {
    teal:     { bg: '#a9dadc', text: '#0d3a3c' },
    darkTeal: { bg: '#bfafd4', text: '#3d2b5a' },
    green:    { bg: '#84c5a8', text: '#0c3a26' },
  }[appt.color ?? 'teal']
  return (
    <div style={{
      position: 'absolute', top, height, left: 2, right: 2,
      background: colors.bg, color: colors.text,
      borderRadius: 3, padding: '5px 7px', fontSize: 11, lineHeight: 1.25, overflow: 'hidden',
    }}>
      <div style={{ fontWeight: 600 }}>{formatHour(appt.startHour)} - {formatHour(appt.endHour)}</div>
      <div><strong>{appt.patient}</strong> - {appt.treatment}</div>
      {appt.insurance && (
        <div style={{ marginTop: 4 }}>
          <span style={{
            background: 'rgba(0,0,0,0.15)', color: colors.text,
            fontSize: 9.5, padding: '1px 5px', borderRadius: 2, display: 'inline-block',
          }}>{appt.insurance}</span>
        </div>
      )}
    </div>
  )
}

function CurrentTimeMarker({ hour }: { hour: number }) {
  const top = (hour - HOUR_START) * ROW_HEIGHT
  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, pointerEvents: 'none', zIndex: 5 }}>
      <div style={{ position: 'relative', height: 0 }}>
        <div style={{
          position: 'absolute', left: 0,
          background: '#2C2C2C', color: 'white',
          fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 2,
          top: -10, width: 50, textAlign: 'center',
        }}>1:16 PM</div>
        <div style={{ position: 'absolute', left: 60, right: 0, height: 1, background: '#2C2C2C' }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  NEW APPOINTMENT SIDE PANEL
 * ───────────────────────────────────────────────────────────────── */

function NewAppointmentPanel({
  practitioner, time, availableUntil, treatment, setTreatment, patient, setPatient, notes, setNotes,
  onClose, onBook, onTimeChange,
}: {
  practitioner: string
  time: number
  availableUntil?: number
  treatment: string
  setTreatment: (v: string) => void
  patient: string
  setPatient: (v: string) => void
  notes: string
  setNotes: (v: string) => void
  onClose: () => void
  onBook: () => void
  onTimeChange?: (t: number) => void
}) {
  const [selectedTime, setSelectedTime] = useState(time)
  const dayEnd = availableUntil ?? 18
  const timeOptions: number[] = []
  for (let t = time; t < dayEnd; t += 0.25) timeOptions.push(Math.round(t * 100) / 100)

  const availableDuration = dayEnd - selectedTime
  const filteredTreatments = TREATMENTS.filter(t => t.duration <= availableDuration)
  const tr = TREATMENTS.find(t => t.id === treatment)
  const endTime = selectedTime + (tr?.duration ?? 0.25)
  const treatmentRef = useRef<HTMLSelectElement>(null)
  const [announcement, setAnnouncement] = useState('')

  // Insert announcement text after live region is in the DOM, then focus treatment
  useEffect(() => {
    const t1 = setTimeout(() => setAnnouncement('New Appointment panel is open.'), 100)
    const t2 = setTimeout(() => treatmentRef.current?.focus(), 150)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Confirm treatment selection
  useEffect(() => {
    if (!treatment) return
    const label = TREATMENTS.find(t => t.id === treatment)?.label ?? treatment
    setAnnouncement(`Treatment selected: ${label}.`)
  }, [treatment])

  // Confirm patient selection
  useEffect(() => {
    if (!patient) return
    setAnnouncement(`Patient selected: ${patient}.`)
  }, [patient])

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="New Appointment"
      style={{
        width: 360, background: '#f4f4f4', borderLeft: '1px solid #e2e2e2',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto',
      }}
    >
      <style>{`
        [aria-label="New Appointment"] select:focus,
        [aria-label="New Appointment"] input:focus,
        [aria-label="New Appointment"] textarea:focus,
        [aria-label="New Appointment"] button:focus,
        [aria-label="New Appointment"] [tabindex="0"]:focus {
          outline: 3px solid #5bbcbd !important;
          outline-offset: 2px !important;
          border-radius: 4px;
        }
      `}</style>
      {/* Opening announcement — starts empty, text inserted after mount so the live region fires */}
      <div role="status" aria-live="assertive" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        {announcement}
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Heading level={2} style={{ margin: 0, flex: 1 }}>New Appointment</Heading>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            width: 28, height: 28, borderRadius: 4, border: '1px solid #ddd',
            background: 'white', cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="#444" strokeWidth="1.5"><path d="M1 1l8 8M9 1L1 9"/></svg>
        </button>
      </div>

      <div style={{ padding: '0 16px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Heading level={3} style={{ margin: 0, flex: 1 }}>Booking Info</Heading>
      </div>

      <PanelSection title="Treatment" hideTitle>
        <select
          ref={treatmentRef}
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          aria-label="Treatment"
          style={{
            width: '100%', fontSize: 13, padding: '8px 10px',
            border: '1px solid #c8c8c8', borderRadius: 4, background: 'white',
            fontFamily: 'inherit', color: treatment ? '#333' : '#999',
          }}
        >
          <option value="" disabled>Select a treatment...</option>
          {filteredTreatments.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </PanelSection>

      <PanelSection title="Patient" action={<Button>New Patient</Button>}>
        <PatientSearch patient={patient} setPatient={setPatient} ariaLabel="Write the name of the patient" />
      </PanelSection>

      <PanelSection title="Packages &amp; Memberships">
        <Text size="sm" style={{ color: '#666' }}>No Packages/Memberships</Text>
      </PanelSection>

      <PanelSection title="Time" hideTitle titleId="panel-time-label">
        <select
          value={selectedTime}
          onChange={e => {
            setSelectedTime(Number(e.target.value))
          }}
          onBlur={e => {
            onTimeChange?.(Number(e.target.value))
          }}
          aria-labelledby="panel-time-label"
          style={{
            width: '100%', fontSize: 13, padding: '8px 10px',
            border: '1px solid #c8c8c8', borderRadius: 4, background: 'white',
            fontFamily: 'inherit', color: '#333',
          }}
        >
          {timeOptions.map(t => (
            <option key={t} value={t}>{formatHour(t)}</option>
          ))}
        </select>
        <Text size="sm" style={{ display: 'block', color: '#666', marginTop: 6 }} aria-hidden="true">
          Mon, Jul 13, 2026 {formatHour(selectedTime)} - {formatHour(endTime)}
        </Text>
      </PanelSection>

      <PanelSection title="Staff Member">
        <Text size="sm" tabIndex={0} aria-label={`Staff: ${practitioner}`}>{practitioner}</Text>
      </PanelSection>

      <PanelSection title="Resources">
        <Text size="sm" style={{ color: '#666' }} tabIndex={0} aria-label="Resources: No resources required">No resources required</Text>
      </PanelSection>

      <PanelSection title="Notes" noBorder>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-label="Do you want to add a note?"
          placeholder="Add Note..."
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'white', border: '1px solid #c8c8c8', borderRadius: 4,
            padding: '8px 10px', fontSize: 13, fontFamily: 'inherit', resize: 'vertical',
          }}
        />
      </PanelSection>

      <div style={{ padding: '14px 16px', borderTop: '1px solid #e2e2e2', background: 'white', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onClose} tabIndex={-1}>Cancel</Button>
        <PrimaryButton onClick={onBook} aria-label="Book Appointment">Book Appointment</PrimaryButton>
      </div>
    </aside>
  )
}

function PatientSearch({ patient, setPatient, ariaLabel }: { patient: string; setPatient: (v: string) => void; ariaLabel?: string }) {
  const [query, setQuery] = useState(patient)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selected, setSelected] = useState(!!patient)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [liveMsg, setLiveMsg] = useState('')

  React.useEffect(() => {
    setQuery(patient)
    setSelected(!!patient)
  }, [patient])

  const matches = query.trim()
    ? PATIENTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : []

  // Clear then re-set live region so VoiceOver always fires
  const announce = (msg: string) => {
    setLiveMsg('')
    setTimeout(() => setLiveMsg(msg), 50)
  }

  // Announce results as user types
  useEffect(() => {
    if (!query.trim() || selected) { setLiveMsg(''); return }
    if (matches.length === 0) announce('No patients found.')
    else announce(`${matches.length} patient${matches.length !== 1 ? 's' : ''} found. Press Enter or down arrow to jump to the list.`)
  }, [matches.length, query, selected])

  const handlePick = (name: string) => {
    setPatient(name)
    setQuery(name)
    setSelected(true)
    setShowSuggestions(false)
    setActiveIndex(-1)
    setLiveMsg('')
  }

  const handleClear = () => {
    setPatient('')
    setQuery('')
    setSelected(false)
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || matches.length === 0) return
    if (e.key === 'ArrowDown' || (e.key === 'Enter' && activeIndex < 0)) {
      e.preventDefault()
      const next = activeIndex < 0 ? 0 : Math.min(activeIndex + 1, matches.length - 1)
      setActiveIndex(next)
      announce(matches[next].name + '. Press Enter to select, or arrow keys to navigate.')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(activeIndex - 1, 0)
      setActiveIndex(prev)
      announce(matches[prev].name)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handlePick(matches[activeIndex].name)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Live region for search feedback */}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        {liveMsg}
      </div>

      <Text size="sm" style={{ display: 'block', color: '#666', marginBottom: 4 }}>Add Patient</Text>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'white', border: '1px solid #c8c8c8', borderRadius: 4, padding: '7px 10px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#999" strokeWidth="1.5" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5L13 13"/>
        </svg>
        <input
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions && matches.length > 0 && !selected}
          aria-controls="patient-listbox"
          aria-activedescendant={activeIndex >= 0 ? `patient-option-${activeIndex}` : undefined}
          value={query}
          onFocus={() => {
            setShowSuggestions(true)
            announce('Type the name of the patient. Type a few letters to identify which patient you are searching for.')
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(false)
            setShowSuggestions(true)
            setActiveIndex(-1)
            if (!e.target.value) setPatient('')
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          aria-label={ariaLabel ?? 'Add Patient'}
          placeholder="Add Patient..."
          data-1p-ignore
          autoComplete="off"
          style={{ border: 'none', background: 'transparent', fontSize: 13, flex: 1, fontFamily: 'inherit' }}
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear patient"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 0 }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l8 8M9 1L1 9"/></svg>
          </button>
        )}
      </div>

      {/* Suggestion dropdown */}
      {showSuggestions && matches.length > 0 && !selected && (
        <ul
          id="patient-listbox"
          role="listbox"
          aria-label="Patient suggestions"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
            background: 'white', border: '1px solid #c8c8c8', borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 30,
            maxHeight: 220, overflowY: 'auto', listStyle: 'none', margin: '4px 0 0', padding: 0,
          }}
        >
          {matches.map((p, i) => (
            <li
              key={p.name}
              id={`patient-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => { e.preventDefault(); handlePick(p.name) }}
              style={{
                background: i === activeIndex ? '#e0f5f4' : 'white',
                borderBottom: '1px solid #f0f0f0',
                padding: '8px 12px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 2,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: '#777' }}>{p.detail}</span>
            </li>
          ))}
        </ul>
      )}

      {!patient && (
        <Text size="sm" style={{ display: 'block', color: '#888', marginTop: 6, fontStyle: 'italic' }}>
          No patient selected...
        </Text>
      )}
    </div>
  )
}

function PanelSection({
  title, action, children, noBorder, titleId, hideTitle,
}: { title: string; action?: React.ReactNode; children: React.ReactNode; noBorder?: boolean; titleId?: string; hideTitle?: boolean }) {
  return (
    <div style={{
      background: 'white',
      borderTop: '1px solid #e2e2e2',
      borderBottom: noBorder ? 'none' : '1px solid #e2e2e2',
      marginBottom: noBorder ? 0 : -1,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <Heading level={3} id={titleId} aria-hidden={hideTitle || undefined} style={{ margin: 0, flex: 1 }}>{title}</Heading>
        {action}
      </div>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Availability + Waitlist badges
 * ───────────────────────────────────────────────────────────────── */

function useNarrowScreen(breakpoint = 768) {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  )
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return narrow
}

function AvailabilityBadge({ cap, booked }: { cap: number; booked: number }) {
  const full = booked >= cap
  const [open, setOpen] = useState(false)
  const narrow = useNarrowScreen()
  const tooltip = full
    ? `${booked} out of ${cap} booked, daily cap reached. Online booking is paused for today.`
    : `${booked} of ${cap} booked. ${cap - booked} slots open.`
  const label = full ? 'Full' : narrow ? `${booked}/${cap}` : `${booked}/${cap} booked`
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <span style={{
        display: 'inline-block',
        fontSize: narrow ? 12 : 11,
        fontWeight: 600,
        padding: narrow ? '4px 12px' : '2px 9px',
        borderRadius: narrow ? 14 : 12,
        background: full ? '#eaeaea' : '#ADECEE',
        color: full ? '#444' : '#2C2C2C',
        cursor: 'help', whiteSpace: 'nowrap', lineHeight: 1.5,
      }}>{label}</span>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          background: '#2C2C2C', color: 'white',
          padding: '10px 14px', borderRadius: 6,
          fontSize: 12, width: 220, textAlign: 'center',
          zIndex: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          pointerEvents: 'none', lineHeight: 1.45,
        }}>{tooltip}</div>
      )}
    </div>
  )
}

function WaitlistBadge({ count }: { count: number }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: count > 0 ? '#D4AB3F' : '#E0E0E0',
      color: count > 0 ? 'white' : '#888',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, flexShrink: 0,
    }}>{count}</div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Schedule sidebar
 * ───────────────────────────────────────────────────────────────── */

const PATIENT_TREATMENTS: Record<string, string> = {
  'Aubrey French': '30 Minute Massage',
  'Madison Barnaby': '60 Minute Massage',
  'Lily Smith': '30 Minute Massage',
  'James Martin': '90 Minute Massage',
  'Owen Anderson': '60 Minute Massage',
  'Avery Chan': '45 Minute Massage',
}

const AI_SUGGESTIONS: Record<string, { label: string; date: string; time: string; match: 'best' | 'good' | 'available' }[]> = {
  'Aubrey French': [
    { label: 'Matches her usual Thursday 3:30 PM', date: 'Thu, Jul 17', time: '3:30 PM', match: 'best' },
    { label: 'Next available Thursday', date: 'Thu, Jul 24', time: '3:30 PM', match: 'good' },
    { label: 'Soonest available', date: 'Tue, Jul 15', time: '2:00 PM', match: 'available' },
  ],
  'Madison Barnaby': [
    { label: 'Matches her usual Tuesday 10:00 AM', date: 'Tue, Jul 15', time: '10:00 AM', match: 'best' },
    { label: 'Next available Tuesday', date: 'Tue, Jul 22', time: '10:00 AM', match: 'good' },
    { label: 'Soonest available', date: 'Mon, Jul 14', time: '9:00 AM', match: 'available' },
  ],
  'Lily Smith': [
    { label: 'Matches her usual Friday 2:00 PM', date: 'Mon, Jul 13', time: '2:00 PM', match: 'best' },
    { label: 'Next available Friday', date: 'Fri, Jul 18', time: '2:00 PM', match: 'good' },
    { label: 'Soonest available', date: 'Wed, Jul 16', time: '11:00 AM', match: 'available' },
  ],
  'James Martin': [
    { label: 'Matches his usual Wednesday 11:00 AM', date: 'Wed, Jul 16', time: '11:00 AM', match: 'best' },
    { label: 'Next available Wednesday', date: 'Wed, Jul 23', time: '11:00 AM', match: 'good' },
    { label: 'Soonest available', date: 'Mon, Jul 14', time: '2:00 PM', match: 'available' },
  ],
  'Owen Anderson': [
    { label: 'Matches his usual Monday 9:00 AM', date: 'Mon, Jul 14', time: '9:00 AM', match: 'best' },
    { label: 'Next available Monday', date: 'Mon, Jul 21', time: '9:00 AM', match: 'good' },
    { label: 'Soonest available', date: 'Tue, Jul 15', time: '10:00 AM', match: 'available' },
  ],
  'Avery Chan': [
    { label: 'Matches her usual Saturday 1:00 PM', date: 'Sat, Jul 12', time: '1:00 PM', match: 'best' },
    { label: 'Next available Saturday', date: 'Sat, Jul 19', time: '1:00 PM', match: 'good' },
    { label: 'Soonest available', date: 'Thu, Jul 17', time: '4:00 PM', match: 'available' },
  ],
}

/* ─────────────────────────────────────────────────────────────────
 *  Exploration 4 — Single-practitioner accessible day view
 * ───────────────────────────────────────────────────────────────── */

const EX4_PRACTITIONERS = ['Susan Lo', 'Amy Kendrick', 'Jo-Ellen McKay', 'Michael Carroll']

// Booked slots per practitioner: key = "HH:MM", value = { patient, treatment }
const EX4_BOOKED: Record<string, Record<string, { patient: string; treatment: string }>> = {
  'Susan Lo': {
    '09:00': { patient: 'Aubrey French', treatment: '30 Minute Massage' },
    '10:30': { patient: 'Madison Barnaby', treatment: '60 Minute Massage' },
    '13:00': { patient: 'Lily Smith', treatment: '30 Minute Massage' },
    '15:00': { patient: 'James Martin', treatment: '90 Minute Massage' },
  },
  'Amy Kendrick': {
    '09:30': { patient: 'Owen Anderson', treatment: '60 Minute Massage' },
    '11:00': { patient: 'Avery Chan', treatment: '45 Minute Massage' },
    '14:00': { patient: 'Madison Barnaby', treatment: '30 Minute Massage' },
  },
  'Jo-Ellen McKay': {
    '10:00': { patient: 'James Martin', treatment: '60 Minute Massage' },
    '13:30': { patient: 'Aubrey French', treatment: '45 Minute Massage' },
    '16:00': { patient: 'Lily Smith', treatment: '30 Minute Massage' },
  },
  'Michael Carroll': {
    '08:30': { patient: 'Avery Chan', treatment: '90 Minute Massage' },
    '11:30': { patient: 'Owen Anderson', treatment: '30 Minute Massage' },
    '14:30': { patient: 'James Martin', treatment: '60 Minute Massage' },
  },
}

// Generate 30-min slots from 08:00 to 17:30
function generateSlots() {
  const slots: string[] = []
  for (let h = 8; h < 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}
const EX4_SLOTS = generateSlots()

function slotLabel(key: string) {
  const [h, m] = key.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

const EX4_BASE_DATE = new Date(2026, 6, 13) // July 13 2026

function addDays(base: Date, delta: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + delta)
  return d
}

function formatDay(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatDayShort(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const EX4_HOUR_START = 8
const EX4_HOUR_END = 18
const EX4_HOURS = Array.from({ length: EX4_HOUR_END - EX4_HOUR_START + 1 }, (_, i) => EX4_HOUR_START + i)

// Convert "HH:MM" to decimal hour (e.g. "10:30" → 10.5)
function ex4SlotToHour(slot: string) {
  const [h, m] = slot.split(':').map(Number)
  return h + m / 60
}

// Convert treatment string to duration in hours
function ex4Duration(treatment: string) {
  if (treatment.includes('90')) return 1.5
  if (treatment.includes('60')) return 1.0
  if (treatment.includes('45')) return 0.75
  return 0.5
}

// Initials from name
function ex4Initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2)
}

function Exploration4Page() {
  const TEAL = vars.global.color.brand['70']
  const [practitioner, setPractitioner] = useState('Susan Lo')
  const [dayOffset, setDayOffset] = useState(0)
  const [bookingHour, setBookingHour] = useState<number | null>(null)
  const [bookingAvailableUntil, setBookingAvailableUntil] = useState<number | null>(null)
  const [treatment, setTreatment] = useState('')
  const [patient, setPatient] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmedAppt, setConfirmedAppt] = useState<{ patient: string; staff: string; time: string; dateISO: string; treatment: string } | null>(null)
  const [focusedRange, setFocusedRange] = useState<{ startHour: number; endHour: number } | null>(null)
  const [addedBookings, setAddedBookings] = useState<Record<string, { patient: string; treatment: string }>>({})
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [pickerYear, setPickerYear] = useState('')
  const [pickerYearConfirmed, setPickerYearConfirmed] = useState(false)
  const [pickerMonth, setPickerMonth] = useState('')
  const [pickerMonthConfirmed, setPickerMonthConfirmed] = useState(false)
  const [pickerDay, setPickerDay] = useState('')
  const [pickerDayConfirmed, setPickerDayConfirmed] = useState(false)
  const [pickerAnnouncement, setPickerAnnouncement] = useState('')

  const currentDay = addDays(EX4_BASE_DATE, dayOffset)
  const booked = { ...EX4_BOOKED[practitioner] ?? {}, ...addedBookings }
  const dateISO = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`

  function handleSlotClick(hour: number, availableUntil?: number) {
    setBookingHour(hour)
    setBookingAvailableUntil(availableUntil ?? null)
    setTreatment('')
    setPatient('')
    setNotes('')
    setConfirmedAppt(null)
  }

  function handleConfirmBook() {
    if (bookingHour === null) return
    const tr = TREATMENTS.find(t => t.id === treatment)
    const treatmentLabel = tr?.label ?? '30 Minute Massage'
    const slotKey = `${String(Math.floor(bookingHour)).padStart(2, '0')}:${bookingHour % 1 === 0.5 ? '30' : '00'}`
    setAddedBookings(prev => ({ ...prev, [slotKey]: { patient: patient || 'New Patient', treatment: treatmentLabel } }))
    setConfirmedAppt({
      patient: patient || 'New Patient',
      staff: practitioner,
      time: formatHour(bookingHour),
      dateISO,
      treatment: treatmentLabel,
    })
    setBookingHour(null)
  }

  // Build a set of hour ranges occupied by booked appointments
  const bookedRanges = Object.entries(booked).map(([slot, appt]) => {
    const start = ex4SlotToHour(slot)
    return { start, end: start + ex4Duration(appt.treatment), patient: appt.patient, treatment: appt.treatment }
  })

  function isHourBooked(h: number) {
    return bookedRanges.some(r => h >= r.start && h < r.end)
  }

  const GRID_STEP = 0.25 // 15 minutes

  // Treatment duration from selected treatment id
  const selectedTreatmentLabel = TREATMENTS.find(t => t.id === treatment)?.label ?? ''
  const treatmentDur = treatment ? ex4Duration(selectedTreatmentLabel) : GRID_STEP

  // A 15-min slot is navigable if: not booked, and (if treatment selected) full duration fits before next appointment
  function isSlotNavigable(h: number) {
    if (isHourBooked(h)) return false
    const end = Math.round((h + treatmentDur) * 100) / 100
    if (end > EX4_HOUR_END) return false
    return !bookedRanges.some(r => h < r.end && end > r.start)
  }

  const apptColors = ['teal', 'darkTeal', 'green'] as const
  const apptColorMap = Object.keys(booked).reduce((acc, slot, i) => {
    acc[slot] = apptColors[i % apptColors.length]
    return acc
  }, {} as Record<string, 'teal' | 'darkTeal' | 'green'>)

  const colors = {
    teal:     { bg: '#a9dadc', text: '#0d3a3c' },
    darkTeal: { bg: '#bfafd4', text: '#3d2b5a' },
    green:    { bg: '#84c5a8', text: '#0c3a26' },
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f4f4f4' }}>

      <main id="exploration4-main" tabIndex={-1} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar — date nav (moved from bottom to top for keyboard accessibility) */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e2e2', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setDayOffset(d => d - 1)}
            aria-label={formatDayShort(addDays(EX4_BASE_DATE, dayOffset - 1))}
            style={{ background: 'white', border: '1px solid #ccc', borderRadius: 4, width: 30, height: 30, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >‹</button>
          <button
            onClick={() => setDayOffset(0)}
            aria-label={formatDayShort(addDays(EX4_BASE_DATE, 0))}
            style={{ fontSize: 13, padding: '5px 12px', border: '1px solid #ccc', borderRadius: 4, background: 'white', color: '#333', cursor: 'pointer', fontFamily: 'inherit' }}
          >Today</button>
          <button
            onClick={() => setDayOffset(d => d + 1)}
            aria-label={formatDayShort(addDays(EX4_BASE_DATE, dayOffset + 1))}
            style={{ background: 'white', border: '1px solid #ccc', borderRadius: 4, width: 30, height: 30, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >›</button>
          <div role="text" style={{ margin: '0 0 0 8px', fontSize: 20, fontWeight: 700, flex: 1 }} aria-live="polite" aria-atomic="true">
            {formatDay(currentDay)}
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              aria-label="Go to date"
              aria-expanded={showDatePicker}
              onClick={() => { setPickerYear(''); setPickerYearConfirmed(false); setPickerMonth(''); setPickerMonthConfirmed(false); setPickerDay(''); setPickerDayConfirmed(false); setPickerAnnouncement(''); setShowDatePicker(v => !v) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '5px 14px', border: '1px solid #ccc', borderRadius: 6, background: 'white', color: '#333', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <rect x="1" y="3" width="14" height="12" rx="2" stroke="#555" strokeWidth="1.4" fill="none"/>
                <path d="M1 7h14" stroke="#555" strokeWidth="1.4"/>
                <path d="M5 1v3M11 1v3" stroke="#555" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Go to date
            </button>
            {showDatePicker && (() => {
              const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
              const step = !pickerYearConfirmed ? 'year' : !pickerMonthConfirmed ? 'month' : !pickerDayConfirmed ? 'day' : 'confirm'
              const announce = (msg: string) => { setPickerAnnouncement(''); setTimeout(() => setPickerAnnouncement(msg), 50) }
              const confirmYear = () => {
                const y = Number(pickerYear)
                if (y >= 2020 && y <= 2035) { setPickerYearConfirmed(true); announce(`${pickerYear} selected. Now select a month.`) }
              }
              const confirmMonth = () => {
                const m = Number(pickerMonth)
                if (m >= 1 && m <= 12) { setPickerMonthConfirmed(true); announce(`${MONTHS[m - 1]} selected. Now select a day.`) }
              }
              const daysInMonth = pickerYear && pickerMonth ? new Date(Number(pickerYear), Number(pickerMonth), 0).getDate() : 31
              const confirmDay = () => {
                const d = Number(pickerDay)
                if (d >= 1 && d <= daysInMonth) {
                  setPickerDayConfirmed(true)
                  announce(`${MONTHS[Number(pickerMonth) - 1]} ${pickerDay}, ${pickerYear} selected. Press Go to navigate.`)
                }
              }
              const goToDate = () => {
                const picked = new Date(Number(pickerYear), Number(pickerMonth) - 1, Number(pickerDay))
                const diff = Math.round((picked.getTime() - EX4_BASE_DATE.getTime()) / 86400000)
                setDayOffset(diff)
                setShowDatePicker(false)
              }
              const inputStyle: React.CSSProperties = { width: '100%', fontSize: 15, padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 10 }
              const btnStyle: React.CSSProperties = { width: '100%', padding: '9px', background: '#5bbcbd', color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8 }
              return (
                <div role="dialog" aria-label="Go to date" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 200, background: 'white', border: '1px solid #ddd', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', padding: 20, width: 240 }}>
                  <div aria-live="assertive" aria-atomic="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>{pickerAnnouncement}</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Go to date</div>

                  {step === 'year' && (
                    <>
                      <label htmlFor="picker-year" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Year</label>
                      <input id="picker-year" autoFocus type="text" inputMode="numeric" placeholder="e.g. 2026"
                        value={pickerYear} onChange={e => setPickerYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        onKeyDown={e => { if (e.key === 'Enter') confirmYear(); if (e.key === 'Escape') setShowDatePicker(false) }}
                        style={inputStyle} />
                      <button onClick={confirmYear} disabled={!pickerYear || Number(pickerYear) < 2020 || Number(pickerYear) > 2035}
                        style={{ ...btnStyle, opacity: pickerYear && Number(pickerYear) >= 2020 && Number(pickerYear) <= 2035 ? 1 : 0.4 }}>Next</button>
                    </>
                  )}

                  {step === 'month' && (
                    <>
                      <div style={{ fontSize: 12, color: '#3daf82', marginBottom: 8, fontWeight: 500 }}>{pickerYear}</div>
                      <label htmlFor="picker-month" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Month (1–12)</label>
                      <input id="picker-month" autoFocus type="text" inputMode="numeric" placeholder="e.g. 8"
                        value={pickerMonth} onChange={e => setPickerMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        onKeyDown={e => { if (e.key === 'Enter') confirmMonth(); if (e.key === 'Escape') setShowDatePicker(false) }}
                        style={inputStyle} />
                      {pickerMonth && Number(pickerMonth) >= 1 && Number(pickerMonth) <= 12 && (
                        <div style={{ fontSize: 12, color: '#3daf82', marginTop: -6, marginBottom: 8 }}>{MONTHS[Number(pickerMonth) - 1]}</div>
                      )}
                      <button onClick={confirmMonth} disabled={!pickerMonth || Number(pickerMonth) < 1 || Number(pickerMonth) > 12}
                        style={{ ...btnStyle, opacity: pickerMonth && Number(pickerMonth) >= 1 && Number(pickerMonth) <= 12 ? 1 : 0.4 }}>Next</button>
                      <button onClick={() => setPickerYearConfirmed(false)} style={{ width: '100%', padding: '7px', background: 'none', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                    </>
                  )}

                  {step === 'day' && (
                    <>
                      <div style={{ fontSize: 12, color: '#3daf82', marginBottom: 8, fontWeight: 500 }}>{MONTHS[Number(pickerMonth) - 1]} {pickerYear}</div>
                      <label htmlFor="picker-day" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Day (1–{daysInMonth})</label>
                      <input id="picker-day" autoFocus type="text" inputMode="numeric" placeholder={`1–${daysInMonth}`}
                        value={pickerDay} onChange={e => setPickerDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        onKeyDown={e => { if (e.key === 'Enter') confirmDay(); if (e.key === 'Escape') setShowDatePicker(false) }}
                        style={inputStyle} />
                      <button onClick={confirmDay} disabled={!pickerDay || Number(pickerDay) < 1 || Number(pickerDay) > daysInMonth}
                        style={{ ...btnStyle, opacity: pickerDay && Number(pickerDay) >= 1 && Number(pickerDay) <= daysInMonth ? 1 : 0.4 }}>Next</button>
                      <button onClick={() => setPickerMonthConfirmed(false)} style={{ width: '100%', padding: '7px', background: 'none', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                    </>
                  )}

                  {step === 'confirm' && (
                    <>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16, color: '#333' }}>{MONTHS[Number(pickerMonth) - 1]} {pickerDay}, {pickerYear}</div>
                      <button autoFocus onClick={goToDate} style={btnStyle}>Go</button>
                      <button onClick={() => setPickerDayConfirmed(false)} style={{ width: '100%', padding: '7px', background: 'none', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                    </>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Screen reader live region */}
        <div aria-live="polite" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
          Viewing {practitioner}'s schedule for {formatDay(currentDay)}.
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ background: 'white', border: '1px solid #e2e2e2', borderRadius: 4, overflow: 'hidden', margin: 14 }}>

            {/* Date header — focusable so VoiceOver reads the date before the practitioner */}
            <div
              tabIndex={0}
              aria-label={formatDay(currentDay)}
              style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', outline: 'none', borderRadius: 2 }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${TEAL}`}
              onBlur={e => e.currentTarget.style.boxShadow = ''}
            >
              <div style={{ color: '#E8A33D', fontWeight: 600, fontSize: 12, lineHeight: 1.2 }}>
                {dayOffset === 0 ? 'Today' : formatDayShort(currentDay)}
              </div>
              <div style={{ color: '#E8A33D', fontWeight: 600, fontSize: 12 }}>
                {currentDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Practitioner column header — focusable */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', borderBottom: '1px solid #e2e2e2' }}>
              <div />
              <div
                tabIndex={0}
                aria-label={practitioner}
                style={{ borderLeft: '1px solid #e2e2e2', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px', outline: 'none' }}
                onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${TEAL}`}
                onBlur={e => e.currentTarget.style.boxShadow = ''}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: TEAL,
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{ex4Initials(practitioner)}</div>
                <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{practitioner}</span>
              </div>
            </div>

            {/* Schedule grid — visual layer aria-hidden, accessible overlays sit on top */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px 1fr' }}>

              {/* Visual time labels */}
              <div aria-hidden="true">
                {EX4_HOURS.map(h => (
                  <div key={h} style={{ height: ROW_HEIGHT, borderBottom: '1px solid #f0f0f0', padding: '4px 6px', boxSizing: 'border-box' }}>
                    <span style={{ color: '#777', fontSize: 11, lineHeight: 1.1 }}>{formatHour(h)}</span>
                  </div>
                ))}
              </div>

              {/* Schedule column — visual blocks + overlays together */}
              <div style={{ position: 'relative', borderLeft: '1px solid #e2e2e2' }}>

                {/* Visual hour rows */}
                <div aria-hidden="true">
                  {EX4_HOURS.map(h => (
                    <div key={h} style={{ height: ROW_HEIGHT, borderBottom: '1px solid #f0f0f0' }} />
                  ))}
                </div>

                {/* Visual focus highlight — available slot */}
                {focusedRange && !bookedRanges.some(r => focusedRange.startHour >= r.start && focusedRange.startHour < r.end) && (
                  <div aria-hidden="true" style={{
                    position: 'absolute',
                    top: (focusedRange.startHour - EX4_HOUR_START) * ROW_HEIGHT,
                    height: (focusedRange.endHour - focusedRange.startHour) * ROW_HEIGHT - 2,
                    left: 0, right: 0,
                    background: '#e0f5f4',
                    outline: `2px solid ${TEAL}`,
                    outlineOffset: -2,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}>
                    <span style={{ position: 'absolute', right: 10, bottom: 8, fontSize: 11, color: TEAL, fontWeight: 600 }}>
                      {treatment ? `${selectedTreatmentLabel} fits — press Enter` : 'Available — press Enter to book'}
                    </span>
                  </div>
                )}

                {/* Visual focus highlight — booked appointment */}
                {focusedRange && bookedRanges.some(r => focusedRange.startHour >= r.start && focusedRange.startHour < r.end) && (
                  <div aria-hidden="true" style={{
                    position: 'absolute',
                    top: (focusedRange.startHour - EX4_HOUR_START) * ROW_HEIGHT,
                    height: (focusedRange.endHour - focusedRange.startHour) * ROW_HEIGHT - 2,
                    left: 0, right: 0,
                    outline: `3px solid #333`,
                    outlineOffset: -3,
                    pointerEvents: 'none',
                    zIndex: 4,
                    borderRadius: 4,
                  }} />
                )}

                {/* Visual booked appointment blocks */}
                {Object.entries(booked).map(([slot, appt]) => {
                  const startHour = ex4SlotToHour(slot)
                  const duration = ex4Duration(appt.treatment)
                  const endHour = startHour + duration
                  const top = (startHour - EX4_HOUR_START) * ROW_HEIGHT
                  const height = duration * ROW_HEIGHT
                  const c = colors[apptColorMap[slot] ?? 'teal']
                  const isFocused = focusedRange?.startHour === startHour
                  return (
                    <div key={slot} aria-hidden="true" style={{
                      position: 'absolute', top, left: 2, right: 2, height: height - 2,
                      background: c.bg, color: c.text,
                      borderRadius: 3, padding: '5px 7px', fontSize: 11, lineHeight: 1.25, overflow: 'hidden',
                      outline: isFocused ? `3px solid ${TEAL}` : 'none',
                      outlineOffset: 1,
                      pointerEvents: 'none',
                    }}>
                      <div style={{ fontWeight: 600 }}>{formatHour(startHour)} - {formatHour(endHour)}</div>
                      <div><strong>{appt.patient}</strong> - {appt.treatment}</div>
                    </div>
                  )
                })}

                {/* Accessible overlays — booked appointments + 15-min available slot buttons */}
                {(() => {
                  const elements: React.ReactNode[] = []

                  // One overlay per booked appointment (full span, announces patient + treatment)
                  for (const [slot, appt] of Object.entries(booked)) {
                    const startHour = ex4SlotToHour(slot)
                    const endHour = startHour + ex4Duration(appt.treatment)
                    const top = (startHour - EX4_HOUR_START) * ROW_HEIGHT
                    const height = (endHour - startHour) * ROW_HEIGHT
                    elements.push(
                      <div
                        key={`booked-${slot}`}
                        tabIndex={0}
                        data-grid-overlay
                        aria-label={`${formatHour(startHour)} to ${formatHour(endHour)}, booked: ${appt.patient}, ${appt.treatment}`}
                        style={{ position: 'absolute', top, left: 0, right: 0, height, opacity: 0, zIndex: 3 }}
                        onFocus={() => setFocusedRange({ startHour, endHour })}
                        onBlur={() => setFocusedRange(null)}
                      />
                    )
                  }

                  // 15-min available slot buttons — only where treatment duration fits (Option C)
                  for (let h = EX4_HOUR_START; h < EX4_HOUR_END; h = Math.round((h + GRID_STEP) * 100) / 100) {
                    if (!isSlotNavigable(h)) continue
                    const top = (h - EX4_HOUR_START) * ROW_HEIGHT
                    const height = GRID_STEP * ROW_HEIGHT
                    const focusEndHour = Math.round((h + treatmentDur) * 100) / 100
                    elements.push(
                      <button
                        key={`avail-${h}`}
                        data-grid-overlay
                        aria-label={`${formatHour(h)}, available`}
                        style={{ position: 'absolute', top, left: 0, right: 0, height, opacity: 0, cursor: 'pointer', border: 'none', background: 'none', zIndex: 3 }}
                        onClick={() => handleSlotClick(h)}
                        onFocus={() => setFocusedRange({ startHour: h, endHour: focusEndHour })}
                        onBlur={() => setFocusedRange(null)}
                      />
                    )
                  }

                  return elements
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {bookingHour !== null && (
        <NewAppointmentPanel
          practitioner={practitioner}
          time={bookingHour}
          availableUntil={bookingAvailableUntil ?? undefined}
          treatment={treatment}
          setTreatment={setTreatment}
          patient={patient}
          setPatient={setPatient}
          notes={notes}
          setNotes={setNotes}
          onClose={() => setBookingHour(null)}
          onBook={handleConfirmBook}
          onTimeChange={t => setBookingHour(t)}
        />
      )}

      {confirmedAppt && (
        <ConfirmedAppointmentPanel
          appt={confirmedAppt}
          onClose={() => setConfirmedAppt(null)}
        />
      )}
    </div>
  )
}

function ConfirmedAppointmentPanel({ appt, onClose }: {
  appt: { patient: string; staff: string; time: string; dateISO: string; treatment: string }
  onClose: () => void
}) {
  const TEAL = vars.global.color.brand['70']
  const [y, m, d] = appt.dateISO.split('-').map(Number)
  const dateLabel = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const TREATMENT_PRICES: Record<string, string> = {
    '30 Minute Massage': '$60.00',
    '45 Minute Massage': '$75.00',
    '60 Minute Massage': '$100.00',
    '90 Minute Massage': '$125.00',
  }

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-label={`Appointment booked for ${appt.patient} on ${dateLabel} at ${appt.time}`}
      style={{
        width: 320, flexShrink: 0, background: 'white',
        borderLeft: '1px solid #e2e2e2', display: 'flex', flexDirection: 'column',
        overflowY: 'auto', order: 3,
      }}>
      {/* Visually hidden announcement for screen readers */}
      <div role="status" aria-live="assertive" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        The appointment is booked with {appt.staff} for {appt.patient}, {appt.treatment}, on {dateLabel} at {appt.time}, successfully.
      </div>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e2e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Appointment booked</span>
        <button ref={closeRef} onClick={onClose} aria-label="Close appointment panel" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666', lineHeight: 1 }}>✕</button>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #e2e2e2', display: 'flex', gap: 8 }}>
        <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Arrive</button>
        <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>No Show</button>
        <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Pay</button>
      </div>

      {/* Booking Info */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e2e2' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, marginBottom: 10 }}>Booking Info</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{appt.patient}</div>
        <div style={{ fontSize: 13, color: '#555', lineHeight: 1.9 }}>
          <div style={{ color: TEAL, marginBottom: 2 }}>{appt.patient.toLowerCase().replace(' ', '.') + '@example.com'}</div>
          <div style={{ fontWeight: 600, color: '#444' }}>{dateLabel}</div>
          <div style={{ fontWeight: 600, color: '#444' }}>{appt.time}</div>
          <div>The Village</div>
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{appt.treatment}</div>
          <div style={{ fontSize: 13, color: '#555' }}>{TREATMENT_PRICES[appt.treatment] ?? '$60.00'}</div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{appt.staff}</div>
        </div>
      </div>

      {/* Secondary actions */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #e2e2e2', display: 'flex', gap: 8 }}>
        <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Copy</button>
        <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Move</button>
        <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #ccc', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#c0392b' }}>Cancel/Delete</button>
      </div>

      {/* Collapsible sections */}
      {['Notes', 'Billing Info', 'Insurance Info', 'Return Visit Reminders', 'History & Status'].map(section => (
        <div key={section} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEAL }}>{section}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke={TEAL} strokeWidth="1.8"><path d="M1 1l4 4 4-4"/></svg>
        </div>
      ))}
    </aside>
  )
}

function SparkleIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M6 1l1.1 3.1L10 5l-2.9 1-1.1 3-1.1-3L2 5l2.9-.9z" fill={color}/>
    </svg>
  )
}

const DATE_SLOTS: Record<string, string[]> = {
  '2026-07-13': ['9:00 AM', '9:30 AM', '11:00 AM', '2:00 PM', '4:30 PM'],
  '2026-07-14': ['8:30 AM', '10:00 AM', '1:30 PM', '3:00 PM', '5:00 PM'],
  '2026-07-15': ['9:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'],
  '2026-07-16': ['8:00 AM', '10:30 AM', '1:00 PM', '3:30 PM'],
  '2026-07-17': ['9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM', '5:30 PM'],
  '2026-07-18': ['8:30 AM', '10:00 AM', '12:00 PM', '3:00 PM'],
  '2026-07-19': ['9:00 AM', '11:00 AM', '1:30 PM', '4:00 PM'],
  '2026-07-20': ['10:00 AM', '2:00 PM', '4:30 PM'],
  '2026-07-21': ['9:00 AM', '10:30 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
  '2026-07-22': ['8:30 AM', '11:00 AM', '2:30 PM', '4:00 PM'],
}

function formatDateLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function ScheduleSidebar({ onBook }: { onBook?: (staff: string, time: string, dateISO: string, patient: string, treatment: string) => void }) {
  const TEAL = vars.global.color.brand['70']
  const [query, setQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [pickedDate, setPickedDate] = useState('')
  const [pickedSlot, setPickedSlot] = useState<string | null>(null)
  const [dropdownActiveIndex, setDropdownActiveIndex] = useState(-1)
  const [suggestionsOpen, setSuggestionsOpen] = useState(true)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = query.length > 0 && !selectedPatient
    ? PATIENTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const suggestions = selectedPatient ? AI_SUGGESTIONS[selectedPatient] ?? [] : []
  const dateSlots = pickedDate ? DATE_SLOTS[pickedDate] ?? [] : []

  const handleSelectPatient = (name: string) => {
    setSelectedPatient(name)
    setQuery(name)
    setSelectedSlot(null)
    setShowDatePicker(false)
    setPickedDate('')
    setPickedSlot(null)
    setDropdownActiveIndex(-1)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(dropdownActiveIndex + 1, filtered.length - 1)
      setDropdownActiveIndex(next)
      ;(dropdownRef.current?.children[next] as HTMLElement)?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (dropdownActiveIndex <= 0) {
        setDropdownActiveIndex(-1)
        searchRef.current?.focus()
      } else {
        const prev = dropdownActiveIndex - 1
        setDropdownActiveIndex(prev)
        ;(dropdownRef.current?.children[prev] as HTMLElement)?.focus()
      }
    } else if (e.key === 'Escape') {
      setDropdownActiveIndex(-1)
      setQuery('')
    }
  }

  // Convert "Mon, Jul 13" → "2026-07-11" (all suggestions are in July 2026)
  const MONTH_MAP: Record<string, string> = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' }
  function suggestionDateToISO(dateStr: string) {
    const parts = dateStr.split(', ')[1]?.split(' ') // ["Jul", "11"]
    if (!parts) return '2026-07-01'
    return `2026-${MONTH_MAP[parts[0]]}-${String(parts[1]).padStart(2, '0')}`
  }

  return (
    <aside style={{
      width: 240, background: 'white', borderRight: '1px solid #e2e2e2',
      display: 'flex', flexDirection: 'column', flexShrink: 0, order: 1,
      overflowY: 'auto',
    }}>
      {/* Patient search — top */}
      <div style={{ padding: 12, borderBottom: '1px solid #eee', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#f5f5f5', borderRadius: 4, padding: '7px 10px',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#999" strokeWidth="1.5">
              <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5L13 13"/>
            </svg>
            <input
              id="patient-search-input"
              ref={searchRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedPatient(null); setSelectedSlot(null); setDropdownActiveIndex(-1) }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Patient Search..."
              aria-label="Search patient"
              aria-autocomplete="list"
              aria-controls="patient-dropdown"
              aria-expanded={filtered.length > 0}
              role="combobox"
              style={{ border: 'none', background: 'transparent', fontSize: 13, flex: 1, fontFamily: 'inherit' }}
            />
            {query.length > 0 && (
              <button onClick={() => { setQuery(''); setSelectedPatient(null); setSelectedSlot(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#999', fontSize: 14, lineHeight: 1 }}>✕</button>
            )}
          </div>
          {filtered.length > 0 && (
            <div
              id="patient-dropdown"
              ref={dropdownRef}
              style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                background: 'white', border: '1px solid #e0e0e0', borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden',
              }} role="listbox">
              {filtered.map((p, idx) => (
                <button key={p.name} role="option"
                  tabIndex={-1}
                  onClick={() => handleSelectPatient(p.name)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectPatient(p.name) }
                    else if (e.key === 'ArrowDown') { e.preventDefault(); const next = Math.min(idx + 1, filtered.length - 1); setDropdownActiveIndex(next); (dropdownRef.current?.children[next] as HTMLElement)?.focus() }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); if (idx === 0) { setDropdownActiveIndex(-1); searchRef.current?.focus() } else { const prev = idx - 1; setDropdownActiveIndex(prev); (dropdownRef.current?.children[prev] as HTMLElement)?.focus() } }
                    else if (e.key === 'Escape') { setDropdownActiveIndex(-1); searchRef.current?.focus() }
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', fontSize: 13, fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  onFocus={e => (e.currentTarget.style.background = '#f0fafa')}
                  onBlur={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{p.detail}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI suggested times — right below search */}
      {selectedPatient && suggestions.length > 0 && (
        <div style={{ padding: '12px 12px 0', borderBottom: '1px solid #eee', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: suggestionsOpen ? 6 : 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>Suggested times</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, color: TEAL }}>
              <SparkleIcon color={TEAL} /> AI
            </span>
            <button
              onClick={() => setSuggestionsOpen(o => !o)}
              aria-expanded={suggestionsOpen}
              aria-label={suggestionsOpen ? 'Hide suggested times' : 'Show suggested times'}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 13, padding: '0 2px', lineHeight: 1 }}
            >
              {suggestionsOpen ? '✕' : '▾'}
            </button>
          </div>
          {suggestionsOpen && <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
            Based on {selectedPatient.split(' ')[0]}'s {PATIENT_TREATMENTS[selectedPatient] ?? '30 Minute Massage'} history with Susan Lo
          </div>}
          {suggestionsOpen && <><div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }} role="listbox" aria-label="Suggested times">
            {suggestions.map((s, i) => {
              const isSelected = selectedSlot === s.date + s.time
              const slotKey = s.date + s.time
              return (
                <button key={i} role="option" aria-selected={isSelected}
                  aria-label={`${s.date} at ${s.time}, ${s.label}. Press Enter to book.`}
                  onClick={() => {
                    if (isSelected) {
                      onBook?.('Susan Lo', s.time, suggestionDateToISO(s.date), selectedPatient ?? '', PATIENT_TREATMENTS[selectedPatient ?? ''] ?? '30 Minute Massage')
                    } else {
                      setSelectedSlot(slotKey)
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onBook?.('Susan Lo', s.time, suggestionDateToISO(s.date), selectedPatient ?? '', PATIENT_TREATMENTS[selectedPatient ?? ''] ?? '30 Minute Massage')
                    }
                  }}
                  style={{
                    textAlign: 'left', padding: '9px 10px', borderRadius: 6, cursor: 'pointer',
                    border: isSelected ? `2px solid ${TEAL}` : '2px solid #e8e8e8',
                    background: isSelected ? '#f0fafa' : s.match === 'best' ? '#f7fffe' : 'white',
                    fontFamily: 'inherit',
                  }}
                >
                  {s.match === 'best' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
                      <SparkleIcon color={TEAL} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Best match</span>
                    </div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{s.date} · {s.time}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{s.label}</div>
                  {isSelected && (
                    <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, marginTop: 4 }}>Press Enter to book →</div>
                  )}
                </button>
              )
            })}
          </div>
          {/* Choose a different time */}
          {!showDatePicker && (
            <button onClick={() => { setShowDatePicker(true); setSelectedSlot(null) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, color: TEAL, fontWeight: 600, padding: '0 0 12px', textDecoration: 'underline',
              }}>
              Choose a different time
            </button>
          )}

          {/* Date picker */}
          {showDatePicker && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#444' }}>Pick a date</span>
                <button onClick={() => { setShowDatePicker(false); setPickedDate(''); setPickedSlot(null) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#888', fontFamily: 'inherit' }}>
                  Back to suggestions
                </button>
              </div>
              <input
                type="date"
                min="2026-07-13"
                max="2026-07-31"
                value={pickedDate}
                onChange={e => { setPickedDate(e.target.value); setPickedSlot(null) }}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                  border: '1px solid #d0d0d0', borderRadius: 6, fontSize: 13,
                  fontFamily: 'inherit', marginBottom: 8,
                }}
              />
              {pickedDate && dateSlots.length === 0 && (
                <div style={{ fontSize: 12, color: '#888', textAlign: 'center', padding: '8px 0' }}>
                  No availability on {formatDateLabel(pickedDate)}
                </div>
              )}
              {pickedDate && dateSlots.length > 0 && (
                <>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
                    Available with Susan Lo on {formatDateLabel(pickedDate)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dateSlots.map(t => {
                      const isSelected = pickedSlot === t
                      return (
                        <button key={t}
                          onClick={() => setPickedSlot(t)}
                          style={{
                            textAlign: 'left', padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                            border: isSelected ? `2px solid ${TEAL}` : '2px solid #e8e8e8',
                            background: isSelected ? '#f0fafa' : 'white',
                            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                          }}>
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
              {pickedSlot && (
                <button onClick={() => onBook?.('Susan Lo', pickedSlot, pickedDate, selectedPatient ?? '', PATIENT_TREATMENTS[selectedPatient ?? ''] ?? '30 Minute Massage')} style={{
                  width: '100%', marginTop: 10, marginBottom: 4, padding: '9px 0',
                  background: TEAL, color: 'white', border: 'none',
                  borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Book appointment
                </button>
              )}
            </div>
          )}

          {selectedSlot && !showDatePicker && (() => {
            const s = suggestions.find(s => s.date + s.time === selectedSlot)
            return s ? (
              <button onClick={() => onBook?.('Susan Lo', s.time, suggestionDateToISO(s.date), selectedPatient ?? '', PATIENT_TREATMENTS[selectedPatient ?? ''] ?? '30 Minute Massage')} style={{
                width: '100%', marginBottom: 12, padding: '9px 0',
                background: TEAL, color: 'white', border: 'none',
                borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Book appointment
              </button>
            ) : null
          })()}
          {/* Visually hidden live region for screen reader booking confirmation prompt */}
          <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
            {selectedSlot ? `Time selected. Press Enter on the highlighted slot to book, or Tab to see other suggestions.` : ''}
          </div>
          </>}
        </div>
      )}

      {/* Location + staff filters */}
      <div style={{ borderBottom: '1px solid #eee', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', padding: '10px 0 4px', fontSize: 13, color: TEAL, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          The Village
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke={TEAL} strokeWidth="1.5"><path d="M1 1l3 3 3-3"/></svg>
        </div>
        <div style={{ textAlign: 'center', padding: '4px 0 10px', fontSize: 13, color: '#444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          All Staff
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="#666" strokeWidth="1.5"><path d="M1 1l3 3 3-3"/></svg>
        </div>
      </div>

      {/* Staff list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {STAFF.map(s => {
          const [first, ...rest] = s.name.split(' ')
          const last = rest.join(' ')
          return (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderBottom: '1px solid #f3f3f3', cursor: 'pointer',
            }}>
              <Avatar initials={s.initials} size={28} />
              <Text size="sm" style={{ flex: 1 }}>{first} <strong>{last}</strong></Text>
            </div>
          )
        })}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #eee', flexShrink: 0 }}>
        <Button>Break</Button>
      </div>
    </aside>
  )
}

/* ─────────────────────────────────────────────────────────────────
 *  Small reusable bits
 * ───────────────────────────────────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: 'white', border: '1px solid #e2e2e2', borderRadius: 6, overflow: 'hidden' }}>{children}</div>
}

function ProfileTab({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? vars.global.color.brand['70'] : 'transparent',
        color: active ? 'white' : vars.global.color.brand['70'],
        border: 'none', fontFamily: 'inherit', fontSize: 13,
        padding: '6px 10px', borderRadius: 4, cursor: 'pointer',
        fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
      }}
    >{children}</button>
  )
}

function EditTab({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button style={{
      background: active ? vars.global.color.brand['70'] : 'transparent',
      color: active ? 'white' : vars.global.color.brand['70'],
      border: 'none', fontFamily: 'inherit', fontSize: 13,
      padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
      fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
    }}>{children}</button>
  )
}

function ProfileRow({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'flex-start',
      padding: '12px 16px', borderBottom: '1px solid #f0f0f0', gap: 12,
    }}>
      <Text size="sm" style={{ color: '#444', fontWeight: 600 }}>{label}</Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {icon}{children}
      </div>
    </div>
  )
}

function Pill({ text, tone }: { text: string; tone: 'grey' | 'green' | 'yellow' }) {
  const colors = {
    grey:   { bg: '#e4e4e4', fg: '#555' },
    green:  { bg: '#cfe6d4', fg: '#2c6c4a' },
    yellow: { bg: '#fce7a0', fg: '#7a5a00' },
  }[tone]
  return (
    <span style={{
      background: colors.bg, color: colors.fg,
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
    }}>{text}</span>
  )
}

function HelpIcon() {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: '50%', background: '#333', color: 'white',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
    }}>?</span>
  )
}
function HomeIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="#444"><path d="M7 1L0 7h2v6h3V9h4v4h3V7h2z"/></svg>
}
function MobileIcon() {
  return <svg width="10" height="14" viewBox="0 0 10 14" fill="#444"><rect x="1" y="0.5" width="8" height="13" rx="1.5" fill="none" stroke="#444"/><circle cx="5" cy="11" r="0.8"/></svg>
}
function ExternalLinkIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2H2v8h8V7M7 1h4v4M11 1L6 6"/></svg>
}
function GoogleCalendarIcon() {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 4, background: 'white',
      border: '1px solid #ddd', position: 'relative',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, color: '#4285F4',
    }}>31</div>
  )
}
