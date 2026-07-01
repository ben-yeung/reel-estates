# Reel Estates

A real-estate brand whose differentiator is content-first discovery: properties are marketed primarily through short-form video reels, and the website's homepage mirrors that with an interactive reel browsing experience.

## Language

**Property**:
A home listing — the for-sale asset itself (location, price, beds/baths/sqft, images).
_Avoid_: Listing, home, asset (when referring to the typed domain object)

**Reel**:
The social-content engagement wrapper around a Property — its like count and comments. A Reel always belongs to exactly one Property, but is a separate concept: Property is the listing data, Reel is how that listing performs as content.
_Avoid_: Post, video (no actual video exists yet — reels are property photos presented in a feed)

**Reel Stage**:
The floating frosted-glass surface on the homepage that displays one Reel at a time and auto-cycles through them. Deliberately not a literal phone mockup — it's an abstract display surface, not a device simulation.
_Avoid_: Phone mockup, phone frame, device

**Property Detail Modal**:
The in-page overlay, opened by clicking a card in Featured Properties, that shows a Property's full detail (gallery, stats, description, agent sidebar). It supersedes the originally-planned `/properties/[slug]` route for v1 - see ADR 0003 - and is reflected in the URL via a `?property=[slug]` query param so it's shareable and closes on back-navigation.
_Avoid_: Detail page, property page (both imply a dedicated route, which this deliberately is not)

**Consultation Booking**:
The homepage section at `#contact` (the destination of the Navbar's primary CTA) where a visitor requests a consultation.
It is a single-screen, two-panel flow: a scrollable image-row Property selector on the left, and a month calendar with time slots on the right.
Selecting a Property auto-fills its Agent (via `agentSlug`) into a chip at the top of the right panel; with no Property selected it is a general enquiry routed to the Lead Agent.
It collects only name + email, and confirms inline (no popup) once a date, time, and those details are present.
It is theater - there is no backend, nothing is booked or sent. See ADR 0005.
_Avoid_: Contact form, Contact us, Lead-capture form (it is a booking flow, not a generic contact form). The anchor id stays `#contact` for link continuity, but the section is not a "contact us" form.

**Lead Agent**:
The single Agent shown by default on the general-enquiry path of a Consultation Booking, when no Property (and therefore no `agentSlug`) is selected.
A real Agent from the roster, not a neutral brand placeholder - chosen as the highest-profile agent so a general enquirer still sees a credible person.

**Consultation Deep-Link**:
A `?book=[slug]` query param, distinct from the modal's `?property=`, that pre-selects a Property (and its Agent) in the Consultation Booking on load.
It is set by "Book a consultation" CTAs in the Property Detail Modal's agent sidebar and on Agent cards, making Consultation Booking the funnel floor for the whole site.
Deliberately not `?property=`, which would re-open the modal instead. See ADR 0006.
