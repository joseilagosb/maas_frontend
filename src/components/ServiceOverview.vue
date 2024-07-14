<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons'

import { useServiceStore } from '@/stores/service'
import { getArrayFromInterval } from '@/utils/common'
import { formatDate } from '@/utils/dayjs'

const loading = ref(true)
const isErrorVisible = ref(false)

const serviceStore = useServiceStore()
const { service, from, to, selectedWeek, weeks } = storeToRefs(serviceStore)

const weekOptions = computed(() => {
  const lastServiceWeek = weeks.value[weeks.value.length - 1]
  return [...weeks.value, ...getArrayFromInterval(lastServiceWeek, lastServiceWeek + 5)]
})

const route = useRoute()

watchEffect(() => {
  serviceStore
    .fetchService(+route.params.id)
    .catch(() => {
      isErrorVisible.value = true
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-4 items-start justify-start">
    <h1 class="text-2xl font-bold">Cargando...</h1>
  </div>
  <div
    v-else-if="service"
    class="size-full flex flex-col gap-4 items-start justify-start p-2"
    data-testid="service"
  >
    <div class="w-full flex justify-between items-start pt-8">
      <div class="flex flex-col items-left gap-4">
        <h1 class="text-4xl font-light">
          <FontAwesomeIcon :icon="faCalendarDay" class="text-md" />
          {{ service.name }}
        </h1>
      </div>
      <div class="flex flex-row gap-2"><slot name="action-buttons"></slot></div>
    </div>
    <div class="size-full flex flex-row gap-4">
      <div class="w-[20%] flex flex-col gap-1">
        <select
          class="px-4 py-2 bg-orange-300 rounded-lg transition duration-500 hover:bg-orange-400 disabled:bg-gray-300 hover:disabled:bg-gray-300"
          v-model="selectedWeek"
          :disabled="route.name === 'edit-availability'"
        >
          <option class="bg-orange-300" v-for="week in weekOptions" :key="week" :value="week">
            {{ `Semana ${week} del ${dayjs().year()}` }}
          </option>
        </select>
        <p class="font-light text-sm text-gray-500 pl-5">
          del {{ formatDate(from, 'DD/MM/YYYY') }} al {{ formatDate(to, 'DD/MM/YYYY') }}
        </p>
        <h3 class="text-2xl font-light text-gray-500 pt-4">
          <FontAwesomeIcon :icon="faClock" class="text-md pr-2" />
          <span>Horas asignadas</span>
        </h3>
        <div class="border border-black rounded-xl py-1 flex flex-col gap-1 overflow-hidden">
          <div class="h-[40px] w-full px-4 bg-green-400 flex items-center justify-between">
            <span class="font-light text-lg">Cristiano Ronaldo</span>
            <span class="font-light text-lg">19</span>
          </div>
          <div class="h-[40px] w-full px-4 bg-red-500 flex items-center justify-between">
            <span class="font-light text-lg">Luka Modric</span>
            <span class="font-light text-lg">16</span>
          </div>
          <div class="h-[40px] w-full px-4 bg-blue-300 flex items-center justify-between">
            <span class="font-light text-lg">Toni Kroos</span>
            <span class="font-light text-lg">15</span>
          </div>
          <p class="py-1 font-bold text-center text-sm text-gray-500">3 horas sin asignar</p>
        </div>
      </div>
      <div
        class="w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-max gap-2 overflow-y-auto tiny-scrollbar"
      >
        <slot name="grid"></slot>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col gap-4 items-start justify-start" data-testid="error-message">
    <h1 class="text-2xl font-bold">Servicio no encontrado</h1>
  </div>
</template>

<style></style>
