# The Meet The Team section is a static card grid, with no per-agent detail view

Properties get a rich, shareable Property Detail Modal (ADR 0003), and every Property already carries an `agentSlug`, so the join to render "this agent's listings" exists for free.
The obvious next step would be to give Agents the same treatment: clickable cards opening a `?agent=[slug]` modal with the agent's full profile and their properties.
We deliberately chose not to.
The Meet The Team section is a static grid of self-contained cards - avatar, name, title, quote, region chips, reel/view stats, and outbound social icons - with no click target beyond those social links.

We chose this because the section's job is to *introduce the team*, and a well-made card does that completely; an agent detail view would be a second browsing surface competing with Featured Properties without adding a distinct job.

On contact: the cards carry no phone number and no "Book a consultation" CTA for now - the outbound social icons are the only action (and they currently point at placeholder URLs like `https://instagram.com`).
This is a deliberate *deferral*, not a rejection.
The Contact section is becoming a real Consultation Booking (ADR 0005), and its glossary already anticipates a "Book a consultation" CTA on Agent cards (see the Consultation Deep-Link term).
We are not wiring that yet because the booking has no code, and - more importantly - its deep-link (`?book=[slug]`) is keyed to a **Property**, whose `agentSlug` then fills the agent chip.
An Agent card has no single Property to pass, so honoring the intent needs the booking to first grow an **agent-seeded general enquiry** (a distinct param, and the general path today falls back to the Lead Agent rather than the clicked agent).
That modeling belongs to the Consultation Booking surface (ADR 0006), not here.
When it lands, the Agent card gains a "Book a consultation" CTA that seeds that agent - no rework needed, since the `agentSlug` join and the roster already exist.

Likewise, the deliberate absence of an agent detail modal is easy to revisit: the modal infrastructure from ADR 0003 remains, so a live agent-specific need (deep links, SEO-indexable agent pages) can layer one on later.
