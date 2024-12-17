<script setup lang="ts">
import BitcoinTicker from './components/BitcoinTicker.vue'
</script>

<template>
  <div class="h-screen flex flex-col gap-14 justify-center items-center bg-black text-zinc-200">
    <BitcoinTicker provider="kraken" />
    <BitcoinTicker provider="coinbase" />
    <BitcoinTicker provider="bitstamp" />
    <BitcoinTicker provider="binance" />
  </div>
</template>
