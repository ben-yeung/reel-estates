export type SEACountry = 'Thailand' | 'Indonesia' | 'Vietnam' | 'Philippines'

export interface Property {
  slug: string
  name: string
  location: { city: string; region: string; country: SEACountry }
  price: number
  beds: number
  baths: number
  sqft: number
  description: string
  images: string[]
  agentSlug: string
  tags: string[]
  featured: boolean
}

export interface Agent {
  slug: string
  name: string
  title: string
  regions: string[]
  phone: string
  quote: string
  reelCount: number
  totalViews: number
  avatar: string
  socialLinks: { platform: 'instagram' | 'tiktok' | 'youtube'; url: string }[]
}

export interface ReelComment {
  author: string
  text: string
  likes: number
}

export interface Reel {
  propertySlug: string
  comments: ReelComment[]
  likes: number
}
