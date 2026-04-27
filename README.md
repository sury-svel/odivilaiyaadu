# 🎮 Odi Vilaiyaadu — Tamil Traditional Games Event Manager

**Odi Vilaiyaadu** (ஓடி விளையாடு — *"Run and Play"*) is a full-stack mobile app built to manage Tamil traditional games events for [AmChaTS](https://www.amchats.org), a non-profit Tamil cultural school. The app handles end-to-end event logistics: participant registration, age-group division management, real-time game scoring, volunteer coordination, and live push notifications to parents.

> Built as a personal full-stack project to demonstrate cross-platform mobile development, BaaS backend architecture, serverless edge functions, and internationalization.

---

## 📱 Live Context

The app was deployed and used during the **Thanga Iyal Odi Vilaiyaadu 2025 (TYOV 2025)** event organized by AmChaTS — a Tamil school sports day featuring traditional games for children ages 1–15. Participants register through the app, children are auto-assigned to age divisions, volunteers are assigned to games, and scores are recorded live with push notifications delivered to parents.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              React Native (Expo)                │
│  ┌──────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ Expo     │  │  Zustand   │  │  i18n-js    │ │
│  │ Router   │  │  Stores    │  │  (EN / TA)  │ │
│  └──────────┘  └────────────┘  └─────────────┘ │
└────────────────────┬────────────────────────────┘
                     │ Supabase JS Client
                     ▼
┌─────────────────────────────────────────────────┐
│                 Supabase (BaaS)                 │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ Auth       │  │ Postgres │  │ Edge         │ │
│  │ (JWT/RLS)  │  │ + Views  │  │ Functions   │ │
│  └────────────┘  └──────────┘  └──────┬──────┘ │
└─────────────────────────────────────  │  ───────┘
                                        │ HTTP
                                        ▼
                            ┌─────────────────────┐
                            │  Expo Push API      │
                            │  (Batched / 100/req) │
                            └─────────────────────┘
```

### Key Architectural Decisions

**1. Supabase as BaaS**  
Rather than building a custom REST API, Supabase is used as the backend-as-a-service layer. This provides PostgreSQL-backed data storage, JWT-based authentication, row-level security (RLS), and a real-time client — all without managing a separate server.

**2. File-based Routing with Expo Router**  
The app uses Expo Router's file-system routing (similar to Next.js App Router), organizing screens into `(tabs)/` for the main navigation and `(modal)/` for auth flows. Dynamic route segments like `[eventId]` and `[gameId]` enable deep-linking into specific event and game detail pages.

**3. Zustand for Global State with Persistence**  
Client-side state is managed with Zustand using the `persist` middleware backed by `AsyncStorage`, so events, games, and auth state survive app restarts without a network round-trip. The store layer directly calls Supabase — there is no intermediate service/repository layer by design, trading some separation-of-concerns for reduced boilerplate appropriate to this app's scale.

**4. Serverless Edge Functions for Notifications**  
Push notifications are sent via Supabase Edge Functions (Deno runtime) rather than from the client. The `publish_division_notifications` function: fetches child scores by division, resolves parent IDs, retrieves push tokens, renders a localized Mustache template, and fans out to Expo's Push API in batches of 100. This keeps secret keys off the client and makes notification delivery atomic and auditable.

**5. Bilingual by Design (English + Tamil)**  
All user-facing content — game names, event descriptions, division labels — is stored as `LocalizedText` objects (`{ en: string; ta: string }`) in the database. The `i18n-js` library with a `useTranslation` hook handles runtime locale switching, and the selected language is persisted per-user in both `AsyncStorage` and the `user_profiles` table in Supabase so it roams across devices.

**6. Role-Based Access Control (RBAC)**  
Three user roles are defined — `parent`, `volunteer`, and `admin` — each with different capabilities enforced both in the UI and via Supabase RLS policies. Registration flows differ by role: parents register via a `register_parent_for_event` Postgres RPC (which transactionally registers all of a parent's children), while volunteers use a direct insert.

---

## 🗂️ Project Structure

```
odivilaiyaadu/
└── mobile/                         # React Native (Expo) app
    ├── app/                        # File-based routes (Expo Router)
    │   ├── (modal)/auth/           # Login, register, password recovery
    │   └── (tabs)/                 # Bottom-tab navigation
    │       ├── events/[eventId]/   # Event detail + game scoring
    │       ├── parent/[childId]/   # Child profile management
    │       ├── profile/            # User profile + language toggle
    │       ├── info/               # AmChaTS info pages
    │       └── volunteer.tsx       # Volunteer game assignment
    ├── components/                 # Reusable UI components
    │   ├── EventCard.tsx
    │   ├── GameCard.tsx
    │   ├── ScoreCard.tsx / ScoreCardTable.tsx
    │   ├── DivisionAccordion.tsx
    │   ├── ChildCard.tsx
    │   └── LanguageToggle.tsx
    ├── store/                      # Zustand state stores
    │   ├── auth-store.ts           # Auth, session, user profile
    │   ├── events-store.ts         # Events, games, scores
    │   └── children-store.ts       # Child profiles, division assignment
    ├── types/                      # TypeScript domain types
    │   ├── event.ts                # Event, Game, Division, ScoreCard, Medal
    │   └── user.ts                 # User, ParentUser, VolunteerUser, Child
    ├── constants/
    │   ├── divisions.ts            # Age division config (Mazhalai → Malar)
    │   └── scoring.ts              # Scoring types: points / time / distance
    ├── i18n/
    │   ├── index.ts                # i18n-js setup + useTranslation hook
    │   └── translations/           # en.json, ta.json
    ├── utils/
    │   ├── auth.ts                 # Auth helpers
    │   ├── event.ts                # DB row → domain model mappers
    │   ├── notification.ts         # Expo push token registration
    │   └── score.ts                # Score calculation helpers
    ├── config/supabase.ts          # Supabase client (AsyncStorage session)
    └── supabase/
        └── functions/
            ├── publish_division_notifications/   # Fan-out push notifications (Deno)
            └── delete_account/                   # GDPR-compliant account deletion (Deno)
```

---

## 🗃️ Data Model

### Core Tables (Supabase / PostgreSQL)

| Table | Description |
|-------|-------------|
| `user_profiles` | Extended user data: role, language, push token, food preference |
| `events` | Event metadata with localized name/description, venue, status |
| `games` | Games within an event; supports points / time / distance scoring |
| `divisions` | Age-based brackets (Mazhalai 1–3, Arumbu 4–6, Mottu 7–9, Mugai 10–12, Malar 13–15) |
| `children` | Child profiles linked to a parent user, auto-assigned to a division by age |
| `event_game_registration` | Tracks who registered for which event/game |
| `game_scores` | Per-child, per-division score with position and medal (gold/silver/bronze) |
| `game_volunteer_assignments` | Volunteer ↔ game assignment with timestamps |
| `notification_templates` | Bilingual (EN/TA) Mustache templates for push messages |

### Supabase Views

| View | Purpose |
|------|---------|
| `v_events_with_games` | Joins events and their games in a single query for the home screen |
| `v_game_details` | Joins game → divisions → score cards for the scoring screen |

---

## 🔔 Push Notification Flow

```
Admin triggers notification (game/division ready)
        │
        ▼
Supabase Edge Function: publish_division_notifications
        │
        ├─── Query game_scores → get child IDs with score > 0
        ├─── Query children → resolve parent IDs
        ├─── Query user_profiles → get push tokens
        ├─── Query notification_templates → fetch EN/TA template
        ├─── Render message via Mustache (game, division, location vars)
        └─── POST to Expo Push API in batches of 100
                │
                ▼
        Parent device receives notification
```

---

## 👥 User Roles & Capabilities

| Capability | Parent | Volunteer | Admin |
|---|:---:|:---:|:---:|
| Register for event | ✅ | ✅ | ✅ |
| Register children for games | ✅ | — | ✅ |
| View score cards | ✅ | ✅ | ✅ |
| Record game scores | — | ✅ | ✅ |
| Assign volunteers to games | — | — | ✅ |
| Create/edit events & games | — | — | ✅ |
| Publish push notifications | — | — | ✅ |

---

## 🌐 Internationalization

The app supports English and Tamil (தமிழ்) throughout. Language can be toggled in-app and is persisted per user.

- **UI strings**: Managed via `i18n-js` with `en.json` and `ta.json` translation files
- **Domain data** (event names, game names, division labels): Stored as `LocalizedText` objects — `{ en: string; ta: string }` — in the database, rendered at runtime based on user locale
- **Push notifications**: Templates stored bilingually in `notification_templates`; the Edge Function selects the correct language from the `lang` parameter

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile framework | React Native 0.79 + Expo 53 |
| Navigation | Expo Router 5 (file-based, App Router style) |
| State management | Zustand 5 with persist middleware |
| Backend / Database | Supabase (PostgreSQL + Auth + RLS) |
| Serverless functions | Supabase Edge Functions (Deno runtime) |
| Push notifications | Expo Notifications + Expo Push API |
| Internationalization | i18n-js + expo-localization |
| Language | TypeScript 5.8 |
| Build / Deploy | Expo EAS Build |
| Package manager | Bun |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) (preferred) or npm/yarn
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- A Supabase project (free tier works)

### Setup

```bash
# Clone the repository
git clone https://github.com/sury-svel/odivilaiyaadu.git
cd odivilaiyaadu/mobile

# Install dependencies
bun install

# Configure Supabase
# Edit config/supabase.ts with your project URL and anon key

# Start with tunnel (recommended for device testing)
bun start
```

### Running on Device

```bash
# Android
bun android

# iOS
bun ios

# Web (experimental)
bun start-web
```

---

## 📦 Deployment

The mobile app is built and distributed using **Expo EAS Build**. Configuration is in `eas.json`.

The Supabase Edge Functions are deployed via the Supabase CLI:

```bash
supabase functions deploy publish_division_notifications
supabase functions deploy delete_account
```

---

## 🗺️ Roadmap

- [x] Mobile app — event listing, registration, scoring
- [x] Push notifications via Edge Functions
- [x] Bilingual support (English + Tamil)
- [x] Role-based access (parent / volunteer / admin)
- [ ] Web app — React / Next.js (in progress)
- [ ] Score leaderboard screen
- [ ] Admin dashboard for bulk operations
- [ ] Offline-first score entry with sync

---

## 🏫 About AmChaTS

[AmChaTS](https://www.amchats.org) (American Chennai Tamil School) is a non-profit organization that runs a Tamil language school for children in the United States. Odi Vilaiyaadu is built to support their annual cultural sports day — celebrating traditional Tamil games while giving kids a chance to connect with their heritage.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.
