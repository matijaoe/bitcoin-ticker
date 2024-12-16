<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import { computed, ref } from 'vue'

interface TickerResponse {
  channel: 'ticker' & {}
  type?: ('snapshot' | 'update') & {}
  data?: TickerData[]
  error?: string
  success?: boolean
}

interface TickerData {
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

interface Prices {
  USD?: number
  EUR?: number
}

const prices = ref<Prices>({})
const currency = ref<'USD' | 'EUR'>('USD')

const toggleCurrency = () => {
  currency.value = currency.value === 'USD' ? 'EUR' : 'USD'
}

const { data } = useWebSocket('wss://ws.kraken.com/v2', {
  onConnected: (ws: WebSocket) => {
    console.log('Connected to Kraken WebSocket')
    const subscriptionMessage = {
      method: 'subscribe',
      params: {
        channel: 'ticker',
        symbol: ['BTC/USD', 'BTC/EUR'],
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

const formatPrice = (price: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const currentPrice = computed(() => {
  const message = data.value ? (JSON.parse(data.value) as TickerResponse) : null
  if (message?.channel === 'ticker') {
    message.data?.forEach((d) => {
      if (d.symbol === 'BTC/USD') prices.value.USD = d.last
      if (d.symbol === 'BTC/EUR') prices.value.EUR = d.last
    })
  }
  return prices.value[currency.value]
})
</script>

<template>
  <div class="w-full grid place-content-center text-center gap-10">
    <div class="text-9xl flex">
      <span class="text-zinc-700 cursor-pointer select-none" @click="toggleCurrency">{{
        currency === 'USD' ? '$' : '€'
      }}</span>
      <span class="text-zinc-400" v-if="currentPrice">{{ formatPrice(currentPrice) }}</span>
    </div>
  </div>
</template>
