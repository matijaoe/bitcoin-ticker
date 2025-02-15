<script lang="ts" setup>
import { availableProviders, type TickerProvider } from '@/types'

const selectedProviders = defineModel<TickerProvider[]>('selected', {
  default: [],
})

const isProviderSelected = (provider: TickerProvider) => selectedProviders.value.includes(provider)
</script>

<template>
  <div class="flex items-center text-xs gap-3">
    <div v-for="(provider, index) in availableProviders" :key="provider">
      <label class="flex items-center gap-2 cursor-pointer group/check">
        <input
          type="checkbox"
          v-model="selectedProviders"
          :value="provider"
          class="accent-zinc-500"
          hidden
        />
        <span
          class="capitalize select-none"
          :class="{
            'text-zinc-200 group-hover/check:text-zinc-100': isProviderSelected(provider),
            'text-zinc-500 group-hover/check:text-zinc-400': !isProviderSelected(provider),
          }"
        >
          {{ provider }}
        </span>

        <span v-if="index < availableProviders.length - 1" class="text-zinc-500">/</span>
      </label>
    </div>
  </div>
</template>
