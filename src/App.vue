<script setup lang="ts">
import { ref } from 'vue'
import BitcoinTicker from './components/BitcoinTicker.vue'
import { availableProviders, type TickerProvider } from './types'
import ProviderSelector from './components/ProviderSelector.vue'
import { useLocalStorage } from '@vueuse/core'

const selectedProviders = useLocalStorage<TickerProvider[]>(
  'selected-providers',
  availableProviders,
)
</script>

<template>
  <div
    class="h-screen flex flex-col gap-14 justify-center items-center bg-black text-zinc-200 relative"
  >
    <BitcoinTicker v-for="provider in selectedProviders" :key="provider" :provider />

    <div class="group fixed bottom-0 left-0 w-full group">
      <div
        class="transition-opacity duration-150 opacity-0 group-hover:opacity-100 w-fit pt-10 ml-3 mb-3"
      >
        <div class="bg-zinc-800 py-2 px-3 rounded-lg">
          <ProviderSelector v-model:selected="selectedProviders" />
        </div>
      </div>
    </div>
  </div>
</template>
