# Mobile sizing is driven by stepping the global --scale down per breakpoint

The whole UI is sized off one knob: the root font-size is `max(16px, 0.8333vw) * var(--scale)` with `--scale: 1.5`, so every rem-based dimension (type, spacing, min card sizes) scales from a single value.
Below 1920px that formula is a flat 24px root, which is deliberate on desktop but proportionally oversized on a ~390px phone.

Rather than retune each section's type and spacing with its own mobile media queries, we lower `--scale` at two canonical breakpoints and let the existing rem-based sizing shrink with it:

- **Desktop** (`> 1024px`): `--scale: 1.5` (unchanged).
- **Tablet** (`641-1024px`): `--scale: 1.2`.
- **Phone** (`<= 640px`): `--scale: 1.0` (16px root, was 24px).

These two breakpoints - phone `640px`, tablet `1024px` - are the canonical taxonomy for the whole site; the pre-existing ad-hoc breakpoints (`980`, `860`, `560`) are being consolidated onto them.

A future reader will see per-breakpoint `--scale` overrides and may assume they are a hack or leftover experiment and try to "simplify" them back to a single value.
They are the primary mobile-sizing lever by design: one knob keeps every ratio fixed while proportionally shrinking the entire interface, which is far more consistent and maintainable than scattering type/spacing overrides across a dozen component stylesheets.
Targeted per-section media queries still exist, but only for genuine layout changes (grid-to-carousel, panel stacking, nav collapse) - not for routine resizing, which the scale knob handles.
