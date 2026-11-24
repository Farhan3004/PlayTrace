import type { Sport } from './athletes'

export type Opportunity = {
  id: string
  title: string
  org: string
  category: 'Trials' | 'Scholarship' | 'Sponsorship' | 'Pro Contract' | 'Coaching' | 'Internship' | 'Esports Roster'
  sport: Sport | 'Any'
  location: string
  deadline: string
  value: string
  applicants: number
  match: number
  summary: string
  eligibility: string[]
  requirements: string[]
  process: string[]
}

export const opportunities: Opportunity[] = [
  { id: 'blaze-trials', title: 'Women\u2019s Senior Roster Trials', org: 'Bengaluru Blaze', category: 'Trials', sport: 'Basketball', location: 'Bengaluru', deadline: '2026-11-30', value: 'Pro contract pathway', applicants: 148, match: 94, summary: 'Two-day open trials for three senior roster spots ahead of the 2027 Pro Basketball League season.', eligibility: ['Women aged 18\u201330', 'State-level experience or higher', 'Minimum 3 verified achievements on PLAYTRACE'], requirements: ['Verified PLAYTRACE profile', 'Highlight reel (max 5 min)', 'Medical fitness certificate'], process: ['Application screening', 'Two-day trial camp', 'Coach interviews', 'Offers issued'] },
  { id: 'reliance-scholarship', title: 'Elite Athlete Scholarship 2027', org: 'Reliance Foundation', category: 'Scholarship', sport: 'Any', location: 'Pan-India', deadline: '2026-12-15', value: '\u20b94,00,000 / year', applicants: 2310, match: 88, summary: 'Full tuition, training support and sports science access for national-level student athletes.', eligibility: ['Enrolled in an Indian university', 'National-level medal in last 24 months', 'Family income under \u20b915L p.a.'], requirements: ['Verified achievements', 'Academic transcript', 'Statement of purpose'], process: ['Online application', 'Panel review', 'Interview', 'Award'] },
  { id: 'vanta-sub', title: 'BGMI Academy Sub Roster', org: 'Team Vanta Esports', category: 'Esports Roster', sport: 'BGMI', location: 'Mumbai (bootcamp)', deadline: '2026-11-25', value: '\u20b960,000 / month', applicants: 920, match: 81, summary: 'Two academy spots with a structured pathway to the main BGIS roster.', eligibility: ['Age 16+ (guardian consent under 18)', 'Tier 2 scrim experience', 'K/D above 3.5 in ranked'], requirements: ['Verified tournament history', 'POV VODs (2)', 'Device specs'], process: ['VOD review', 'Online scrims', 'Bootcamp week', 'Contract'] },
  { id: 'nivia-sponsor', title: 'Grassroots Athlete Sponsorship', org: 'Nivia Sports', category: 'Sponsorship', sport: 'Football', location: 'Pan-India', deadline: '2027-01-10', value: 'Kit + \u20b91,50,000', applicants: 640, match: 76, summary: 'Annual kit and stipend support for 25 emerging footballers with strong community presence.', eligibility: ['Age 16\u201323', 'State-level or above', 'Active PLAYTRACE community profile'], requirements: ['Verified profile', 'Social reach summary'], process: ['Application', 'Shortlist', 'Content brief', 'Agreement'] },
  { id: 'ksa-u19', title: 'U-19 Residential Academy Intake', org: 'Kerala Strikers Academy', category: 'Trials', sport: 'Football', location: 'Kochi', deadline: '2026-12-20', value: 'Full residential scholarship', applicants: 410, match: 90, summary: 'Residential academy places for U-19 players with education support and ISL reserve pathway.', eligibility: ['Born on or after 1 Jan 2008', 'District-level selection or higher'], requirements: ['Highlight reel', 'School records', 'Medical certificate'], process: ['Showcase event', 'Trial week', 'Selection'] },
  { id: 'gopichand-coach', title: 'Assistant Coach \u2014 Junior Programme', org: 'Gopichand Academy', category: 'Coaching', sport: 'Badminton', location: 'Hyderabad', deadline: '2026-12-05', value: '\u20b98\u201312 LPA', applicants: 86, match: 62, summary: 'Lead daily sessions for the U-15 high-performance group.', eligibility: ['BWF Level 1 or NIS certification', 'Former state-level player'], requirements: ['Coaching certificates', 'References (2)'], process: ['Screening', 'On-court session', 'Interview'] },
  { id: 'pt-internship', title: 'Sports Analytics Intern', org: 'PLAYTRACE Labs', category: 'Internship', sport: 'Any', location: 'Remote / Bengaluru', deadline: '2026-12-31', value: '\u20b935,000 / month', applicants: 1204, match: 58, summary: 'Work with the performance data team building scouting models across five sports.', eligibility: ['Final-year student or graduate', 'Python or SQL'], requirements: ['CV', 'Portfolio or GitHub'], process: ['Take-home task', 'Technical interview', 'Offer'] },
  { id: 'pkl-contract', title: 'Development Player Contract', org: 'Jaipur Pink Panthers', category: 'Pro Contract', sport: 'Kabaddi', location: 'Jaipur', deadline: '2026-12-10', value: '\u20b910 LPA', applicants: 230, match: 71, summary: 'Two development contracts for raiders and defenders under 23.', eligibility: ['Under 23', 'State-level team member'], requirements: ['Verified match stats', 'Fitness test results'], process: ['Combine', 'Trials', 'Contract'] },
]

