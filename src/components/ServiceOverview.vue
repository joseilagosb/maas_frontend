<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons'

import { useServiceStore } from '@/stores/service'

import { formatDate, getWeek, getYear } from '@/services/date'

import { addToSortedArray, getArrayFromInterval } from '@/utils/common'
import { USER_TAILWIND_COLORS } from '@/utils/constants'

const loading = ref(true)
const isErrorVisible = ref(false)

const serviceStore = useServiceStore()
const { service, userAssignedHours, dayOfServiceWeek, selectedWeek, activeWeeks, weekContainsData } = storeToRefs(serviceStore)

const weekOptions = computed(() => {
  const currentWeek = getWeek()

  // Cinco semanas en el futuro
  const additionalWeeks = getArrayFromInterval(currentWeek + 1, currentWeek + 5)

  // Se retorna el intervalo de semanas actuales, más la semana actual insertada en el orden
  // del array si no está incluida y las semanas adicionales al final
  return [...addToSortedArray(activeWeeks.value, currentWeek), ...additionalWeeks]
})

const router = useRouter()

const onChangeWeek = () => {
  router.replace({ params: { week: selectedWeek.value } })
}

watch([service, selectedWeek], () => {
  serviceStore.fetchUserAssignedHours()
    .catch(() => { isErrorVisible.value = true })
    .finally(() => { loading.value = false })
})

onMounted(() => {
  serviceStore.fetchService()
    .catch(() => { isErrorVisible.value = true })
    .finally(() => { loading.value = false })
})
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-4 items-start justify-start">
    <h1 class="text-2xl font-bold">Cargando...</h1>
  </div>
  <div v-else-if="isErrorVisible" class="flex flex-col gap-4 items-start justify-start" data-testid="error-message">
    <h1 class="text-2xl font-bold">Servicio no encontrado</h1>
  </div>
  <div v-else-if="service" class="size-full flex flex-col gap-4 items-start justify-start p-2" data-testid="service">
    <div class="w-full flex justify-between items-start pt-8">
      <div class="flex flex-col items-left gap-4">
        <h1 class="text-4xl font-light">
          <FontAwesomeIcon :icon="faCalendarDay" class="text-md" />
          {{ service.name }}
        </h1>
      </div>
      <div class="flex flex-row gap-2">
        <slot name="action-buttons"></slot>
      </div>
    </div>
    <div class="size-full flex flex-row gap-4">
      <div class="w-[20%] flex flex-col gap-1">
        <select
          class="px-4 py-2 bg-orange-300 rounded-lg transition duration-500 hover:bg-orange-400 disabled:bg-gray-300 hover:disabled:bg-gray-300"
          v-model="selectedWeek" @change="onChangeWeek" data-testid="week-select">
          <option class="bg-orange-300" v-for="week in weekOptions" :key="week" :value="week">
            {{ `Semana ${week} del ${getYear()}` }}
          </option>
        </select>
        <p class="font-light text-sm text-gray-500 pl-5" data-testid="selected-week-range-text">
          del {{ formatDate(dayOfServiceWeek('first'), 'DD/MM/YYYY') }} al {{ formatDate(dayOfServiceWeek('last'),
            'DD/MM/YYYY') }}
        </p>
        <h3 class="text-2xl font-light text-gray-500 pt-4">
          <FontAwesomeIcon :icon="faClock" class="text-md pr-2" />
          <span>Horas asignadas</span>
        </h3>
        <div class="border border-black rounded-xl py-1 flex flex-col gap-1 overflow-hidden">
          <div v-if="!weekContainsData" class="px-4 py-4 text-center" data-testid="empty-week-message">
            <span class="font-light text-3xl">Todavía no se han asignado usuarios para esta semana.</span>
          </div>
          <div v-else class="h-[40px] w-full px-4 flex items-center justify-between"
            :class="[`${USER_TAILWIND_COLORS[user.color]}`]" v-for="user in userAssignedHours" :key="user.id"
            data-testid="user-assigned-hours">
            <span class="font-light text-lg">{{ user.name }}</span>
            <span class="font-light text-lg">{{ user.hoursCount }}</span>
          </div>
          <p class="font-bold text-center text-sm text-gray-500" data-testid="unassigned-hours-message">{{ "X" }} horas
            {{
              weekContainsData ? "sin asignar" :
                "disponibles" }}</p>
        </div>
      </div>
      <div class="w-[80%] overflow-y-auto tiny-scrollbar">
        <slot name="grid"></slot>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<style></style>
