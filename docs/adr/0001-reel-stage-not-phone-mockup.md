# Reel Stage is an abstract glass slab, not a literal phone mockup

The original design spec (and first implementation) rendered the homepage's reel feed inside a literal iPhone mockup — metal bezel, side buttons, a notch. We replaced it with the Reel Stage: a frosted-glass slab using the same glass language as `FloatCard` (the navbar island, the hero's featured-property card), with no device chrome.

We made this change because the phone-frame approach worked against the site's editorial-luxury direction (motion and restraint carry the brand, not literal skeuomorphism) and tied the section to one specific device shape. The glass slab reuses an existing visual language instead of inventing a one-off device illustration, and reads as "this brand's content, floating" rather than "this brand's content, on an iPhone."

The reel feed's content and interaction model (auto-advancing feed, like/comment/share rail) are unchanged — only the containing chrome changed.
