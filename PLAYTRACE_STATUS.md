# PLAYTRACE — Build status

Frontend-only interactive prototype (Next.js 16, Tailwind v4, React Three Fiber, Motion, Recharts). All data is sample data in `lib/data/*`; interactive state lives in `lib/store.tsx` (in-memory, role preference persisted to localStorage). AI responses are simulated locally and clearly labelled.

## Completed modules
| Module | Route | Key files |
| --- | --- | --- |
| Landing page + 3D hero (career "trace" over a running track) | `/` | `components/landing/*` |
| App shell: collapsible sidebar, top bar, ⌘K global search, notifications, profile menu, role switcher, mobile tab bar + drawer | `/app/*` | `components/shell/*`, `lib/nav.ts` |
| Role-adaptive dashboards (Athlete, Coach, Scout, Organiser, Volunteer, Admin) | `/app` | `components/dashboard/role-dashboards.tsx` |
| Athlete profiles (Basketball, Football, Badminton, BGMI) | `/app/athletes/[id]` | `components/athletes/athlete-profile.tsx` |
| Achievements & human verification console (AI flags advisory only) | `/app/achievements` | `components/achievements/achievements-view.tsx` |
| Discovery (athletes, teams, coaches, scouts, venues; filters, sort, previews) | `/app/discover` | `components/discover/discover-view.tsx` |
| Events discovery + detail + 3-step registration | `/app/events`, `/app/events/[id]` | `components/events/*` |
| Organiser console (overview, registrations, fixtures generator, announcements) | `/app/organiser` | `components/organiser/organiser-console.tsx` |
| 7-step event creation wizard with live preview | `/app/organiser/create` | `components/organiser/create-event.tsx` |
| AI Event Experience Assistant (simulated) | `/app/assistant` | `components/assistant/assistant-view.tsx` |
| Volunteers (roster, shifts, training, safeguarding) | `/app/volunteers` | `components/volunteers/volunteers-view.tsx` |
| Event-day operations control room (simulated live) | `/app/operations` | `components/operations/operations-view.tsx` |
| Opportunities marketplace + detail + application | `/app/opportunities`, `/app/opportunities/[id]` | `components/opportunities/*` |
| Competitions (brackets, standings, stats) | `/app/competitions` | `components/competitions/competitions-view.tsx` |
| Community feed, groups, meetups | `/app/community` | `components/community/community-view.tsx` |
| Analytics (athlete, event, talent, platform) | `/app/analytics` | `components/analytics/analytics-view.tsx` |
| Admin (overview, users, verifiers, moderation, audit, policies) | `/app/admin` | `components/admin/admin-view.tsx` |

## Suggested next steps
- Real persistence + auth (e.g. Neon + Better Auth) replacing `lib/store.tsx`.
- Real AI via AI Gateway for the assistant and evidence consistency checks.
- Per-competition detail routes and live score websockets.
- Evidence file storage (Vercel Blob, private) and a document viewer.
