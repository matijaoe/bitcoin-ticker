import { useTickerKraken } from './ticker-kraken'
import { useTickerCoinbase } from './ticker-coinbase'
import { useTickerBitstamp } from './ticker-bitstamp'
import { useTickerBinance } from './ticker-binance'
import type { TickerProvider } from '@/types'

export const useTicker = (provider: TickerProvider) => {
  switch (provider) {
    case 'kraken':
      return useTickerKraken()
    case 'coinbase':
      return useTickerCoinbase()
    case 'bitstamp':
      return useTickerBitstamp()
    case 'binance':
      return useTickerBinance()
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
