<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')
import { storeToRefs } from 'pinia';

import { useServiceStore } from '@/stores/service';
import { getArrayFromInterval } from '@/utils/common';

const serviceStore = useServiceStore()
const { from, to } = storeToRefs(serviceStore)

const hours = [
  Array.from({ length: 5 }, (_, k) => k + 19),
  Array.from({ length: 5 }, (_, k) => k + 19),
  Array.from({ length: 5 }, (_, k) => k + 19),
  Array.from({ length: 5 }, (_, k) => k + 19),
  Array.from({ length: 5 }, (_, k) => k + 19),
  Array.from({ length: 14 }, (_, k) => k + 10),
  Array.from({ length: 14 }, (_, k) => k + 10)
]
</script>

<template>
  <div v-for="dayNumber in getArrayFromInterval(1, to.diff(from, 'day') - 1)" :key="dayNumber"
    class="rounded-lg self-start bg-orange-300 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-[40px] bg-orange-500 flex flex-col items-center justify-center">
      <h2 class="text-xl font-bold text-white">
        {{ dayjs(from).locale('es').add(dayNumber, 'day').format('dddd D [de] MMMM') }}
      </h2>
    </div>
    <div class="mt-[44px] mb-[4px]">
      <div class="w-full flex flex-row mb-[2px]" v-for="hour in hours[dayNumber - 1]" :key="hour">
        <div class="w-[40%] bg-green-500 flex items-center justify-center">
          <span class="text-sm text-light">{{ hour }}:00-{{ hour + 1 }}:00</span>
        </div>
        <div class="w-[60%] bg-green-500 flex items-center justify-center">
          <span class="text-sm font-bold">Cristiano Ronaldo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
