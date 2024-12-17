import { useTickerBase, type Currency } from './ticker-base'

export const useTickerKraken = () => {
  return useTickerBase({
    wsUrl: 'wss://ws.kraken.com/v2',
    supportedCurrencies: ['USD', 'EUR'],
    formatPair: (currency: Currency) => `BTC/${currency}`,
    formatSubscription: (pairs) => ({
      method: 'subscribe',
      params: {
        channel: 'ticker',
        symbol: pairs,
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseMessage: (message: any) => {
      console.log('kraken', message)
      if (message?.channel === 'ticker' && message?.data?.[0]) {
        return {
          symbol: message.data[0].symbol,
          price: message.data[0].last,
        }
      }
      return null
    },
  })
}
