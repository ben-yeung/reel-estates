# Reel Estates — Design Spec
**Date:** 2026-06-26  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion

---

## 1. Concept

Reel Estates is a hyper-modern real estate company focused on building and selling homes across Southeast Asia. Its differentiator is a content-first approach — the brand creates short-form reel content (TikTok, Instagram, YouTube Shorts) to discover and promote properties. The website mirrors this identity: editorial luxury aesthetic driven by motion, with a TikTok-style interactive reel section built into the homepage.

---

## 2. Visual Identity

### Direction
Editorial luxury — clean, restrained, premium. Motion carries the brand personality; color and type stay calm.

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--warm` | `#b89a7a` | CTAs, badges, accents |
| `--warm-dark` | `#9a7d5f` | CTA hover states |
| `--text` | `#1a1a1a` | Primary text |
| `--muted` | `#6b6b6b` | Secondary text, labels |
| `--bg` | `#f5f2ee` | Page background |
| `--card-bg` | `rgba(255,255,255,0.88)` | Floating card surfaces |

### Typography
| Role | Font | Weights |
|---|---|---|
| Headings, nav, eyebrow labels, property names | Montserrat | 300, 600, 700 |
| Body copy, subtitles, descriptions, UI text | Source Sans 3 | 400, 500, 600 |

Load via Google Fonts with `display=swap`.

### Frosted Glass Recipe
Used on navbar island and floating hero card:
- `background: rgba(255,255,255,0.52)`
- `backdrop-filter: blur(32px) saturate(180%)`
- `border: 1px solid rgba(220,215,210,0.5)` — warm off-white, not pure white
- `box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.55)`
- No harsh inset borders — top highlight at `0.55` opacity only, blending into the surface

---

## 3. Project Structure

```
src/
  app/
    page.tsx                    # homepage (all sections composed here)
    properties/[slug]/page.tsx  # property detail page
    layout.tsx                  # root layout, fonts, metadata
  components/
    nav/
      Navbar.tsx                # floating island navbar
    sections/
      Hero.tsx
      ReelPreview.tsx
      FeaturedProperties.tsx
      Locations.tsx
      Agents.tsx
      Contact.tsx
    property/
      PropertyCard.tsx          # card used in grid and featured positions
      PropertyGallery.tsx       # hero image + thumbnail strip
      PropertyStats.tsx         # bed/bath/sqft chips
      AgentSidebar.tsx          # sticky agent card on detail page
    reel/
      ReelPhone.tsx             # iPhone frame wrapper
      ReelFeed.tsx              # vertical auto-advancing feed
      ReelCard.tsx              # single reel item
      ReelActions.tsx           # like / comment / share rail
      CommentDrawer.tsx         # bottom-sheet comment tray
    ui/
      FloatCard.tsx             # frosted glass card primitive
      Badge.tsx                 # pill labels (Featured, country tags)
      StatChip.tsx              # bed/bath/sqft icon + number
  data/
    properties.ts               # 10 typed property objects
    agents.ts                   # 5 typed agent objects
  lib/
    types.ts                    # Property, Agent, Reel, Comment types
```

---

## 4. Data Layer

### Property type
```ts
type Property = {
  slug: string
  name: string
  location: { city: string; region: string; country: SEACountry }
  price: number
  beds: number
  baths: number
  sqft: number
  description: string
  images: string[]        // paths under /images/properties/[slug]/
  agentSlug: string
  tags: string[]          // e.g. ['beachfront', 'pool', 'villa']
  featured: boolean
}

type SEACountry = 'Thailand' | 'Indonesia' | 'Vietnam' | 'Philippines'
```

### Reel type (used by ReelFeed — separate from Property)
```ts
type ReelComment = { author: string; text: string; likes: number }

type Reel = {
  propertySlug: string
  comments: ReelComment[]   // 3–5 per reel, static mock data
  likes: number
}
```

