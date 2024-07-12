<script setup lang="ts">
import dayjs from 'dayjs'

const days = Array.from(Array(7).keys())
const hours = {
  0: Array.from({ length: 5 }, (v, k) => k + 19),
  1: Array.from({ length: 5 }, (v, k) => k + 19),
  2: Array.from({ length: 5 }, (v, k) => k + 19),
  3: Array.from({ length: 5 }, (v, k) => k + 19),
  4: Array.from({ length: 5 }, (v, k) => k + 19),
  5: Array.from({ length: 14 }, (v, k) => k + 10),
  6: Array.from({ length: 14 }, (v, k) => k + 10)
} as const
</script>

<template>
  <div
    v-for="day in days"
    :key="day"
    class="rounded-lg w-[250px] bg-orange-300 relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-full h-[40px] bg-orange-500 flex flex-col items-center justify-center"
    >
      <h2 class="text-xl font-bold text-white">
        {{ dayjs().day(day).format('dddd D MMMM') }}
      </h2>
    </div>
    <div class="mt-[44px] mb-[4px]">
      <div class="w-full flex flex-row mb-[2px]" v-for="hour in hours[day]" :key="hour">
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