export type Competition = {
  id: string
  name: string
  sport: Sport
  stage: string
  status: 'Live' | 'Upcoming' | 'Completed'
  teams: number
  prize: string
  image: string
  leaderboard: { rank: number; name: string; played: number; won: number; points: number; form: ('W' | 'L' | 'D')[] }[]
  bracket: { round: string; matches: { a: string; b: string; sa?: number; sb?: number; live?: boolean }[] }[]
}

export const competitions: Competition[] = [
  {
    id: 'pbl-2026',
    name: 'South Zone Hoops Invitational',
    sport: 'Basketball',
    stage: 'Quarter-finals',
    status: 'Live',
    teams: 8,
    prize: '\u20b95,00,000',
    image: '/images/hero-arena.png',
    leaderboard: [
      { rank: 1, name: 'Bengaluru Blaze', played: 6, won: 6, points: 12, form: ['W', 'W', 'W', 'W', 'W'] },
      { rank: 2, name: 'Chennai Heat', played: 6, won: 5, points: 10, form: ['W', 'W', 'L', 'W', 'W'] },
      { rank: 3, name: 'Kochi Tide', played: 6, won: 4, points: 8, form: ['L', 'W', 'W', 'W', 'L'] },
      { rank: 4, name: 'Hyderabad Hawks', played: 6, won: 3, points: 6, form: ['W', 'L', 'W', 'L', 'W'] },
      { rank: 5, name: 'Mysuru Royals', played: 6, won: 2, points: 4, form: ['L', 'L', 'W', 'L', 'W'] },
      { rank: 6, name: 'Vizag Waves', played: 6, won: 0, points: 0, form: ['L', 'L', 'L', 'L', 'L'] },
    ],
    bracket: [
      { round: 'Quarter-finals', matches: [ { a: 'Bengaluru Blaze', b: 'Vizag Waves', sa: 88, sb: 61 }, { a: 'Hyderabad Hawks', b: 'Kochi Tide', sa: 72, sb: 70 }, { a: 'Chennai Heat', b: 'Mysuru Royals', sa: 54, sb: 49, live: true }, { a: 'Madurai Mavericks', b: 'Goa Gulls' } ] },
      { round: 'Semi-finals', matches: [ { a: 'Bengaluru Blaze', b: 'Hyderabad Hawks' }, { a: 'TBD', b: 'TBD' } ] },
      { round: 'Final', matches: [ { a: 'TBD', b: 'TBD' } ] },
    ],
  },
  {
    id: 'bgmi-clash',
    name: 'BGMI Campus Clash S3',
    sport: 'BGMI',
    stage: 'Regional Qualifiers',
    status: 'Live',
    teams: 16,
    prize: '\u20b915,00,000',
    image: '/images/event-esports.png',
    leaderboard: [
      { rank: 1, name: 'IIT Bombay Phantoms', played: 12, won: 3, points: 148, form: ['W', 'D', 'W', 'D', 'W'] },
      { rank: 2, name: 'VIT Vortex', played: 12, won: 2, points: 131, form: ['D', 'W', 'D', 'W', 'D'] },
      { rank: 3, name: 'Amity Apex', played: 12, won: 2, points: 119, form: ['W', 'D', 'D', 'D', 'W'] },
      { rank: 4, name: 'SRM Spectre', played: 12, won: 1, points: 104, form: ['D', 'D', 'W', 'D', 'D'] },
      { rank: 5, name: 'DU Dominators', played: 12, won: 1, points: 97, form: ['D', 'W', 'D', 'D', 'L'] },
      { rank: 6, name: 'NMIMS Nomads', played: 12, won: 0, points: 82, form: ['L', 'D', 'D', 'L', 'D'] },
    ],
    bracket: [
      { round: 'Regional', matches: [ { a: 'West \u2014 Top 4', b: 'South \u2014 Top 4' }, { a: 'North \u2014 Top 4', b: 'East \u2014 Top 4' } ] },
      { round: 'LAN Finals', matches: [ { a: '16 squads', b: '12 matches' } ] },
    ],
  },
  {
    id: 'hyd-open',
    name: 'Hyderabad Open \u2014 WS',
    sport: 'Badminton',
    stage: 'Semi-finals',
    status: 'Live',
    teams: 32,
    prize: '\u20b93,00,000',
    image: '/images/event-badminton.png',
    leaderboard: [
      { rank: 1, name: 'Meera Iyer', played: 4, won: 4, points: 400, form: ['W', 'W', 'W', 'W'] },
      { rank: 2, name: 'Sana Qureshi', played: 4, won: 4, points: 400, form: ['W', 'W', 'W', 'W'] },
      { rank: 3, name: 'Ritika Bose', played: 4, won: 4, points: 400, form: ['W', 'W', 'W', 'W'] },
      { rank: 4, name: 'Aarohi Patil', played: 4, won: 4, points: 400, form: ['W', 'W', 'W', 'W'] },
    ],
    bracket: [
      { round: 'Quarter-finals', matches: [ { a: 'Meera Iyer', b: 'Kavya N.', sa: 2, sb: 0 }, { a: 'Ritika Bose', b: 'Divya S.', sa: 2, sb: 1 }, { a: 'Sana Qureshi', b: 'Ishita M.', sa: 2, sb: 0 }, { a: 'Aarohi Patil', b: 'Neha G.', sa: 2, sb: 1 } ] },
      { round: 'Semi-finals', matches: [ { a: 'Meera Iyer', b: 'Ritika Bose', sa: 1, sb: 0, live: true }, { a: 'Sana Qureshi', b: 'Aarohi Patil' } ] },
      { round: 'Final', matches: [ { a: 'TBD', b: 'TBD' } ] },
    ],
  },
  {
    id: 'kerala-league',
    name: 'Kerala Youth League',
    sport: 'Football',
    stage: 'Matchday 9',
    status: 'Upcoming',
    teams: 10,
    prize: 'Academy trials',
    image: '/images/event-stadium.png',
    leaderboard: [
      { rank: 1, name: 'KSA U-19', played: 8, won: 6, points: 20, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 2, name: 'Gokulam Youth', played: 8, won: 5, points: 17, form: ['W', 'L', 'W', 'W', 'D'] },
      { rank: 3, name: 'Thrissur FC', played: 8, won: 4, points: 14, form: ['D', 'W', 'L', 'W', 'D'] },
      { rank: 4, name: 'Malabar United', played: 8, won: 3, points: 11, form: ['L', 'D', 'W', 'L', 'W'] },
    ],
    bracket: [{ round: 'League phase', matches: [{ a: 'KSA U-19', b: 'Thrissur FC' }, { a: 'Gokulam Youth', b: 'Malabar United' }] }],
  },
]

