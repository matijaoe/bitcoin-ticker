<script lang="ts" setup>
import { availableProviders, type TickerProvider } from '@/types'

const selectedProviders = defineModel<TickerProvider[]>('selected', {
  default: [],
})

const isProviderSelected = (provider: TickerProvider) => selectedProviders.value.includes(provider)
</script>

<template>
  <div class="flex items-center text-xs">
    <div v-for="provider in availableProviders" :key="provider" class="flex items-center gap-2 p-2">
      <label class="flex items-center gap-2 cursor-pointer group/check">
        <input
          type="checkbox"
          v-model="selectedProviders"
          :value="provider"
          class="accent-zinc-500 hidden"
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
      </label>
    </div>
  </div>
</template>
