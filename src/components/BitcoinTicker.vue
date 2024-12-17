<script setup lang="ts">
import { useTicker } from '@/composables/ticker'
import { type TickerProvider } from '@/types'

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
  <div class="w-full grid place-content-center text-center" :title="props.provider" v-if="status">
    <template v-if="status === 'CONNECTING'">
      <span class="text-zinc-400 text-3xl">Connecting ({{ props.provider }})...</span>
    </template>
    <template v-else-if="status === 'CLOSED'">
      <span class="text-red-500 text-3xl">Closed ({{ props.provider }})</span>
    </template>

    <div
      v-else-if="lastPrice"
      class="text-[68px] sm:text-8xl md:text-9xl lg:text-[156px] flex cursor-pointer select-none font-black -translate-x-[0.2ch]"
      role="button"
      @click="toggleCurrency"
    >
      <div class="flex flex-col items-center">
        <span class="text-zinc-700 leading-none">
          {{ CURRENCIES[currency as keyof typeof CURRENCIES].symbol }}
        </span>
        <span class="text-zinc-700 font-bold text-[9px] md:text-xs text-left mt-3">
          {{ props.provider }}
        </span>
      </div>
      <span class="text-zinc-400 leading-none">
        {{ formatPrice(lastPrice) }}
      </span>
    </div>
  </div>
</template>
