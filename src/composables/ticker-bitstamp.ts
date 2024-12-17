import { useTickerBase, type Currency } from './ticker-base'

export const useTickerBitstamp = () => {
  return useTickerBase({
    wsUrl: 'wss://ws.bitstamp.net',
    formatPair: (currency: Currency) => `btc${currency}`.toLowerCase(),
    supportedCurrencies: ['USD'],
    formatSubscription: (_pairs) => ({
      event: 'bts:subscribe',
      data: {
        // TODO: figure out how to subscribe to multiple pairs
        channel: 'live_trades_btcusd',
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseMessage: (message: any) => {
      if (message?.data?.price && message?.channel === 'live_trades_btcusd') {
        return {
          symbol: 'btcusd',
          price: parseFloat(message.data.price),
        }
      }
      return null
    },
  })
}
