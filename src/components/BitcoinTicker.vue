<script setup lang="ts">
import { useTicker } from '@/composables/ticker'
import { type TickerPriceFormat, type TickerProvider } from '@/types'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    provider: TickerProvider
    priceFormat?: TickerPriceFormat
    showProviderLabel?: boolean
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
</script>

<template>
  <div
    class="w-full flex items-center justify-center text-center"
    :title="props.provider"
    v-if="status"
  >
    <template v-if="status === 'CONNECTING'">
      <span class="text-zinc-400 text-3xl">Connecting ({{ props.provider }})...</span>
    </template>
    <template v-else-if="status === 'CLOSED'">
      <span class="text-red-500 text-3xl">Closed ({{ props.provider }})</span>
    </template>

    <div
      v-else-if="lastPrice"
      class="text-[68px] sm:text-8xl md:text-9xl lg:text-[156px] xl:text-[200px] flex items-baseline cursor-pointer select-none font-black"
      :class="{
        '-translate-x-[0.2ch]': priceFormat === 'btc',
        'translate-x-[0.2ch]': priceFormat === 'sats',
      }"
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
