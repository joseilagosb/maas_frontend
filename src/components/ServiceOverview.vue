<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

const route = useRoute()

const serviceStore = useServiceStore()
const { service, userHoursAssignments, dayOfServiceWeek, selectedWeek, activeWeeks, totalHours, totalAssignedHours } = storeToRefs(serviceStore)

const weekOptions = computed(() => {
  const currentWeek = getWeek()

  // Cinco semanas en el futuro
  const additionalWeeks = getArrayFromInterval(currentWeek + 1, currentWeek + 5)

  // Se retorna el intervalo de semanas actuales, más la semana actual insertada en el orden
  // del array si no está incluida y las semanas adicionales al final
  return [...addToSortedArray(activeWeeks.value, currentWeek), ...additionalWeeks]
})

const isDisabledWeekSelect = computed(() => {
  return route.name === 'edit-service-week'
})

const router = useRouter()

const onChangeWeek = () => {
  router.replace({ params: { week: selectedWeek.value } })
}

watch([service, selectedWeek], () => {
  serviceStore.fetchUserHoursAssignments()
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
      <div class="flex flex-row items-left gap-3">
        <FontAwesomeIcon :icon="faCalendarDay" class="text-5xl" />
        <h1 class="text-5xl font-condensed-bold">{{ service.name }}</h1>
      </div>
      <div class="flex flex-row gap-2">
        <slot name="action-buttons"></slot>
      </div>
    </div>
    <div class="size-full flex flex-row gap-4">
      <div class="w-[20%] flex flex-col gap-1">
        <select
          class="p-4 bg-orange-400 text-lg transition duration-500 hover:bg-orange-500 disabled:bg-gray-400 hover:disabled:bg-gray-400"
          v-model="selectedWeek" @change="onChangeWeek" data-testid="week-select" :disabled="isDisabledWeekSelect">
          <option class="bg-orange-400" v-for="week in weekOptions" :key="week" :value="week">
            {{ `Semana ${week} del ${getYear()}` }}
          </option>
        </select>
        <p class="font-regular text-md text-gray-700 pl-5" data-testid="selected-week-range-text">
          del {{ formatDate(dayOfServiceWeek('first'), 'DD/MM/YYYY') }} al {{ formatDate(dayOfServiceWeek('last'),
            'DD/MM/YYYY') }}
        </p>
        <div class="flex items-center flex-row gap-2 pt-2">
          <FontAwesomeIcon :icon="faClock" class="text-2xl pt-[3px]" />
          <h3 class="text-3xl font-condensed-medium">Horas asignadas
          </h3>
        </div>
        <div class="py-1 flex flex-col gap-2" :class="{ 'border border-black': totalAssignedHours === 0 }">
          <div v-if="totalAssignedHours === 0" class="px-4 py-4 text-center"
            data-testid="no-user-hours-assignments-message">
            <span class="font-light text-3xl">Todavía no se han asignado usuarios para esta semana.</span>
          </div>
          <div v-else class="w-full px-4 py-2 flex items-center justify-between"
            :class="[`${USER_TAILWIND_COLORS[user.color]}`]" v-for="user in userHoursAssignments" :key="user.id"
            data-testid="user-hours-assignments">
            <span class="font-light text-xl">{{ user.name }}</span>
            <span class="font-light text-2xl">{{ user.hoursCount }}</span>
          </div>
          <p class="text-center text-lg text-gray-700" data-testid="unassigned-hours-message">{{
            totalHours - totalAssignedHours }}
            horas
            {{ totalAssignedHours === 0 ? "disponibles" : "sin asignar" }}</p>
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
