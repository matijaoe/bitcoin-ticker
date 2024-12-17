<script setup lang="ts">
import { useTicker, type TickerProvider } from '@/composables/ticker'

const props = defineProps<{
  provider: TickerProvider
}>()

const formatPrice = (price: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const { currency, lastPrice, status, CURRENCIES, toggleCurrency } = useTicker(props.provider)
</script>

<template>
  <div class="w-full grid place-content-center text-center gap-10" :title="props.provider">
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
