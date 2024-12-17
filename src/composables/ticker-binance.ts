import { useTickerBase, type Currency } from './ticker-base'

export const useTickerBinance = () => {
  return useTickerBase({
    wsUrl: 'wss://fstream.binance.com/ws',
    supportedCurrencies: ['USDT'],
    formatPair: (currency: Currency) => `btc${currency}`.toLowerCase(),
    formatSubscription: (pairs) => ({
      method: 'SUBSCRIBE',
      params: pairs.map((pair) => `${pair}@ticker`),
      id: 1,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseMessage: (message: any) => {
      if (message?.e === '24hrTicker' && message?.s === 'BTCUSDT') {
        return {
          symbol: 'btcusdt',
          price: parseFloat(message.c),
        }
      }
      return null
    },
  })
}
