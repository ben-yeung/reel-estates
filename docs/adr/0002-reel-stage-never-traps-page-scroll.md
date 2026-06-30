# Reel Stage navigation never traps the page scroll

The Reel Stage captures scroll/swipe gestures for its own navigation (stepping between reels), which sits inside a page that's also vertically scrollable. Two decisions keep those from conflicting:

1. **Looping instead of boundary release.** On desktop, mouse-wheel input only steps reels while the cursor hovers the stage; outside the stage it's always ordinary page scroll. Within the stage, navigation loops infinitely at the first/last reel rather than clamping, so a user can never get "stuck" wheeling against a dead boundary while their cursor happens to be over the component.
2. **Tap-to-focus gate on touch.** Touch has no hover state, so a vertical swipe on the stage is inherently ambiguous with a page-scroll swipe. We require an explicit tap to enter a "focused" state (shown with a visual ring) before vertical swipes are captured for reel navigation; tapping anywhere outside the stage releases focus immediately. Until focused, all touch gestures pass through untouched as normal page scroll.

We considered switching touch navigation to a horizontal swipe (orthogonal to page scroll, no ambiguity, no focus-gate needed) but chose the tap-to-focus gate to preserve the vertical TikTok-style swipe-through-a-feed feel on touch devices, accepting the added interaction-state complexity as the cost of that authenticity.