### Agent type
```ts
type Agent = {
  slug: string
  name: string
  title: string           // e.g. "Senior Agent — Phuket & Koh Samui"
  regions: string[]
  phone: string
  quote: string
  reelCount: number
  totalViews: number      // e.g. 1_200_000
  avatar: string          // path under /images/agents/
  socialLinks: { platform: 'instagram' | 'tiktok' | 'youtube'; url: string }[]
}
```

### Property distribution (10 total)
| Country | Count | Notes |
|---|---|---|
| Thailand | 4 | Phuket, Koh Samui, Chiang Mai, Krabi |
| Indonesia | 3 | Bali (×2), Lombok |
| Vietnam | 2 | Hội An, Đà Nẵng |
| Philippines | 1 | Palawan |

All image paths are placeholder strings (`/images/properties/[slug]/01.jpg` etc). Images will be dropped in later without code changes.

---

## 5. Homepage Sections

Page route: `app/page.tsx`. Sections render in sequence with no gaps; each is full-width.

### 5.1 Hero (`Hero.tsx`)
**Layout:** 100vh full-bleed background image. Navbar is integrated into the hero at load — no separate fixed bar until scroll.

**Content:**
- Eyebrow label: `"Southeast Asia's Premier Modern Homes"` — Montserrat 10.5px, 0.22em letter-spacing, `rgba(255,255,255,0.6)`
- Title: `"Reel / Estates"` — Montserrat, light (300) + bold (700) on two lines, `clamp(52px, 6.5vw, 84px)`, white
- Subtitle: Source Sans 3, 16px, `rgba(255,255,255,0.68)`, max-width 360px
- Featured property card: bottom-right, frosted glass, see §5.1.1
- Scroll hint: centered bottom, pulsing vertical line

**Entrance animation (Framer Motion):**
- Background div: `initial={{ scale: 1.05 }}` → `animate={{ scale: 1 }}`, `duration: 8, ease: "easeOut"` (Ken Burns settle)
- Hero text: `initial={{ opacity: 0, y: 16 }}` → `animate={{ opacity: 1, y: 0 }}`, delay `0.4s`
- Property card: same, delay `0.85s`
- No spring/bounce — standard ease throughout

#### 5.1.1 Featured Property Card
Frosted glass `FloatCard`, bottom-right (`bottom: 48px, right: 52px`):
- "Featured Project" warm badge
- Property thumbnail (gradient placeholder until images land)
- Image count: dot avatar + "+N images"
- Property name (Montserrat 700), location, bed/bath/sqft stat chips

### 5.2 Navbar (`Navbar.tsx`)
**States:** `top` (integrated into hero, transparent) → `island` (floating, frosted glass).

**Island geometry:** `top: 14px`, `left: 15%`, `right: 15%` (70% centered), `border-radius: 14px`, `height: 52px`.

**Frosted glass:** see §2 recipe.

**Framer Motion implementation:**
```tsx
const { scrollY } = useScroll()
const [isScrolled, setIsScrolled] = useState(false)
useMotionValueEvent(scrollY, "change", (v) => setIsScrolled(v > 56))

<motion.nav
  animate={isScrolled ? "island" : "top"}
  variants={navVariants}
  transition={{
    left:            { duration: isScrolled ? 0.38 : 0.45, ease: [0.4, 0, 0.2, 1] },
    right:           { duration: isScrolled ? 0.38 : 0.45, ease: [0.4, 0, 0.2, 1] },
    borderRadius:    { duration: isScrolled ? 0.35 : 0.40, ease: [0.4, 0, 0.2, 1] },
    backgroundColor: { duration: isScrolled ? 0.38 : 0.15, ease: "easeOut" },
    backdropFilter:  { duration: isScrolled ? 0.38 : 0.15, ease: "easeOut" },
    boxShadow:       { duration: isScrolled ? 0.38 : 0.15, ease: "easeOut" },
  }}
/>
```

**Asymmetric exit:** background/blur disappears at 0.15s; geometry expands back at 0.45s — glass vanishes first, shape unfolds after.

