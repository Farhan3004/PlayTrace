export type Sport = 'Basketball' | 'Football' | 'Badminton' | 'BGMI' | 'Athletics' | 'Cricket' | 'Valorant' | 'Kabaddi'

export type VerificationStatus = 'verified' | 'pending' | 'in-review' | 'rejected' | 'draft'

export type Achievement = {
  id: string
  athleteId: string
  title: string
  event: string
  date: string
  level: 'District' | 'State' | 'National' | 'International' | 'Collegiate' | 'Pro League'
  result: string
  status: VerificationStatus
  evidence: { type: 'certificate' | 'video' | 'scoresheet' | 'photo' | 'link'; label: string }[]
  verifiedBy?: string
  aiFlag?: string
}

export type Athlete = {
  id: string
  name: string
  handle: string
  sport: Sport
  position: string
  age: number
  city: string
  state: string
  club: string
  image: string
  cover: string
  bio: string
  traceScore: number
  verifiedCount: number
  followers: number
  availability: 'Open to trials' | 'Open to offers' | 'Signed' | 'Exploring'
  level: 'Elite' | 'National' | 'State' | 'Emerging'
  physicals: { label: string; value: string }[]
  stats: { label: string; value: string; delta?: string }[]
  skills: { skill: string; value: number }[]
  season: { month: string; value: number; avg: number }[]
  timeline: { year: string; title: string; detail: string }[]
  media: { title: string; type: 'Highlight' | 'Match' | 'Training'; duration: string; views: string }[]
  endorsements: { name: string; role: string; quote: string }[]
  education: string
  languages: string[]
}

const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

