import { useTickerKraken } from './ticker-kraken'
import { useTickerCoinbase } from './ticker-coinbase'
import { useTickerBitstamp } from './ticker-bitstamp'

export type TickerProvider = 'kraken' | 'coinbase' | 'bitstamp'

export const useTicker = (provider: TickerProvider) => {
  switch (provider) {
    case 'kraken':
      return useTickerKraken()
    case 'coinbase':
      return useTickerCoinbase()
    case 'bitstamp':
      return useTickerBitstamp()
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