**Content:** Logo (warm icon + Montserrat wordmark), nav links (Properties, Locations, Agents, About), "Book Consultation" warm CTA button. Logo text and links transition from `white` → `var(--text)` over `0.55s ease` as island forms.

### 5.3 Reel Preview + About (`ReelPreview.tsx`)
**Layout:** 50/50 horizontal split, min-height 100vh.

**Left — About:**
- Company name (Montserrat, large)
- Tagline + 2–3 sentences on the content-first approach
- "Browse Properties" CTA (warm button)

**Right — Mock Phone (`ReelPhone.tsx`):**
CSS/SVG iPhone frame containing a vertical reel feed.

**Reel feed behavior:**
- Auto-advances every 4 seconds
- `mouseenter` → pauses at current reel
- While hovered: scroll wheel / trackpad scroll inside the phone frame triggers manual reel navigation (one reel per scroll event, spring-snaps to position)
- Transition between reels: vertical slide + opacity fade via Framer Motion `AnimatePresence`

**TikTok-style action rail (right edge of phone):**
- Heart (like) button — click triggers fill animation + scale spring pop (`scale: [1, 1.4, 1]`, Framer Motion keyframes)
- Comment button — opens `CommentDrawer` (bottom-sheet that slides up from inside the phone frame, `y: "100%" → y: 0`)
- Share icon — decorative, no interaction for now

**Each reel card shows:**
- Property image (full bleed within phone frame)
- Property name + location overlay at bottom (gradient scrim)
- Reel action rail on right edge

### 5.4 Featured Properties Grid (`FeaturedProperties.tsx`)
3-column grid (2-col tablet, 1-col mobile). All 10 properties.

**`PropertyCard.tsx`:**
- Full property image
- Property name (Montserrat 700), location, price
- Bed/bath/sqft stat chips
- Tag pill (first tag from `tags[]`)
- Hover: card lifts (`y: -4, boxShadow` transition), "View Property" CTA fades in via Framer Motion `whileHover`
- Click: navigate to `/properties/[slug]`

**Section entrance:** cards stagger in as section enters viewport using Framer Motion `whileInView` + `staggerChildren: 0.08s`.

### 5.5 Locations / Regions (`Locations.tsx`)
Four country blocks in a horizontal row (horizontal scroll on mobile).

**Each block:**
- Background: representative property image (placeholder gradient per country)
- Property count badge
- Country name (Montserrat)
- Hover: image zooms (`scale: 1.05`), warm color overlay fades in, "Explore" link appears
- Click: navigates to `/properties?country=[country]` (filtered grid)

### 5.6 Agents Editorial Spotlight (`Agents.tsx`)
One agent displayed at a time, full-width editorial layout.

**Layout:**
- Large portrait photo (left ~45%)
- Right side: agent name (Montserrat large), title, specialty regions, pull-quote (Source Sans 3 italic), content stats ("42 reels · 1.2M views"), "See Listings" link
- Dot nav + left/right arrows to step through 5 agents
- Transition: `AnimatePresence` crossfade (`opacity: 0 → 1`, `x: 24 → 0`) between agents

### 5.7 Contact + Footer (`Contact.tsx`)
Two-column layout:
- Left: form — name, email, message textarea, Send CTA (warm button)
- Right: company address, social links (Instagram, TikTok, YouTube), map placeholder div

Footer below: nav links, copyright line, tagline "Discover Southeast Asia through the reel."

---

## 6. Property Detail Page (`/properties/[slug]`)

Route: `app/properties/[slug]/page.tsx`. Data fetched via `getPropertyBySlug(slug)` from `data/properties.ts`.

### Layout
- Full-width hero image at top (no hero overlay — navbar already in island/fixed state)
- Two-column below: left (wider, ~60%) + right (narrower, ~40%, sticky)

### Left column
1. Property name — Montserrat 700, large
2. Location subtitle — Source Sans 3, muted
3. Description paragraph — Source Sans 3, 16px
4. **Thumbnail gallery strip** — horizontally scrollable row of all property images; clicking a thumbnail swaps the hero image with a crossfade (`AnimatePresence` + `layoutId` shared between hero and active thumbnail)
5. Keyboard navigation: left/right arrows cycle hero image

