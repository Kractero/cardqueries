export interface Card {
  id: number
  season: number
  name: string
  type: string
  motto: string
  category: string
  region: string
  flag: string
  cardcategory: string
  description: string
  badges: {[key: string]: string} | string
  trophies: {[key: string]: string} | string
  inCollection?: boolean
}
