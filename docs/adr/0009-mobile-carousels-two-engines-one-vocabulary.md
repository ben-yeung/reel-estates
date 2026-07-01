# On mobile, collections become carousels via two engines but one shared control vocabulary

At `<= 1024px` (phone and tablet) the Featured Properties grid and the Meet The Team grid each collapse into a single swipeable, looping card carousel; Locations is already a carousel at every width.
All three present as one visual system - full-bleed edge-to-edge track, one active card centred with the neighbours peeking in (card ~82vw on phone, ~58vw on tablet), swipe as the primary gesture, and windowed pagination dots.
Side arrows are hidden on phone and shown on tablet.

The surprising part - which a future reader will question - is that Properties/Agents do **not** reuse the Locations carousel engine, even though it already implements a looping carousel.
Locations keeps its bespoke framer-motion engine (unbounded index, sliding-window mount, drag + spring physics), untouched.
Properties/Agents instead use a separate CSS scroll-snap carousel that achieves seamless infinite looping by cloning the leading/trailing cards and silently repositioning `scrollLeft` when the scroll settles on a clone.
We deliberately did not extract a single shared engine: the Locations component is polished and unproven-by-tests, and unifying it with a scroll-snap approach risked regressing it for a refactor whose main payoff is code elegance, not user-facing behaviour.
The two engines therefore coexist on purpose; what is shared is the *vocabulary*, not the implementation - a single windowed-dots component (bound to each carousel's real, modulo-N index) and the same sizing/peek/arrow rules give them a consistent feel despite the different internals.

The known cost of the scroll-snap clone-and-recenter loop is a possible seam flicker on very fast flicks; the recenter is debounced to the scroll-settle event and jumps without animation to keep it invisible in normal use.