### Right column (sticky)
- `AgentSidebar.tsx`: agent avatar, name, phone, "Book Consultation" warm CTA
- `PropertyStats.tsx`: beds / baths / sqft chips
- Price (formatted)

### Navigation
- Navbar in fixed island state (always scrolled on this page)
- Breadcrumb: Home → Properties → [Name]
- Prev / Next property links at page bottom

---

## 7. Animation Principles

All animation via Framer Motion. No CSS `transition` or `animation` in the actual build (prototype used CSS for speed; production uses FM throughout).

| Pattern | Implementation |
|---|---|
| Page section entrances | `whileInView`, `once: true`, `viewport: { margin: "-80px" }` |
| Staggered children | `variants` with `staggerChildren` on parent |
| Reel vertical swipe | `AnimatePresence` + `y` translate, `exit` direction based on swipe direction |
| Navbar island | `motion.nav` variants + per-property transition durations |
| Like button pop | `animate={{ scale: [1, 1.4, 1] }}` keyframe on click |
| Comment drawer | `motion.div` with `initial={{ y: "100%" }}` → `animate={{ y: 0 }}` inside phone frame |
| Gallery crossfade | `layoutId` on active image, `AnimatePresence` |
| Agent spotlight | `AnimatePresence mode="wait"` crossfade, `x` offset for direction |
| Card hover lift | `whileHover={{ y: -4 }}` + shadow transition |
| Ken Burns | `initial={{ scale: 1.05 }}` → `animate={{ scale: 1 }}` on hero bg div |

---

## 8. Routing Summary

| Route | Component | Notes |
|---|---|---|
| `/` | `app/page.tsx` | All homepage sections |
| `/properties/[slug]` | `app/properties/[slug]/page.tsx` | Dynamic, generated from `properties.ts` slugs |
| `/properties?country=X` | `app/properties/page.tsx` | TODO(locations-filter): filterable grid by country — anchor: this spec §5.5 |

---

## 9. Mock Data Summary

### 10 Properties
| Slug | Name | Country | Beds | Baths | Sqft | Featured |
|---|---|---|---|---|---|---|
| `rawai-cliffside-villa` | Rawai Cliffside Villa | Thailand | 5 | 4 | 4,200 | ✓ |
| `koh-samui-ridge-house` | Koh Samui Ridge House | Thailand | 4 | 3 | 3,100 | |
| `chiang-mai-forest-retreat` | Chiang Mai Forest Retreat | Thailand | 3 | 3 | 2,800 | |
| `krabi-limestone-villa` | Krabi Limestone Villa | Thailand | 4 | 4 | 3,600 | |
| `ubud-jungle-compound` | Ubud Jungle Compound | Indonesia | 5 | 5 | 5,000 | ✓ |
| `seminyak-beach-house` | Seminyak Beach House | Indonesia | 3 | 2 | 2,400 | |
| `lombok-clifftop-villa` | Lombok Clifftop Villa | Indonesia | 4 | 3 | 3,800 | |
| `hoi-an-riverside-villa` | Hội An Riverside Villa | Vietnam | 3 | 3 | 2,600 | |
| `da-nang-oceanfront` | Đà Nẵng Oceanfront | Vietnam | 4 | 4 | 3,400 | |
| `palawan-overwater-villa` | Palawan Overwater Villa | Philippines | 6 | 5 | 6,200 | ✓ |

### 5 Agents
| Slug | Name | Specialty |
|---|---|---|
| `siriporn-thanawan` | Siriporn Thanawan | Phuket & Koh Samui |
| `made-wijaya` | Made Wijaya | Bali & Lombok |
| `linh-nguyen` | Linh Nguyễn | Vietnam |
| `carlos-reyes` | Carlos Reyes | Philippines |
| `alex-hartmann` | Alex Hartmann | Chiang Mai & Krabi |
