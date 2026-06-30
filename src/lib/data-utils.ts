import { properties } from '@/data/properties'
import { agents } from '@/data/agents'
import { reels } from '@/data/reels'
import type { Property, Agent, Reel, SEACountry } from './types'

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

export { properties, agents, reels }
