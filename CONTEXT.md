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

**Agent**:
A named member of Reel Estates' sales team who lists and markets Properties across a set of regions, and whose own reel/view counts are part of the brand's content-first story. An Agent surfaces in two places: the sidebar of a Property Detail Modal (the Property's point of contact) and as a card in the Meet The Team section. Unlike a Property, an Agent has no detail view of its own - see ADR 0004.
_Avoid_: Realtor, broker, salesperson, rep
