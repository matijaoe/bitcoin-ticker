<script setup lang="ts">
import { useTickerKraken } from '@/composables/ticker-kraken'
import { useTickerCoinbase } from '@/composables/ticker-coinbase'

const props = defineProps<{
  provider: 'kraken' | 'coinbase'
}>()

const formatPrice = (price: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const { currency, lastPrice, status, CURRENCIES, toggleCurrency } =
  props.provider === 'kraken' ? useTickerKraken() : useTickerCoinbase()
</script>

<template>
  <div class="w-full grid place-content-center text-center gap-10">
    <template v-if="status === 'CONNECTING'">
      <span class="text-zinc-400 text-3xl">Connecting...</span>
    </template>
    <template v-else-if="status === 'CLOSED'">
      <span class="text-red-500 text-3xl">Closed</span>
    </template>

    <div
      v-else-if="lastPrice"
      class="text-[68px] sm:text-8xl md:text-9xl lg:text-[156px] flex cursor-pointer select-none font-black -translate-x-[0.2ch]"
      role="button"
      @click="toggleCurrency"
    >
      <span class="text-zinc-700">
        {{ CURRENCIES[currency as keyof typeof CURRENCIES].symbol }}
      </span>
      <span class="text-zinc-400">
        {{ formatPrice(lastPrice) }}
      </span>
    </div>
  </div>
</template>
