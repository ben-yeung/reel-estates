# Mobile Optimization Plan (2026-06-30)

Sharpened from a grilling session.
Makes the Navbar, Featured Properties, Meet The Team, Locations, Consultation Booking, and the Property Detail Modal work well on phone and tablet.
The governing decisions live in ADR 0008 (scale + breakpoints), ADR 0009 (carousels), and ADR 0010 (mobile consultation wizard).

## Foundations

### Breakpoint taxonomy

Two canonical breakpoints for the whole site, replacing the ad-hoc `980` / `860` / `560`:

- **Phone**: `<= 640px`
- **Tablet**: `641px - 1024px`
- **Desktop**: `> 1024px`

### Global scale

`--scale` steps down per breakpoint in `tokens.css` (root font-size is `max(16px, 0.8333vw) * var(--scale)`):

- Desktop `1.5` (unchanged), Tablet `1.2`, Phone `1.0`.

This proportionally shrinks the whole rem-based UI; per-section media queries are then only for genuine layout changes.

### Shared primitives (new)

- **`WindowedDots`** - iOS-style pagination dots, max ~7 visible with shrinking edge dots and a sliding window; bound to a real (modulo-N) index. Used by all four carousels.
- **`SnapCarousel`** - a CSS scroll-snap carousel with centred cards, peeking neighbours, and seamless infinite loop via cloned leading/trailing cards + debounced silent `scrollLeft` recenter on scroll-settle. Full-bleed edge-to-edge track. Renders arbitrary card children. Used by Properties and Agents (and the modal gallery adapts the same swipe + dots vocabulary).

Carousel vocabulary, all sizes: swipe is primary; windowed dots show position; side arrows hidden on phone, shown on tablet.
Card sizing: active card ~82vw (phone) / ~58vw (tablet) with peeking neighbours.

## Per-section work

### Navbar (`< 1024px`)

- Collapse the horizontal links + CTA into a hamburger.
- **Nav Sheet**: a frosted panel that drops from the island, holding the 4 links + the Book Consultation CTA button.
- Mobile bar geometry: near-full-width with ~1rem fixed side gutters (island insets shrink from 15%); the scroll top<->island morph becomes a subtle frost/shadow fade rather than a width jump.
- Open forces the frosted/solid look even over the transparent hero top-state; backdrop scrim + body-scroll lock while open; closes on link tap, hamburger/X toggle, backdrop tap, Esc, and route change.

### Featured Properties (`<= 1024px`)

- Grid (3->2 col) collapses into a `SnapCarousel` of `PropertyCard`s, looping, with `WindowedDots` (12 dots -> windowed).
- Header stays within the padded container; the card track goes full-bleed.

### Meet The Team (`<= 1024px`)

- The 6-col offset grid collapses into a `SnapCarousel` of `AgentCard`s (5 dots), same rules as Properties.

### Locations (all sizes; mobile polish)

- Keep the bespoke drag/spring engine untouched.
- Add `WindowedDots` bound to its real index; hide the side arrows on phone (keep on tablet).
- Verify sizing under the reduced `--scale`.

### Consultation Booking (phone `<= 640px`)

- Desktop/tablet keep the two-panel side-by-side layout.
- Phone becomes a single-panel, one-thing-per-screen wizard: **Select** (property scrollview) -> **Date** (calendar, back = change property, agent chip shown) -> **Details** (name/email + time slots, back = change date) -> inline success.
- Contextual back controls only, no progress indicator; steps slide horizontally.
- `?book=` deep link enters at the Date step with the property preselected.
- Booking panel details grid stacks (name/email above wrapping time-slot chips); confirm button full-width; touch targets >= 44px.

### Property Detail Modal (mobile polish)

- Keep its own content-driven 860px two-column -> one-column breakpoint.
- Gallery: add swipe + `WindowedDots` on phone; overlay arrows tablet-only.
- Fix sub-44px touch targets: close button (currently ~15px), gallery arrows (~39px).
- Style the mobile panel's vertical scrollbar with the slim warm on-brand recipe (6px webkit thumb + `scrollbar-width: thin` for Firefox).
- Verify Stats, Reviews, and Agent Sidebar read well on phone.

## Out of scope

Hero, ReelPreview, Footer, ProcessFlow.

## Testing

Keep the existing Vitest suites green (FeaturedProperties, MeetTheTeam, PropertyCard, PropertyDetailModal, ConsultationBooking); update queries that assumed a grid where a carousel now renders.
Hover-only affordances (card "View" overlay, hover lifts) degrade gracefully on touch - tap still opens the modal; no tap-equivalent needed.
