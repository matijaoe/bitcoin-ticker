import { useWebSocket } from '@vueuse/core'
import { computed, ref } from 'vue'
import type { TickerPrices } from '@/types'

export const CURRENCIES = {
  USD: { symbol: '$' },
  EUR: { symbol: '€' },
  GBP: { symbol: '£' },
} as const

export type Currency = keyof typeof CURRENCIES
export const currencies = Object.keys(CURRENCIES) as Currency[]

interface TickerConfig {
  wsUrl: string
  supportedCurrencies: Currency[]
  formatPair: (currency: Currency) => string
  formatSubscription: (pairs: string[]) => unknown
  parseMessage: (message: unknown) => { symbol: string; price: number } | null
}

export const useTickerBase = (config: TickerConfig) => {
  const currency = ref<Currency>('USD')
  const lastPrices = ref<TickerPrices>({})

  const { data, status } = useWebSocket(config.wsUrl, {
    onConnected: (ws: WebSocket) => {
      console.log(`Connected to ${config.wsUrl}`)
      const pairs = config.supportedCurrencies.map((c) => config.formatPair(c))
      const subscriptionMessage = config.formatSubscription(pairs)
      console.log(`[${config.wsUrl}] Sending:`, subscriptionMessage)
      ws.send(JSON.stringify(subscriptionMessage))
    },
    onDisconnected: () => {
      console.log(`Disconnected from ${config.wsUrl}`)
    },
    onError: (err) => {
      console.error(`WebSocket error for ${config.wsUrl}:`, err)
    },
    onMessage: (event) => {
      console.log(`[${config.wsUrl}] Message:`, event)
    },
    autoReconnect: true,
  })

  const lastPricesPerCurrency = computed<TickerPrices>(() => {
    const message = data.value ? JSON.parse(data.value) : null
    const parsed = config.parseMessage(message)

    if (parsed) {
      config.supportedCurrencies.forEach((key) => {
        if (parsed.symbol === config.formatPair(key as Currency)) {
          lastPrices.value[key as Currency] = parsed.price
        }
      })
    }
    return lastPrices.value
  })

  const lastPrice = computed(() => {
    return lastPricesPerCurrency.value[currency.value]
  })

  const toggleCurrency = () => {
    const currencyIndex = config.supportedCurrencies.indexOf(currency.value)
    currency.value =
      config.supportedCurrencies[(currencyIndex + 1) % config.supportedCurrencies.length]
  }

  return {
    currency,
    CURRENCIES,
    lastPrice,
    status,
    toggleCurrency,
  }
}
