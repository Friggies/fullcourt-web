# FULLCOURT TRAINING

**Animated basketball drills and plays for players and coaches.**

[Live site](https://fullcourt-training.com) · [Playbook](https://fullcourt-training.com/drills) · [Pricing](https://fullcourt-training.com/pricing) · [Blog](https://fullcourt-training.com/blog)

FULLCOURT TRAINING is a digital basketball playbook built to make teaching, learning, and repeating game actions easier. Instead of static diagrams, the product uses motion and animation to help players and coaches understand spacing, timing, reads, rotations, and play flow.

The platform is designed for both individual players and teams:

- **Players** can study actions, replay movement, and build confidence in reads.
- **Coaches** can use the playbook to explain concepts faster and run cleaner practice sessions.
- **Clubs and organizations** can extend the platform with premium access and custom business offerings.

---

## Why FULLCOURT TRAINING exists

Basketball concepts are easier to understand when they move.

FULLCOURT TRAINING turns drills and plays into clear animated sequences so users can:

- learn offensive and defensive actions visually
- communicate schemes more effectively
- revisit concepts outside practice
- save useful drills for later
- unlock a larger premium library when they need more depth

---

## What users can do

### Explore the playbook
Browse a library of animated basketball drills and plays directly on the web. Public content is available without an account, which lowers friction for first-time visitors and shared links.

### Create an account and save favorites
Users can sign up, manage their profile, and save drills and plays for quick access later.

### Upgrade to Premium
Premium unlocks the full drill library plus subscription-backed account features for more serious players and coaches.

### Read coaching content
The built-in blog gives the product an editorial layer for training ideas, breakdowns, and basketball education.

### Join the newsletter
Visitors can subscribe for updates on new drills, new plays, and product news.

### Submit testimonials
The product includes a testimonial flow so community feedback can feed back into the marketing experience.

---

## Product highlights

- **Animated drills and plays** instead of static whiteboard-only explanations
- **Public and premium content model** for accessible acquisition and paid conversion
- **Account system** for saved content and member-specific experiences
- **Content engine** through blog posts and newsletter capture
- **Companion mobile experience** [with an iOS app on its way](https://github.com/Friggies/fullcourt-app)

---

## Pricing model

FULLCOURT TRAINING currently presents three plan tiers:

- **Free** — save drills and access the public library
- **Premium** — unlock premium drills and priority support
- **Business** — contact-based offering for clubs and organizations

---

## Built for

- youth players
- high school players
- senior players
- individual skill trainers
- assistant coaches
- head coaches
- clubs and basketball organizations

---

## Core product surfaces

```text
/
├── Home / marketing landing page
├── /drills              # animated playbook and drill browsing
├── /pricing             # Free / Premium / Business plans
├── /blog                # training and coaching content
├── /auth/*              # sign up, login, password recovery, confirmation
├── /profile             # subscription and account management
├── /api/newsletter      # newsletter signup
└── /api/testimonial     # testimonial submission
```

---

## Tech stack

- **Framework:** Next.js
- **UI:** React + TypeScript
- **Styling:** Tailwind CSS
- **Auth & data:** Supabase
- **Subscriptions:** RevenueCat
- **Image processing:** Sharp
- **Email/newsletter integration:** Kit

---

## Local development

### Prerequisites

- Node.js 20+
- npm
- A Supabase project

### Install

```bash
npm install
```

### Environment variables

Create a `.env.local` file with the values your environment needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
KIT_API_KEY=
KIT_FORM_ID=
```

### Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

### Other scripts

```bash
npm run build
npm run start
npm run lint
```

---

## Repo structure

```text
app/          # routes, pages, metadata, API handlers
components/   # shared UI, feature components, page sections
data/         # pricing tiers, FAQ, testimonials, social data
lib/          # Supabase clients, helpers, shared types
public/       # static assets
```