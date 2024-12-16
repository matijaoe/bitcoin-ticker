<script setup lang="ts">
import { useTicker, CURRENCIES } from '@/composables/ticker'

const formatPrice = (price: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const { currency, lastPrice, status, toggleCurrency } = useTicker()
</script>

<template>
  <div class="w-full grid place-content-center text-center gap-10">
    <template v-if="status === 'CONNECTING'">
      <span class="text-zinc-400 text-3xl">Connecting...</span>
    </template>

    <div
      v-else
      class="lg:text-[144px] flex cursor-pointer select-none font-black -translate-x-[0.2ch]"
      role="button"
      @click="toggleCurrency"
    >
      <span class="text-zinc-700">
        {{ CURRENCIES[currency].symbol }}
      </span>
      <span class="text-zinc-400" v-if="lastPrice">{{ formatPrice(lastPrice) }}</span>
    </div>
  </div>
</template>
