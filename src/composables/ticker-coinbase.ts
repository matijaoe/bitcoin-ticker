import type { TickerPrices } from '@/types'
import { useWebSocket } from '@vueuse/core'
import { computed, ref } from 'vue'

export const useTickerCoinbase = () => {
  const CURRENCIES = {
    USD: { pair: 'BTC-USD', symbol: '$' },
    EUR: { pair: 'BTC-EUR', symbol: '€' },
  }

  type Currency = keyof typeof CURRENCIES
  const currencies = Object.keys(CURRENCIES) as Currency[]

  const currency = ref<Currency>('USD')
  const lastPrices = ref<TickerPrices>({})

  const { data, status } = useWebSocket('wss://ws-feed.exchange.coinbase.com', {
    onConnected: (ws: WebSocket) => {
      console.log('Connected to Coinbase WebSocket')
      const subscriptionMessage = {
        type: 'subscribe',
        product_ids: Object.values(CURRENCIES).map((c) => c.pair),
        channels: ['ticker'],
      }
      ws.send(JSON.stringify(subscriptionMessage))
    },
    onDisconnected: () => {
      console.log('Disconnected from Coinbase WebSocket')
    },
    onError: (err) => {
      console.error('WebSocket error:', err)
    },
    autoReconnect: true,
  })

  const lastPricesPerCurrency = computed<TickerPrices>(() => {
    const message = data.value ? JSON.parse(data.value) : null
    console.log(message)
    if (message?.type === 'ticker') {
      Object.entries(CURRENCIES).forEach(([key, { pair }]) => {
        if (message.product_id === pair) {
          lastPrices.value[key as Currency] = parseFloat(message.price)
        }
      })
    }
    return lastPrices.value
  })

  const lastPrice = computed(() => {
    return lastPricesPerCurrency.value[currency.value]
  })

  const toggleCurrency = () => {
    const currencyIndex = currencies.indexOf(currency.value)
    currency.value = currencies[(currencyIndex + 1) % currencies.length]
  }

  return {
    currency,
    CURRENCIES,
    lastPrice,
    status,
    toggleCurrency,
  }
}
