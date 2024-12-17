<script setup lang="ts">
import { ref } from 'vue'
import BitcoinTicker from './components/BitcoinTicker.vue'
import { availableProviders, type TickerPriceFormat, type TickerProvider } from './types'
import ProviderSelector from './components/ProviderSelector.vue'
import { useLocalStorage } from '@vueuse/core'

const selectedProviders = useLocalStorage<TickerProvider[]>(
  'selected-providers',
  availableProviders,
)
const showProviderLabel = useLocalStorage<boolean>('show-provider-label', true)
const priceFormat = useLocalStorage<TickerPriceFormat>('price-format', 'btc')
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center bg-black text-zinc-200">
    <div
      class="flex flex-col gap-6 md:gap-10 lg:gap-14"
      :class="{
        '-translate-y-[1vw]': selectedProviders.length === 1,
      }"
    >
      <BitcoinTicker
        v-for="provider in selectedProviders"
        :key="provider"
        :provider
        :price-format
        :show-provider-label
      />
    </div>

    <div class="group fixed bottom-0 left-0 w-full group">
      <div
        class="transition-opacity duration-150 opacity-0 group-hover:opacity-100 w-fit pt-10 ml-3 mb-3"
      >
        <div class="bg-zinc-800 py-4 px-5 rounded-lg flex flex-col gap-4 min-w-96">
          <div class="flex gap-4">
            <label
              v-for="format in ['btc', 'sats']"
              :key="format"
              class="flex items-center gap-2 cursor-pointer group/radio"
            >
              <input type="radio" v-model="priceFormat" :value="format" class="hidden" />
              <span
                :class="[
                  'text-sm select-none',
                  {
                    'text-zinc-200': priceFormat === format,
                    'text-zinc-500 group-hover/radio:text-zinc-400': priceFormat !== format,
                  },
                ]"
                class="flex items-center gap-1.5"
              >
                <span class="-mt-1">{{ priceFormat === format ? '●' : '○' }}</span>
                {{ format }}
              </span>
            </label>
          </div>

          <hr class="border-zinc-700" />

          <label class="text-xs">
            <input type="checkbox" class="accent-zinc-500" v-model="showProviderLabel" hidden />
            <span
              class="select-none"
              :class="{
                'text-zinc-200': showProviderLabel,
                'text-zinc-500': !showProviderLabel,
              }"
            >
              {{ showProviderLabel ? '✅' : '❌' }} Show provider
            </span>
          </label>

          <hr class="border-zinc-700" />

          <ProviderSelector v-model:selected="selectedProviders" />
        </div>
      </div>
    </div>
  </div>
</template>