export const athletes: Athlete[] = [
  {
    id: 'ananya-rao',
    name: 'Ananya Rao',
    handle: '@ananya.hoops',
    sport: 'Basketball',
    position: 'Point Guard',
    age: 22,
    city: 'Bengaluru',
    state: 'Karnataka',
    club: 'Bengaluru Blaze',
    image: '/images/athlete-basketball.png',
    cover: '/images/hero-arena.png',
    bio: 'Floor general with elite court vision. Captained Karnataka to the 2025 Senior National semi-finals and led the Inter-University circuit in assists two seasons running.',
    traceScore: 912,
    verifiedCount: 14,
    followers: 18400,
    availability: 'Open to offers',
    level: 'National',
    physicals: [
      { label: 'Height', value: '5\u20199\u201d' },
      { label: 'Wingspan', value: '5\u201911\u201d' },
      { label: 'Vertical', value: '24 in' },
      { label: 'Dominant', value: 'Right' },
    ],
    stats: [
      { label: 'PPG', value: '17.4', delta: '+2.1' },
      { label: 'APG', value: '8.9', delta: '+1.3' },
      { label: 'SPG', value: '2.6', delta: '+0.4' },
      { label: 'FG%', value: '46.2', delta: '+3.0' },
    ],
    skills: [
      { skill: 'Vision', value: 94 },
      { skill: 'Handling', value: 90 },
      { skill: 'Shooting', value: 78 },
      { skill: 'Defence', value: 84 },
      { skill: 'Speed', value: 88 },
      { skill: 'Leadership', value: 96 },
    ],
    season: months.map((m, i) => ({ month: m, value: [14, 15.5, 16, 15, 18, 17.6, 19.2, 17.4][i], avg: 12 })),
    timeline: [
      { year: '2026', title: 'Bengaluru Blaze — Captain', detail: 'Named captain for the Pro Basketball League season.' },
      { year: '2025', title: 'Senior Nationals — Semi-finalist', detail: 'Karnataka state team, 19.1 PPG across 6 games.' },
      { year: '2024', title: 'Khelo India University Games — Gold', detail: 'Tournament MVP, Christ University.' },
      { year: '2022', title: 'Youth Nationals — Silver', detail: 'U-18 Karnataka, all-tournament team.' },
    ],
    media: [
      { title: 'Senior Nationals SF — Full highlights', type: 'Highlight', duration: '4:12', views: '42K' },
      { title: 'KIUG Final vs. Punjab', type: 'Match', duration: '1:38:20', views: '11K' },
      { title: 'Ball-handling series', type: 'Training', duration: '6:45', views: '8.2K' },
    ],
    endorsements: [
      { name: 'Coach R. Srinivasan', role: 'Head Coach, Karnataka State', quote: 'The best decision-maker in transition I have coached in a decade.' },
      { name: 'Priya Nair', role: 'Scout, Hoops India', quote: 'Verified numbers back up everything you see on film.' },
    ],
    education: 'B.Com, Christ University (2025)',
    languages: ['English', 'Kannada', 'Hindi'],
  },
  {
    id: 'arjun-menon',
    name: 'Arjun Menon',
    handle: '@arjun.ten',
    sport: 'Football',
    position: 'Attacking Midfielder',
    age: 20,
    city: 'Kochi',
    state: 'Kerala',
    club: 'Kerala Strikers Academy',
    image: '/images/athlete-football.png',
    cover: '/images/event-stadium.png',
    bio: 'Creative No. 10 with a sharp final ball and set-piece delivery. Santosh Trophy top assist provider and a regular for the U-21 national camp.',
    traceScore: 876,
    verifiedCount: 11,
    followers: 26100,
    availability: 'Open to trials',
    level: 'National',
    physicals: [
      { label: 'Height', value: '5\u20198\u201d' },
      { label: 'Weight', value: '66 kg' },
      { label: 'Top speed', value: '32.4 km/h' },
      { label: 'Foot', value: 'Left' },
    ],
    stats: [
      { label: 'Goals', value: '9', delta: '+4' },
      { label: 'Assists', value: '14', delta: '+6' },
      { label: 'Key passes/90', value: '3.1', delta: '+0.8' },
      { label: 'Pass acc.', value: '87%', delta: '+2%' },
    ],
    skills: [
      { skill: 'Vision', value: 91 },
      { skill: 'Passing', value: 92 },
      { skill: 'Dribbling', value: 86 },
      { skill: 'Finishing', value: 74 },
      { skill: 'Pace', value: 80 },
      { skill: 'Work rate', value: 85 },
    ],
    season: months.map((m, i) => ({ month: m, value: [1, 2, 3, 2, 4, 3, 5, 3][i], avg: 1.5 })),
    timeline: [
      { year: '2026', title: 'U-21 National Camp', detail: 'Selected for the pre-AFC qualifying camp.' },
      { year: '2025', title: 'Santosh Trophy — Top assists', detail: '7 assists in 8 matches for Kerala.' },
      { year: '2024', title: 'Kerala Premier League — Young Player', detail: 'Breakthrough season with KSA.' },
    ],
    media: [
      { title: 'Every assist — Santosh Trophy 2025', type: 'Highlight', duration: '3:40', views: '96K' },
      { title: 'KPL Final vs. Gokulam Reserves', type: 'Match', duration: '1:52:00', views: '18K' },
      { title: 'Set-piece delivery drills', type: 'Training', duration: '5:10', views: '6.4K' },
    ],
    endorsements: [
      { name: 'Coach Thomas Jacob', role: 'Academy Director, KSA', quote: 'Arjun sees passes two moves before anyone else on the pitch.' },
    ],
    education: 'BA Physical Education, MG University (ongoing)',
    languages: ['Malayalam', 'English', 'Hindi'],
  },
  {
    id: 'meera-iyer',
    name: 'Meera Iyer',
    handle: '@meera.smash',
    sport: 'Badminton',
    position: "Women's Singles",
    age: 19,
    city: 'Hyderabad',
    state: 'Telangana',
    club: 'Gopichand Academy',
    image: '/images/athlete-badminton.png',
    cover: '/images/event-badminton.png',
    bio: 'Aggressive attacking singles player with a 340 km/h smash. BWF World Junior ranked and current All India Senior Ranking finalist.',
    traceScore: 941,
    verifiedCount: 19,
    followers: 34800,
    availability: 'Open to offers',
    level: 'Elite',
    physicals: [
      { label: 'Height', value: '5\u20197\u201d' },
      { label: 'Smash', value: '340 km/h' },
      { label: 'Play', value: 'Right-handed' },
      { label: 'BWF Jr.', value: '#18' },
    ],
    stats: [
      { label: 'Win rate', value: '78%', delta: '+6%' },
      { label: 'Titles', value: '6', delta: '+2' },
      { label: 'Matches', value: '64' },
      { label: 'Ranking', value: '#4', delta: '\u25B23' },
    ],
    skills: [
      { skill: 'Attack', value: 95 },
      { skill: 'Defence', value: 82 },
      { skill: 'Net play', value: 86 },
      { skill: 'Footwork', value: 90 },
      { skill: 'Stamina', value: 88 },
      { skill: 'Tactics', value: 84 },
    ],
    season: months.map((m, i) => ({ month: m, value: [62, 66, 70, 72, 75, 74, 80, 78][i], avg: 58 })),
    timeline: [
      { year: '2026', title: 'All India Senior Ranking — Finalist', detail: 'Lost 21-19, 19-21, 20-22 in a 74-minute final.' },
      { year: '2025', title: 'BWF World Juniors — Quarter-finalist', detail: 'Highest-ranked Indian junior of the season.' },
      { year: '2024', title: 'Junior Nationals — Gold', detail: 'U-17 singles champion, Panchkula.' },
    ],
    media: [
      { title: 'Senior Ranking Final — Extended highlights', type: 'Highlight', duration: '8:02', views: '120K' },
      { title: 'World Juniors QF', type: 'Match', duration: '58:30', views: '22K' },
      { title: 'Smash mechanics breakdown', type: 'Training', duration: '4:20', views: '15K' },
    ],
    endorsements: [
      { name: 'Coach S. Reddy', role: 'Senior Coach, Gopichand Academy', quote: 'Meera has the attacking instinct you cannot teach.' },
    ],
    education: 'Class XII, NIOS (2025)',
    languages: ['Tamil', 'Telugu', 'English'],
  },
  {
    id: 'kabir-shah',
    name: 'Kabir \u201cViper\u201d Shah',
    handle: '@viper.bgmi',
    sport: 'BGMI',
    position: 'IGL / Assaulter',
    age: 19,
    city: 'Mumbai',
    state: 'Maharashtra',
    club: 'Team Vanta Esports',
    image: '/images/athlete-esports.png',
    cover: '/images/event-esports.png',
    bio: 'In-game leader known for aggressive zone rotations and clutch 1v3s. Led Team Vanta to a BGIS Grand Finals top-4 finish in their debut season.',
    traceScore: 889,
    verifiedCount: 12,
    followers: 212000,
    availability: 'Signed',
    level: 'Elite',
    physicals: [
      { label: 'Device', value: 'iPad Pro 11' },
      { label: 'Layout', value: '4-finger claw' },
      { label: 'Sensitivity', value: 'Custom' },
      { label: 'Role', value: 'IGL' },
    ],
    stats: [
      { label: 'K/D', value: '4.82', delta: '+0.6' },
      { label: 'Avg dmg', value: '612', delta: '+48' },
      { label: 'Finishes', value: '1,284' },
      { label: 'Chicken dinners', value: '41', delta: '+9' },
    ],
    skills: [
      { skill: 'Strategy', value: 95 },
      { skill: 'Aim', value: 88 },
      { skill: 'Comms', value: 96 },
      { skill: 'Clutch', value: 91 },
      { skill: 'Utility', value: 84 },
      { skill: 'Rotations', value: 93 },
    ],
    season: months.map((m, i) => ({ month: m, value: [3.9, 4.1, 4.0, 4.4, 4.6, 4.5, 5.1, 4.82][i], avg: 2.8 })),
    timeline: [
      { year: '2026', title: 'BGIS Grand Finals — 4th', detail: 'Debut season as IGL for Team Vanta.' },
      { year: '2025', title: 'Skyesports Champions Series — Winner', detail: 'MVP, 38 finishes over 18 matches.' },
      { year: '2024', title: 'College Esports League — Champion', detail: 'Mumbai University representative.' },
    ],
    media: [
      { title: '1v3 clutch on Erangel — BGIS', type: 'Highlight', duration: '1:24', views: '1.2M' },
      { title: 'Grand Finals Day 3 POV', type: 'Match', duration: '3:40:00', views: '310K' },
      { title: 'IGL comms breakdown', type: 'Training', duration: '12:30', views: '88K' },
    ],
    endorsements: [
      { name: 'Rohan Desai', role: 'Head of Esports, Team Vanta', quote: 'Viper turns chaos into a plan faster than anyone on the circuit.' },
    ],
    education: 'BMS, Mumbai University (ongoing)',
    languages: ['Hindi', 'English', 'Gujarati'],
  },
]

