# On phone, Consultation Booking is a single-panel step wizard, not a stacked two-panel

On desktop and tablet the Consultation Booking is a two-panel surface: a persistent Property selector on the left and a right panel that steps through calendar -> details -> success (see ADR 0005).
On phone (`<= 640px`) that layout stacks the full selector above the calendar, producing a nested scroll and pushing the calendar far down the page.

Instead of stacking, the phone layout becomes a single-panel linear wizard where each step owns the full viewport, chosen specifically to preserve viewport height:

1. **Select** - the property list (including the general-enquiry option) fills the screen as a scrollview.
2. **Date** - the month calendar replaces the list; a contextual back control (labelled with the chosen property) returns to Select; the auto-filled agent chip is shown here.
3. **Details** - name/email + time slots replace the calendar; a back control (labelled with the chosen date) returns to Date. Confirm shows the inline success state.

There is no dedicated progress indicator - only the contextual back controls - to spend the least possible height on chrome.
A `?book=` deep link enters the wizard at step 2 with the property preselected.

A future reader will wonder why `BookingPanel` grew a "back to property selection" affordance that desktop never uses, and why property selection is sometimes a persistent panel and sometimes a wizard step.
The reason is that the two-panel design is genuinely good where there is width, and only phones need the height-preserving one-thing-per-screen flow; rather than compromise the desktop experience or ship a cramped stacked phone layout, the same underlying step machine is presented two ways by breakpoint.
