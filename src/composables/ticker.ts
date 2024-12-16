import { useWebSocket } from '@vueuse/core'
import { computed, ref } from 'vue'
import type { TickerResponse, TickerPrices } from '@/types'

export const CURRENCIES = {
  USD: { pair: 'BTC/USD', symbol: '$' },
  EUR: { pair: 'BTC/EUR', symbol: '€' },
  GBP: { pair: 'BTC/GBP', symbol: '£' },
}

export type Currency = keyof typeof CURRENCIES
export const currencies = Object.keys(CURRENCIES) as Currency[]

export const useTicker = () => {
  const currency = ref<Currency>('USD')
  const lastPrices = ref<TickerPrices>({})

  const { data, status } = useWebSocket('wss://ws.kraken.com/v2', {
    onConnected: (ws: WebSocket) => {
      console.log('Connected to Kraken WebSocket')
      const subscriptionMessage = {
        method: 'subscribe',
        params: {
          channel: 'ticker',
          symbol: Object.values(CURRENCIES).map((c) => c.pair),
        },
      }
      ws.send(JSON.stringify(subscriptionMessage))
    },
    onDisconnected: () => {
      console.log('Disconnected from Kraken WebSocket')
    },
    onError: (err) => {
      console.error('WebSocket error:', err)
    },
    autoReconnect: true,
  })

  const lastPricesPerCurrency = computed<TickerPrices>(() => {
    const message = data.value ? (JSON.parse(data.value) as TickerResponse) : null

    if (message?.channel === 'ticker') {
      message.data?.forEach((d) => {
        Object.entries(CURRENCIES).forEach(([key, { pair }]) => {
          if (d.symbol === pair) {
            lastPrices.value[key as Currency] = d.last
          }
        })
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
    lastPrice,
    status,
    toggleCurrency,
  }
}
