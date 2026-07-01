import type { Spotlight } from '@/lib/types'

// Curated editorial destinations for the Locations section - see CONTEXT.md
// "Spotlight". Each sells the place (scenery, sightseeing), not the listings;
// propertySlugs exist only to sum reel likes into one engagement stat (ADR 0007).
// Ordered by that stat, descending, so the carousel opens on the strongest buzz.
export const spotlights: Spotlight[] = [
  {
    slug: 'bali',
    title: 'Bali',
    country: 'Indonesia',
    description:
      'Emerald rice terraces, jungle-wrapped temples and surf-worn beaches - the island that turned slow living into an art form.',
    image: '/images/spotlights/bali.webp',
    propertySlugs: ['ubud-jungle-compound', 'seminyak-beach-house'],
  },
  {
    slug: 'el-nido',
    title: 'El Nido',
    country: 'Philippines',
    description:
      'Limestone islands rise sheer from the turquoise lagoons of Bacuit Bay, hiding secret coves you can only reach by boat.',
    image: '/images/spotlights/el-nido.webp',
    propertySlugs: ['palawan-overwater-villa'],
  },
  {
    slug: 'nusa-penida',
    title: 'Nusa Penida',
    country: 'Indonesia',
    description:
      "Sheer cliffs plunge into impossibly blue water off Bali's wild little sister, where the Kelingking headland draws the eye for miles.",
    image: '/images/spotlights/nusa-penida.webp',
    propertySlugs: ['nusa-penida-cliff-house'],
  },
  {
    slug: 'siargao',
    title: 'Siargao',
    country: 'Philippines',
    description:
      "The Philippines' surf capital - coconut-palm forests, glassy Cloud 9 barrels and a barefoot island rhythm.",
    image: '/images/spotlights/siargao.webp',
    propertySlugs: ['siargao-surf-retreat'],
  },
  {
    slug: 'phuket',
    title: 'Phuket',
    country: 'Thailand',
    description:
      'Cliff-backed bays, longtail-dotted water and sunsets that stop the traffic at Promthep Cape - the Andaman at its grandest.',
    image: '/images/spotlights/phuket.webp',
    propertySlugs: ['rawai-cliffside-villa'],
  },
  {
    slug: 'krabi',
    title: 'Krabi',
    country: 'Thailand',
    description:
      'Towering karsts stand in emerald shallows, a cathedral of limestone best seen from the deck of a drifting longtail.',
    image: '/images/spotlights/krabi.webp',
    propertySlugs: ['krabi-limestone-villa'],
  },
  {
    slug: 'hoi-an',
    title: 'Hội An',
    country: 'Vietnam',
    description:
      'Lantern light spills across the Thu Bồn every dusk in this honey-hued heritage town of tailors, temples and slow river boats.',
    image: '/images/spotlights/hoi-an.webp',
    propertySlugs: ['hoi-an-riverside-villa'],
  },
]