export type Volunteer = {
  id: string
  name: string
  city: string
  skills: string[]
  languages: string[]
  hours: number
  rating: number
  events: number
  role: string
  status: 'Confirmed' | 'Invited' | 'Applied' | 'Checked in' | 'On break'
  safeguarding: boolean
  badges: string[]
  initials: string
}

const v = (p: Omit<Volunteer, 'initials'>): Volunteer => ({ ...p, initials: p.name.split(' ').map((w) => w[0]).join('') })

export const volunteers: Volunteer[] = [
  v({ id: 'v1', name: 'Isha Kulkarni', city: 'Bengaluru', skills: ['Crowd management', 'First aid'], languages: ['English', 'Kannada'], hours: 214, rating: 4.9, events: 18, role: 'Zone Lead', status: 'Checked in', safeguarding: true, badges: ['Safeguarding', 'First Aid', '200+ hrs'] }),
  v({ id: 'v2', name: 'Rahul Bhat', city: 'Bengaluru', skills: ['Scoring', 'Stats'], languages: ['English', 'Hindi'], hours: 96, rating: 4.7, events: 9, role: 'Table Official', status: 'Checked in', safeguarding: true, badges: ['FIBA Table', 'Safeguarding'] }),
  v({ id: 'v3', name: 'Fatima Sheikh', city: 'Mysuru', skills: ['Medical', 'Physio'], languages: ['English', 'Urdu', 'Kannada'], hours: 180, rating: 5.0, events: 14, role: 'Medical Support', status: 'Confirmed', safeguarding: true, badges: ['Physio', 'First Aid'] }),
  v({ id: 'v4', name: 'Karthik Raman', city: 'Chennai', skills: ['Media', 'Photography'], languages: ['English', 'Tamil'], hours: 64, rating: 4.6, events: 6, role: 'Media Crew', status: 'On break', safeguarding: false, badges: ['Media'] }),
  v({ id: 'v5', name: 'Pooja Das', city: 'Bengaluru', skills: ['Accreditation', 'Registration desk'], languages: ['English', 'Bengali', 'Hindi'], hours: 132, rating: 4.8, events: 12, role: 'Accreditation', status: 'Checked in', safeguarding: true, badges: ['Safeguarding', '100+ hrs'] }),
  v({ id: 'v6', name: 'Neil Fernandes', city: 'Goa', skills: ['Logistics', 'Driving'], languages: ['English', 'Konkani'], hours: 48, rating: 4.5, events: 4, role: 'Transport', status: 'Invited', safeguarding: false, badges: [] }),
  v({ id: 'v7', name: 'Ayesha Rahman', city: 'Bengaluru', skills: ['Hospitality', 'Athlete liaison'], languages: ['English', 'Hindi', 'Urdu'], hours: 88, rating: 4.9, events: 8, role: 'Athlete Liaison', status: 'Confirmed', safeguarding: true, badges: ['Safeguarding'] }),
  v({ id: 'v8', name: 'Varun Gowda', city: 'Bengaluru', skills: ['Crowd management'], languages: ['Kannada', 'English'], hours: 12, rating: 4.3, events: 1, role: 'Usher', status: 'Applied', safeguarding: false, badges: ['New'] }),
]

