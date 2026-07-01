import { properties } from '@/data/properties'
import { agents } from '@/data/agents'
import { reels } from '@/data/reels'
import { spotlights } from '@/data/spotlights'
import type { Property, Agent, Reel, Spotlight, SEACountry } from './types'

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find(p => p.slug === slug)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter(p => p.featured)
}

export function getPropertiesByCountry(country: SEACountry): Property[] {
  return properties.filter(p => p.location.country === country)
}

export function getAgentBySlug(slug: string): Agent | undefined {
  return agents.find(a => a.slug === slug)
}

export function getPropertyReel(propertySlug: string): Reel | undefined {
  return reels.find(r => r.propertySlug === propertySlug)
}

export function getPrevNextProperties(slug: string): { prev: Property | null; next: Property | null } {
  const idx = properties.findIndex(p => p.slug === slug)
  return {
    prev: idx > 0 ? properties[idx - 1] : null,
    next: idx < properties.length - 1 ? properties[idx + 1] : null,
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}k`
  return String(views)
}

// One decimal (unlike formatViews' whole-k rounding) so destination like totals
// stay visually distinct - e.g. 48.2k vs 37.9k rather than both collapsing to a
// rounded "k". Used for Spotlight engagement stats.
export function formatLikes(likes: number): string {
  if (likes >= 1_000_000) return `${(likes / 1_000_000).toFixed(1)}M`
  if (likes >= 1_000) return `${(likes / 1_000).toFixed(1)}k`
  return String(likes)
}

// Sum the reel likes of a Spotlight's explicit member Properties (ADR 0007).
export function getSpotlightLikes(spotlight: Spotlight): number {
  return spotlight.propertySlugs.reduce(
    (sum, slug) => sum + (getPropertyReel(slug)?.likes ?? 0),
    0,
  )
}

export { properties, agents, reels, spotlights }
