import { useTickerBase, type Currency } from './ticker-base'

export const useTickerCoinbase = () => {
  return useTickerBase({
    wsUrl: 'wss://ws-feed.exchange.coinbase.com',
    supportedCurrencies: ['USD', 'EUR'],
    formatPair: (currency: Currency) => `BTC-${currency}`,
    formatSubscription: (pairs) => ({
      type: 'subscribe',
      product_ids: pairs,
      channels: ['ticker'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseMessage: (message: any) => {
      console.log('coinbase', message)
      if (message?.type === 'ticker') {
        return {
          symbol: message.product_id,
          price: parseFloat(message.price),
        }
      }
      return null
    },
  })
}
