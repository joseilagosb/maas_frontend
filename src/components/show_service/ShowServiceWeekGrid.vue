<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { USER_TAILWIND_COLORS } from '@/utils/constants'

import { addToDate, formatDateInSpanish, getFormattedHour } from '@/services/date'

import { useServiceStore } from '@/stores/service'

const loading = ref(true)
const isErrorVisible = ref(false)

const serviceStore = useServiceStore()

const { userHoursAssignments, dayOfServiceWeek, selectedWeekData, weekContainsData, selectedWeek } = storeToRefs(serviceStore)

watch([userHoursAssignments, selectedWeek], () => {
  loading.value = true
  isErrorVisible.value = false

  if (!weekContainsData.value) {
    serviceStore.generateEmptyServiceWeek()
    loading.value = false
    return
  }

  serviceStore
    .fetchServiceWeek()
    .catch(() => { isErrorVisible.value = true })
    .finally(() => { loading.value = false })
})
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-4 items-start justify-start">
    <h1 class="text-2xl font-bold">Cargando...</h1>
  </div>
  <div v-else-if="isErrorVisible" class="flex flex-col gap-4 items-start justify-start" data-testid="error-message">
    <h1 class="text-2xl font-bold">Error al cargar el calendario</h1>
  </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-max gap-2" data-testid="grid">
    <div v-for="({ day, serviceHours: hours }, dayIndex) in selectedWeekData!.serviceDays" :key="day"
      class="rounded-lg self-start bg-orange-300 relative overflow-hidden" data-testid="grid-day">
      <div class="absolute top-0 left-0 w-full h-[40px] bg-orange-500 flex flex-col items-center justify-center">
        <h2 class="text-xl font-bold text-white" data-testid="grid-day-date">
          {{ formatDateInSpanish(addToDate('day', dayOfServiceWeek('first'), dayIndex)) }}
        </h2>
      </div>
      <div class="w-full flex flex-row mb-[2px]" :class="[
        { 'bg-gray-400': !designatedUser },
        designatedUser && `${USER_TAILWIND_COLORS[designatedUser.color]}`,
        { 'mt-[40px]': hourIndex === 0 }
      ]" v-for="({ hour, designatedUser }, hourIndex) in hours" :key="hour" :data-testdayindex="dayIndex"
        :data-testhourindex="hourIndex" data-testid="grid-hour">
        <div class="w-[40%] flex items-center justify-center">
          <span class="text-sm text-light" data-testid="grid-hour-time">
            {{ getFormattedHour(hour) }}-{{ getFormattedHour(hour + 1) }}
          </span>
        </div>
        <div class="w-[60%] flex items-center justify-center">
          <span class="text-sm font-bold" data-testid="grid-hour-designated-user">{{
            designatedUser ? designatedUser.name : 'Sin asignar'
            }}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<style></style>