export type ProfileLite = {
  id: string
  name: string
  kind: 'Athlete' | 'Team' | 'Coach' | 'Scout' | 'Venue'
  sport: Sport
  city: string
  state: string
  level: string
  traceScore: number
  verified: number
  age?: number
  gender: 'Women' | 'Men' | 'Mixed'
  tag: string
  availability: string
  image?: string
  initials: string
}

const lite = (p: Omit<ProfileLite, 'initials'>): ProfileLite => ({
  ...p,
  initials: p.name
    .replace(/\u201c.*\u201d/, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join(''),
})

export const discoverProfiles: ProfileLite[] = [
  ...athletes.map((a) =>
    lite({
      id: a.id,
      name: a.name,
      kind: 'Athlete',
      sport: a.sport,
      city: a.city,
      state: a.state,
      level: a.level,
      traceScore: a.traceScore,
      verified: a.verifiedCount,
      age: a.age,
      gender: a.id === 'arjun-menon' || a.id === 'kabir-shah' ? 'Men' : 'Women',
      tag: a.position,
      availability: a.availability,
      image: a.image,
    }),
  ),
  lite({ id: 'rhea-kapoor', name: 'Rhea Kapoor', kind: 'Athlete', sport: 'Athletics', city: 'Delhi', state: 'Delhi', level: 'National', traceScore: 864, verified: 9, age: 21, gender: 'Women', tag: '400m Hurdles', availability: 'Open to offers' }),
  lite({ id: 'dev-singh', name: 'Dev Singh', kind: 'Athlete', sport: 'Cricket', city: 'Chandigarh', state: 'Punjab', level: 'State', traceScore: 802, verified: 7, age: 18, gender: 'Men', tag: 'Left-arm Pace', availability: 'Open to trials' }),
  lite({ id: 'tanvi-joshi', name: 'Tanvi Joshi', kind: 'Athlete', sport: 'Valorant', city: 'Pune', state: 'Maharashtra', level: 'Emerging', traceScore: 758, verified: 5, age: 20, gender: 'Women', tag: 'Duelist', availability: 'Open to trials' }),
  lite({ id: 'sahil-khan', name: 'Sahil Khan', kind: 'Athlete', sport: 'Kabaddi', city: 'Jaipur', state: 'Rajasthan', level: 'State', traceScore: 781, verified: 6, age: 23, gender: 'Men', tag: 'Raider', availability: 'Exploring' }),
  lite({ id: 'nisha-thomas', name: 'Nisha Thomas', kind: 'Athlete', sport: 'Football', city: 'Shillong', state: 'Meghalaya', level: 'National', traceScore: 848, verified: 10, age: 22, gender: 'Women', tag: 'Centre-back', availability: 'Open to offers' }),
  lite({ id: 'aditya-verma', name: 'Aditya Verma', kind: 'Athlete', sport: 'Badminton', city: 'Lucknow', state: 'Uttar Pradesh', level: 'Emerging', traceScore: 736, verified: 4, age: 17, gender: 'Men', tag: "Men's Doubles", availability: 'Open to trials' }),
  lite({ id: 'bengaluru-blaze', name: 'Bengaluru Blaze', kind: 'Team', sport: 'Basketball', city: 'Bengaluru', state: 'Karnataka', level: 'Pro League', traceScore: 905, verified: 22, gender: 'Women', tag: '3 open roster spots', availability: 'Recruiting' }),
  lite({ id: 'team-vanta', name: 'Team Vanta', kind: 'Team', sport: 'BGMI', city: 'Mumbai', state: 'Maharashtra', level: 'Tier 1', traceScore: 918, verified: 31, gender: 'Mixed', tag: 'Sub roster trials', availability: 'Recruiting' }),
  lite({ id: 'ksa', name: 'Kerala Strikers Academy', kind: 'Team', sport: 'Football', city: 'Kochi', state: 'Kerala', level: 'Academy', traceScore: 872, verified: 18, gender: 'Men', tag: 'U-19 intake', availability: 'Recruiting' }),
  lite({ id: 'coach-srinivasan', name: 'R. Srinivasan', kind: 'Coach', sport: 'Basketball', city: 'Bengaluru', state: 'Karnataka', level: 'FIBA Level 2', traceScore: 890, verified: 15, gender: 'Mixed', tag: '18 yrs experience', availability: 'Taking athletes' }),
  lite({ id: 'coach-reddy', name: 'Swathi Reddy', kind: 'Coach', sport: 'Badminton', city: 'Hyderabad', state: 'Telangana', level: 'BWF Level 2', traceScore: 902, verified: 20, gender: 'Women', tag: 'Singles specialist', availability: 'Waitlist' }),
  lite({ id: 'scout-nair', name: 'Priya Nair', kind: 'Scout', sport: 'Basketball', city: 'Chennai', state: 'Tamil Nadu', level: 'Hoops India', traceScore: 870, verified: 12, gender: 'Mixed', tag: 'Women\u2019s pro pathway', availability: 'Scouting' }),
  lite({ id: 'scout-desai', name: 'Rohan Desai', kind: 'Scout', sport: 'BGMI', city: 'Mumbai', state: 'Maharashtra', level: 'Team Vanta', traceScore: 884, verified: 14, gender: 'Mixed', tag: 'Esports talent lead', availability: 'Scouting' }),
  lite({ id: 'kanteerava', name: 'Kanteerava Indoor Stadium', kind: 'Venue', sport: 'Basketball', city: 'Bengaluru', state: 'Karnataka', level: '4,000 seats', traceScore: 0, verified: 0, gender: 'Mixed', tag: 'FIBA-certified court', availability: 'Bookable' }),
]

export const achievements: Achievement[] = [
  { id: 'ach-1', athleteId: 'ananya-rao', title: 'Tournament MVP', event: 'Khelo India University Games 2024', date: '2024-05-12', level: 'National', result: 'Gold + MVP', status: 'verified', evidence: [{ type: 'certificate', label: 'KIUG_MVP_certificate.pdf' }, { type: 'video', label: 'Final highlights' }], verifiedBy: 'Basketball Federation of India \u2014 Official' },
  { id: 'ach-2', athleteId: 'ananya-rao', title: 'Senior Nationals Semi-finalist', event: '74th Senior National Basketball Championship', date: '2025-01-22', level: 'National', result: 'Semi-final', status: 'verified', evidence: [{ type: 'scoresheet', label: 'Official box scores (6)' }], verifiedBy: 'Karnataka State Basketball Assoc.' },
  { id: 'ach-3', athleteId: 'ananya-rao', title: 'Assists Leader \u2014 AIU Circuit', event: 'All India Inter-University 2025', date: '2025-03-04', level: 'Collegiate', result: '9.4 APG', status: 'in-review', evidence: [{ type: 'scoresheet', label: 'League stat sheet' }, { type: 'link', label: 'aiu.ac.in results' }], aiFlag: 'Stat sheet total (9.4 APG) differs from linked source (9.1 APG). Reviewer should confirm.' },
  { id: 'ach-4', athleteId: 'ananya-rao', title: 'Pro League Captaincy', event: 'Pro Basketball League 2026', date: '2026-02-10', level: 'Pro League', result: 'Captain', status: 'pending', evidence: [{ type: 'photo', label: 'Team announcement' }] },
  { id: 'ach-5', athleteId: 'meera-iyer', title: 'Senior Ranking Finalist', event: 'All India Senior Ranking Tournament', date: '2026-03-18', level: 'National', result: 'Silver', status: 'verified', evidence: [{ type: 'certificate', label: 'BAI_certificate.pdf' }], verifiedBy: 'Badminton Association of India' },
  { id: 'ach-6', athleteId: 'arjun-menon', title: 'Santosh Trophy Top Assists', event: 'Santosh Trophy 2025', date: '2025-04-02', level: 'National', result: '7 assists', status: 'verified', evidence: [{ type: 'scoresheet', label: 'AIFF match reports' }], verifiedBy: 'AIFF Competitions' },
  { id: 'ach-7', athleteId: 'kabir-shah', title: 'Skyesports Champions Series MVP', event: 'SCS 2025', date: '2025-09-14', level: 'Pro League', result: 'Winner + MVP', status: 'verified', evidence: [{ type: 'video', label: 'Broadcast VOD' }, { type: 'link', label: 'Official standings' }], verifiedBy: 'Skyesports Ops' },
  { id: 'ach-8', athleteId: 'dev-singh', title: '5-wicket haul', event: 'Cooch Behar Trophy U-19', date: '2026-01-09', level: 'State', result: '5/31', status: 'pending', evidence: [{ type: 'scoresheet', label: 'Scorecard photo' }], aiFlag: 'Scorecard image metadata date is 3 days after the listed match date.' },
  { id: 'ach-9', athleteId: 'tanvi-joshi', title: 'Campus Clash Champion', event: 'Valorant Campus Clash West', date: '2026-02-22', level: 'Collegiate', result: '1st', status: 'pending', evidence: [{ type: 'photo', label: 'Trophy photo' }, { type: 'link', label: 'Bracket link' }] },
  { id: 'ach-10', athleteId: 'sahil-khan', title: 'Best Raider \u2014 State League', event: 'Rajasthan Kabaddi League', date: '2025-11-30', level: 'State', result: '142 raid pts', status: 'rejected', evidence: [{ type: 'photo', label: 'Certificate photo' }], aiFlag: 'Certificate issuer name does not match registered league body.' },
]

export function getAthlete(id: string) {
  return athletes.find((a) => a.id === id)
}
