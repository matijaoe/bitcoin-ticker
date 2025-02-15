<script setup lang="ts">
import { useTicker } from '@/composables/ticker'
import { type TickerPriceFormat, type TickerProvider } from '@/types'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    provider: TickerProvider
    priceFormat?: TickerPriceFormat
    showProviderLabel?: boolean
    totalCount: number
  }>(),
  {
    priceFormat: 'btc',
    showProviderLabel: true,
  },
)

const formatPrice = (price: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const { currency, lastPrice, status, CURRENCIES, toggleCurrency } = useTicker(props.provider)

const shownLastPrice = computed(() => {
  if (!lastPrice.value) return
  if (props.priceFormat === 'btc') {
    return formatPrice(lastPrice.value)
  }

  const satsPerDollar = Math.round(100_000_000 / lastPrice.value)
  return formatPrice(satsPerDollar)
})

const fontSize = computed(() => {
  switch (props.totalCount) {
    case 1:
      return 'text-[16vw] lg:[font-size:_clamp(80px,25vh,240px)]'
    case 2:
      return 'text-[16vw] lg:[font-size:_clamp(80px,21vh,240px)]'
    case 3:
      return 'text-[16vw] lg:[font-size:_clamp(80px,18vh,240px)]'
    case 4:
      return 'text-[16vw] lg:[font-size:_clamp(80px,15vh,240px)]'
    default:
      return 'text-[16vw] lg:[font-size:_clamp(80px,12vh,240px)]'
  }
})
</script>

<template>
  <div
    v-if="status"
    class="w-full flex items-center justify-center text-center"
    :title="props.provider"
  >
    <template v-if="status === 'CLOSED'">
      <span class="text-red-500 text-xl md:text-3xl">Closed ({{ props.provider }})</span>
    </template>
    <template v-else-if="status === 'CONNECTING' || !lastPrice">
      <span class="text-zinc-600 text-xl md:text-3xl animate-pulse">
        Connecting ({{ props.provider }})...</span
      >
    </template>

    <div
      v-else-if="lastPrice"
      class="flex items-baseline cursor-pointer select-none font-black"
      :class="[
        fontSize,
        {
          '-translate-x-[0.2ch]': priceFormat === 'btc',
          'translate-x-[0.2ch]': priceFormat === 'sats',
        },
      ]"
      role="button"
      @click="toggleCurrency"
    >
      <div class="flex flex-col items-center" v-if="priceFormat === 'btc'">
        <span class="text-zinc-700 leading-none">
          {{ CURRENCIES[currency].symbol }}
        </span>
        <span
          v-if="showProviderLabel"
          class="text-zinc-700 font-bold text-[9px] md:text-xs text-left mt-3"
        >
          {{ props.provider }}
        </span>
      </div>

      <span class="text-zinc-400 leading-none">
        {{ shownLastPrice }}
      </span>

      <div
        class="flex flex-col items-center text-[0.6em] -translate-y-1 ml-2"
        v-if="priceFormat === 'sats'"
      >
        <span class="text-zinc-700 leading-none">sats/{{ CURRENCIES[currency].symbol }} </span>
        <span
          v-if="showProviderLabel"
          class="text-zinc-700 font-bold text-[9px] md:text-xs text-left mt-3"
        >
          {{ props.provider }}
        </span>
      </div>
    </div>
  </div>
</template>
