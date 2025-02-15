<script setup lang="ts">
import { computed, ref } from 'vue'
import BitcoinTicker from './components/BitcoinTicker.vue'
import { availableProviders, type TickerPriceFormat, type TickerProvider } from './types'
import ProviderSelector from './components/ProviderSelector.vue'
import { useLocalStorage, useToggle } from '@vueuse/core'

const selectedProviders = useLocalStorage<TickerProvider[]>(
  'selected-providers',
  availableProviders,
)

const sortedSelectedProviders = computed(() =>
  [...selectedProviders.value].sort(
    (a, b) => availableProviders.indexOf(a) - availableProviders.indexOf(b),
  ),
)
const showProviderLabel = useLocalStorage<boolean>('show-provider-label', true)
const priceFormat = useLocalStorage<TickerPriceFormat>('price-format', 'btc')

const selectedProvidersCount = computed(() => selectedProviders.value.length)

const [isSettingsOpen, setIsSettingsOpen] = useToggle(false)
</script>

<template>
  <div class="h-screen flex flex-col justify-evenly items-center bg-black text-zinc-200">
    <div
      class="flex flex-col"
      :class="{
        '-translate-y-[1vw]': selectedProviders.length === 1,
        'gap-8': showProviderLabel,
        'gap-14': !showProviderLabel,
      }"
    >
      <BitcoinTicker
        v-for="provider in sortedSelectedProviders"
        :key="provider"
        :provider
        :price-format
        :show-provider-label
        :total-count="selectedProvidersCount"
      />
    </div>

    <div class="fixed bottom-0 left-0 p-3 flex items-center">
      <button class="p-2 text-zinc-600 hover:text-zinc-200" @click="setIsSettingsOpen()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
            d="M41.5 10h-6m-8-4v8m0-4h-22m8 14h-8m16-4v8m22-4h-22m20 14h-6m-8-4v8m0-4h-22"
          />
        </svg>
      </button>
    </div>

    <div v-if="isSettingsOpen" class="group fixed bottom-0 left-0 p-3 w-full group">
      <div class="bg-zinc-800 py-4 px-5 rounded-lg flex flex-col gap-4 max-w-96">
        <div class="flex gap-4">
          <label
            v-for="format in ['btc', 'sats']"
            :key="format"
            class="flex items-center gap-2 cursor-pointer group/radio"
          >
            <input type="radio" v-model="priceFormat" :value="format" class="hidden" />
            <span
              :class="[
                'text-xs select-none',
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
            {{ showProviderLabel ? '✅' : '❌' }} Show provider label
          </span>
        </label>

        <hr class="border-zinc-700" />

        <ProviderSelector v-model:selected="selectedProviders" />

        <hr class="border-zinc-700" />

        <div class="text-xs">
          <button class="text-zinc-500 hover:text-zinc-200" @click="setIsSettingsOpen(false)">
            [close]
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
