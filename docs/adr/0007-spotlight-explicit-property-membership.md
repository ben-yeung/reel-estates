# Spotlight membership is an explicit property list, not a region match

The Locations section shows Spotlights - curated editorial cards for travel destinations - and each one displays a single "reel likes" engagement stat summed from the reels of the properties in that destination.
We map a Spotlight to those properties with a hand-authored list of property slugs rather than deriving membership by matching `Property.location.region` (or `country`).

The obvious approach would be to auto-derive members from `location`, so a future reader will see the explicit slug list and assume it is redundant duplication.
It is not: destinations do not line up with a single `region`.
"Bali" spans `Gianyar` (Ubud) and `Badung` (Seminyak) but must exclude `Klungkung` (Nusa Penida) and Lombok, which are their own Spotlights.
Region-matching could not express this without either forcing coarse country-level granularity or inventing awkward destinations, so we accept a small amount of curation-by-hand in exchange for destinations that match how travellers actually name places - and for full editorial control over what each Spotlight covers.
