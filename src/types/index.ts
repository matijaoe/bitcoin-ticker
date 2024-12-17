import type { CURRENCIES } from '@/composables/ticker-base'

export interface TickerResponse {
  channel: 'ticker' & {}
  type?: ('snapshot' | 'update') & {}
  data?: TickerData[]
  error?: string
  success?: boolean
}

export interface TickerData {
  symbol: string
  bid: number
  bid_qty: number
  ask: number
  ask_qty: number
  last: number
  volume: number
  vwap: number
  low: number
  high: number
  change: number
  change_pct: number
}

export type TickerPrices = {
  [K in keyof typeof CURRENCIES]?: number
}

export type TickerProvider = 'kraken' | 'coinbase' | 'bitstamp' | 'binance'

export type TickerPriceFormat = 'btc' | 'sats'

export const availableProviders: TickerProvider[] = ['kraken', 'coinbase', 'binance', 'bitstamp']
