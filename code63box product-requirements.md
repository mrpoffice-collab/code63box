# Code63Labs PRD

> A smartphone-style home screen for your mini web apps.

---

## What It Is

A web-based app launcher that looks and feels like a phone home screen. You add apps, everyone sees them instantly. Tap an icon, app launches.

```
┌─────────────────────────────────┐
│  Code63Labs                  ≡  │
├─────────────────────────────────┤
│                                 │
│   📊    🎨    💰    ⏱️    │
│  Budget Color  Tip   Timer     │
│                                 │
│   📝    🔄    🎲    📐    │
│  Notes  Conv  Dice  Calc       │
│                                 │
│   🌤️    💪    📋    🔐    │
│  Weath  Fit   Todo  Pass       │
│                                 │
└─────────────────────────────────┘
```

---

## How Updates Work

1. You add app to config file
2. Deploy to Vercel
3. Everyone sees it immediately

No app stores. No downloads. No version updates. It's a website.

> **Note**: Individual mini apps handle their own auth/payments internally. Code63Labs just launches them in iframes.

---

## Architecture

```
┌────────────────────────────────┐
│       Next.js (Static)         │
├────────────────────────────────┤
│   Home Grid   │   App Viewer   │
└────────────────────────────────┘
              │
              ▼
┌────────────────────────────────┐
│      apps.config.ts            │
└────────────────────────────────┘
```

---

## Data Structure

```ts
type App = {
  slug: string
  title: string
  icon: string          // emoji or image path
  color: string         // background color for icon
  embedUrl: string
  category?: string     // for filtering
  createdAt: string     // ISO date - for "new" badge
  status: 'idea' | 'building' | 'testing' | 'mvp' | 'shipped'
  stripeProductId?: string  // if paid app
  price?: string        // display price e.g. "$5/mo" or "Free"
}
```

## Status System

Visual progression that tells a story:

```
💡 → 🧪 → 🔬 → ⚛️ → 🚀
```

| Status | Icon | Meaning | Visible? |
|--------|------|---------|----------|
| `idea` | 💡 | Just a concept | No |
| `building` | 🧪 | Actively working on it | No |
| `testing` | 🔬 | Tryable, feedback welcome | Yes |
| `mvp` | ⚛️ | Core features work | Yes |
| `shipped` | 🚀 | Done, reliable | Yes (no icon - default state) |

- Small status icon in corner of app tile
- Tooltip on hover explains the status
- Footer legend: `💡 idea  🧪 building  🔬 testing  ⚛️ mvp  🚀 shipped`
- `?dev=true` URL param to see hidden apps (idea/building)

---

## Pages

| Route          | What It Does                      |
|----------------|-----------------------------------|
| `/`            | Home screen grid of app icons     |
| `/app/[slug]`  | Full-screen app viewer            |

---

## Features

### Home Screen
- Grid of app icons (like iOS/Android)
- App name below each icon
- Tap to launch
- **"New" badge** - auto-shows for apps added in last 14 days
- **Status icon** - 🔬 or ⚛️ in corner (shipped apps show no icon)
- **Tooltip** - hover to see status meaning
- **Footer legend** - explains icon progression
- Optional: category folders or filter tabs
- Optional: search bar

### App Viewer
- Full-screen iframe
- Floating "home" button to return to grid
- App title in minimal header (or hidden)

### Analytics (PostHog)
- Track app launches, session duration
- See all apps in one dashboard
- Free tier: 1M events/month

### Payments (Stripe)
```
One Stripe account, multiple products:

├── Free apps       → No gate
├── Paid apps       → One-time or subscription
├── All Access      → Bundle unlock ($X/mo)
```
- Each app checks its own purchase status
- Stripe Customer Portal for managing subscriptions
- Webhook to Code63Labs for unlock status

---

## Tech Stack

| Layer      | Choice              |
|------------|---------------------|
| Framework  | Next.js 14          |
| Styling    | Tailwind CSS        |
| Hosting    | Vercel              |
| Apps Data  | Local config file   |
| Analytics  | PostHog (free tier) |
| Payments   | Stripe              |

---

## Adding a New App

```ts
// apps.config.ts - just add an entry
{
  slug: 'budget-tracker',
  title: 'Budget',
  icon: '📊',
  color: '#4CAF50',
  embedUrl: 'https://my-budget-app.vercel.app',
  createdAt: '2025-01-15',
  status: 'shipped',            // 💡🧪🔬⚛️🚀
  stripeProductId: 'prod_xxx',  // optional
  price: '$5/mo'                // optional
}
```

Deploy. Done. Everyone has it.

Promoting an app? Just change `status: 'testing'` → `status: 'mvp'` and deploy.

---

## Out of Scope

- User accounts on the launcher
- App store / submissions
- Push notifications
- Offline support (PWA)
- App ratings/reviews

---

## Maybe Later

- [ ] PWA (installable to actual home screen)
- [ ] Drag to reorder apps
- [ ] Folders for grouping
- [ ] Dark mode
- [ ] Recently used section

---

*Your apps. One home screen.*