export const shifts = [
  { id: 's1', role: 'Accreditation desk', zone: 'Gate A', time: '07:00 \u2013 12:00', needed: 6, filled: 6 },
  { id: 's2', role: 'Court-side table officials', zone: 'Courts 1\u20134', time: '09:30 \u2013 18:00', needed: 8, filled: 7 },
  { id: 's3', role: 'Medical support', zone: 'Medical bay', time: '08:00 \u2013 20:00', needed: 4, filled: 4 },
  { id: 's4', role: 'Crowd & ushering', zone: 'Stands N/S', time: '16:00 \u2013 21:30', needed: 14, filled: 9 },
  { id: 's5', role: 'Athlete liaison', zone: 'Team rooms', time: '08:00 \u2013 16:00', needed: 5, filled: 3 },
  { id: 's6', role: 'Media crew', zone: 'Media tribune', time: '17:00 \u2013 22:00', needed: 4, filled: 2 },
]

export type Post = {
  id: string
  author: string
  role: string
  sport: Sport | 'General'
  time: string
  kind: 'Result' | 'Training' | 'Looking for team' | 'Question' | 'Milestone'
  body: string
  likes: number
  comments: number
  verified?: boolean
  initials: string
}

const p = (x: Omit<Post, 'initials'>): Post => ({ ...x, initials: x.author.replace(/\u201c.*\u201d/, '').split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('') })

