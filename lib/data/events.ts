import type { Sport } from './athletes'

export type PTEvent = {
  id: string
  name: string
  sport: Sport | 'Multi-sport'
  format: string
  start: string
  end: string
  city: string
  venue: string
  image: string
  organiser: string
  fee: string
  prize: string
  capacity: number
  registered: number
  level: string
  status: 'Registration open' | 'Closing soon' | 'Live' | 'Completed' | 'Draft'
  summary: string
  categories: string[]
  schedule: { day: string; items: { time: string; title: string }[] }[]
  rules: string[]
  faq: { q: string; a: string }[]
  sponsors: string[]
}

export const events: PTEvent[] = [
  {
    id: 'south-zone-hoops',
    name: 'South Zone Hoops Invitational',
    sport: 'Basketball',
    format: '5v5 \u00b7 Group + Knockout',
    start: '2026-12-04',
    end: '2026-12-07',
    city: 'Bengaluru',
    venue: 'Kanteerava Indoor Stadium',
    image: '/images/hero-arena.png',
    organiser: 'Karnataka State Basketball Assoc.',
    fee: '\u20b96,000 / team',
    prize: '\u20b95,00,000',
    capacity: 32,
    registered: 27,
    level: 'Open \u00b7 Senior',
    status: 'Closing soon',
    summary: 'Thirty-two of the best men\u2019s and women\u2019s club teams from five southern states compete over four days. Every game is scouted and stat-tracked live on PLAYTRACE.',
    categories: ['Men\u2019s Senior', 'Women\u2019s Senior', 'U-19 Boys', 'U-19 Girls'],
    schedule: [
      { day: 'Day 1 \u00b7 Thu 4 Dec', items: [{ time: '08:00', title: 'Accreditation & kit check' }, { time: '10:00', title: 'Group stage \u2014 Rounds 1\u20132' }, { time: '18:00', title: 'Opening ceremony' }] },
      { day: 'Day 2 \u00b7 Fri 5 Dec', items: [{ time: '09:00', title: 'Group stage \u2014 Rounds 3\u20134' }, { time: '16:00', title: 'Scout showcase session' }] },
      { day: 'Day 3 \u00b7 Sat 6 Dec', items: [{ time: '10:00', title: 'Quarter-finals' }, { time: '17:00', title: 'Semi-finals' }] },
      { day: 'Day 4 \u00b7 Sun 7 Dec', items: [{ time: '15:00', title: 'Bronze medal games' }, { time: '18:30', title: 'Finals & awards' }] },
    ],
    rules: ['FIBA 2024 rules apply', 'Rosters of 12, locked 48 hours before tip-off', 'All players must hold a verified PLAYTRACE ID', 'Age proof required for U-19 categories'],
    faq: [
      { q: 'Is accommodation provided?', a: 'Partner hotels at subsidised rates are listed after registration. Outstation teams get priority.' },
      { q: 'Will games be streamed?', a: 'Centre-court games stream live; all games are filmed and clips are added to player profiles.' },
      { q: 'Can I register as an individual?', a: 'Individuals can join the free-agent pool; organisers match free agents with teams short on roster.' },
    ],
    sponsors: ['Nivia', 'Decathlon', 'Kotak'],
  },
  {
    id: 'bgmi-campus-clash',
    name: 'BGMI Campus Clash \u2014 Season 3',
    sport: 'BGMI',
    format: 'Squads \u00b7 Online qualifiers + LAN finals',
    start: '2026-12-12',
    end: '2027-01-18',
    city: 'Mumbai',
    venue: 'NSCI Dome (LAN finals)',
    image: '/images/event-esports.png',
    organiser: 'Campus Esports India',
    fee: 'Free',
    prize: '\u20b915,00,000',
    capacity: 1024,
    registered: 812,
    level: 'Collegiate',
    status: 'Registration open',
    summary: 'India\u2019s largest collegiate BGMI tournament. 1,024 squads, eight regional qualifiers and a two-day LAN finale with 16 teams.',
    categories: ['Squads (4 + 1 sub)'],
    schedule: [
      { day: 'Qualifiers \u00b7 12 Dec \u2013 4 Jan', items: [{ time: '18:00', title: 'Regional qualifiers (online)' }] },
      { day: 'LAN \u00b7 17 Jan', items: [{ time: '12:00', title: 'Grand Finals Day 1 \u2014 6 matches' }] },
      { day: 'LAN \u00b7 18 Jan', items: [{ time: '12:00', title: 'Grand Finals Day 2 \u2014 6 matches' }, { time: '20:00', title: 'Awards' }] },
    ],
    rules: ['All players must be enrolled students with valid ID', 'Anti-cheat client mandatory for qualifiers', 'Emulators not permitted', 'Points: placement + finishes (BGIS standard)'],
    faq: [{ q: 'Can a squad mix colleges?', a: 'No. All five players must be from the same institution.' }],
    sponsors: ['iQOO', 'Red Bull', 'Krafton India'],
  },
  {
    id: 'hyderabad-open-badminton',
    name: 'Hyderabad Open Ranking Series',
    sport: 'Badminton',
    format: 'Singles & Doubles \u00b7 Knockout',
    start: '2026-11-21',
    end: '2026-11-24',
    city: 'Hyderabad',
    venue: 'Gachibowli Indoor Stadium',
    image: '/images/event-badminton.png',
    organiser: 'Telangana Badminton Assoc.',
    fee: '\u20b91,200 / event',
    prize: '\u20b93,00,000',
    capacity: 512,
    registered: 512,
    level: 'Ranking \u00b7 BAI sanctioned',
    status: 'Live',
    summary: 'A BAI-sanctioned ranking event across 10 categories. Results feed directly into verified player profiles.',
    categories: ['MS', 'WS', 'MD', 'WD', 'XD', 'U-17', 'U-19'],
    schedule: [{ day: 'Day 1\u20134', items: [{ time: '08:00', title: 'Main draw on 12 courts' }] }],
    rules: ['BWF Laws of Badminton', 'Yonex AS-30 shuttles', 'Players report 30 minutes before match call'],
    faq: [{ q: 'Is there a qualifying round?', a: 'Qualifying runs on Day 1 morning for MS and WS only.' }],
    sponsors: ['Yonex', 'SBI'],
  },
  {
    id: 'kerala-u19-football',
    name: 'Kerala U-19 Football Showcase',
    sport: 'Football',
    format: '11-a-side \u00b7 Showcase matches',
    start: '2027-01-09',
    end: '2027-01-11',
    city: 'Kochi',
    venue: 'Jawaharlal Nehru Stadium',
    image: '/images/event-stadium.png',
    organiser: 'Kerala Strikers Academy',
    fee: '\u20b9800 / player',
    prize: 'Academy trials',
    capacity: 220,
    registered: 96,
    level: 'Youth \u00b7 U-19',
    status: 'Registration open',
    summary: 'Three days of positional showcase matches in front of ISL and I-League academy scouts. Top 20 performers earn academy trial invitations.',
    categories: ['GK', 'Defenders', 'Midfielders', 'Forwards'],
    schedule: [{ day: 'Day 1\u20133', items: [{ time: '07:00', title: 'Testing combine' }, { time: '15:30', title: 'Showcase matches' }] }],
    rules: ['Born on or after 1 Jan 2008', 'Medical fitness certificate required', 'Own boots and shin pads'],
    faq: [{ q: 'Which scouts attend?', a: 'Confirmed: 6 ISL academies, 4 I-League clubs, and the AIFF regional talent team.' }],
    sponsors: ['Puma', 'Federal Bank'],
  },
  {
    id: 'delhi-athletics-meet',
    name: 'Delhi State Athletics Meet',
    sport: 'Athletics',
    format: 'Track & Field',
    start: '2026-12-19',
    end: '2026-12-21',
    city: 'New Delhi',
    venue: 'Jawaharlal Nehru Stadium',
    image: '/images/event-track.png',
    organiser: 'Delhi State Athletics Assoc.',
    fee: '\u20b9500 / event',
    prize: 'Medals + Nationals quota',
    capacity: 900,
    registered: 640,
    level: 'State championship',
    status: 'Registration open',
    summary: 'The official qualifier for the National Open. Electronic timing, wind gauges and official results synced to athlete profiles.',
    categories: ['Sprints', 'Middle distance', 'Hurdles', 'Jumps', 'Throws'],
    schedule: [{ day: 'Day 1\u20133', items: [{ time: '07:30', title: 'Heats' }, { time: '16:00', title: 'Finals' }] }],
    rules: ['World Athletics technical rules', 'Max 3 individual events per athlete'],
    faq: [{ q: 'Is photo-finish timing used?', a: 'Yes, FAT timing on all track events.' }],
    sponsors: ['ASICS', 'NTPC'],
  },
  {
    id: 'national-sports-day-run',
    name: 'Playtrace Community Sports Festival',
    sport: 'Multi-sport',
    format: 'Open participation',
    start: '2027-02-01',
    end: '2027-02-02',
    city: 'Pune',
    venue: 'Balewadi Sports Complex',
    image: '/images/volunteers.png',
    organiser: 'PLAYTRACE Foundation',
    fee: 'Free',
    prize: 'Participation medals',
    capacity: 5000,
    registered: 2210,
    level: 'All ages',
    status: 'Registration open',
    summary: 'A two-day festival of 3v3 basketball, 5-a-side football, badminton doubles and a mobile esports zone. Built for first-timers and families.',
    categories: ['3v3 Basketball', '5-a-side', 'Badminton doubles', 'BGMI duos', '5K run'],
    schedule: [{ day: 'Day 1\u20132', items: [{ time: '06:30', title: '5K run' }, { time: '09:00', title: 'All zones open' }] }],
    rules: ['Under-14s need a guardian on site', 'Free registration, limited slots per zone'],
    faq: [{ q: 'Do I need a team?', a: 'No. Solo players are grouped on arrival.' }],
    sponsors: ['Decathlon', 'Pune Municipal Corp.'],
  },
]

export function getEvent(id: string) {
  return events.find((e) => e.id === id)
}