export const posts: Post[] = [
  p({ id: 'p1', author: 'Meera Iyer', role: 'Badminton \u00b7 Elite', sport: 'Badminton', time: '2h', kind: 'Result', body: 'Through to the semis at the Hyderabad Open. 21-14, 21-17 today. Tomorrow I face Ritika again \u2014 last time went to three. Ready.', likes: 2840, comments: 214, verified: true }),
  p({ id: 'p2', author: 'Bengaluru Blaze', role: 'Team \u00b7 Pro League', sport: 'Basketball', time: '4h', kind: 'Looking for team', body: 'Open trials for 3 senior roster spots are live. Point guards and wings with verified state-level experience \u2014 apply through Opportunities. Trials on 6\u20137 Dec.', likes: 1120, comments: 96, verified: true }),
  p({ id: 'p3', author: 'Kabir \u201cViper\u201d Shah', role: 'BGMI \u00b7 IGL', sport: 'BGMI', time: '6h', kind: 'Training', body: 'Scrim block today was all about late-zone edge play on Miramar. 4 hours, 18 matches, 6 chicken dinners. Comms clip in my profile.', likes: 9420, comments: 612, verified: true }),
  p({ id: 'p4', author: 'Coach Swathi Reddy', role: 'Coach \u00b7 Badminton', sport: 'Badminton', time: '9h', kind: 'Question', body: 'Coaches: how are you structuring recovery for juniors playing 3 tournaments a month? Sharing our periodisation template below \u2014 would love feedback.', likes: 380, comments: 72 }),
  p({ id: 'p5', author: 'Arjun Menon', role: 'Football \u00b7 National', sport: 'Football', time: '1d', kind: 'Milestone', body: 'Called up to the U-21 national camp. Five years of 5am sessions on the Fort Kochi ground. Thank you to everyone at KSA.', likes: 6210, comments: 488, verified: true }),
  p({ id: 'p6', author: 'Tanvi Joshi', role: 'Valorant \u00b7 Duelist', sport: 'Valorant', time: '1d', kind: 'Looking for team', body: 'Immortal 3 duelist looking for a competitive women\u2019s roster for the upcoming Campus Clash. Pune-based, available evenings.', likes: 240, comments: 38 }),
]

export const groups = [
  { name: 'Karnataka Hoops Network', members: 4820, sport: 'Basketball' },
  { name: 'Women in Football India', members: 12400, sport: 'Football' },
  { name: 'BGMI Competitive Scene', members: 48100, sport: 'BGMI' },
  { name: 'Junior Badminton Parents', members: 3210, sport: 'Badminton' },
  { name: 'Sports Volunteers India', members: 8900, sport: 'General' },
]

export const notifications = [
  { id: 'n1', title: 'Achievement verified', body: 'KIUG 2024 MVP was verified by BFI.', time: '12m', unread: true, kind: 'verify' },
  { id: 'n2', title: 'New opportunity match', body: 'Bengaluru Blaze trials \u2014 94% profile match.', time: '1h', unread: true, kind: 'opportunity' },
  { id: 'n3', title: 'Scout viewed your profile', body: 'Priya Nair (Hoops India) viewed your profile.', time: '3h', unread: true, kind: 'scout' },
  { id: 'n4', title: 'Registration confirmed', body: 'South Zone Hoops Invitational \u2014 Team slot #27.', time: '1d', unread: false, kind: 'event' },
  { id: 'n5', title: 'Reviewer requested evidence', body: 'Add the official link for AIU assists leader.', time: '2d', unread: false, kind: 'verify' },
]

export const platformGrowth = [
  { month: 'Apr', athletes: 42, events: 120, verifications: 3.1 },
  { month: 'May', athletes: 51, events: 148, verifications: 4.4 },
  { month: 'Jun', athletes: 63, events: 171, verifications: 5.2 },
  { month: 'Jul', athletes: 78, events: 210, verifications: 6.9 },
  { month: 'Aug', athletes: 94, events: 248, verifications: 8.1 },
  { month: 'Sep', athletes: 118, events: 302, verifications: 10.4 },
  { month: 'Oct', athletes: 141, events: 356, verifications: 12.8 },
  { month: 'Nov', athletes: 168, events: 410, verifications: 15.6 },
]

export const sportMix = [
  { sport: 'Football', value: 31 },
  { sport: 'Cricket', value: 22 },
  { sport: 'Basketball', value: 14 },
  { sport: 'BGMI', value: 13 },
  { sport: 'Badminton', value: 11 },
  { sport: 'Other', value: 9 },
]
