<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useServiceStore } from '@/stores/service'
import { useAuthStore } from '@/stores/auth'
import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { addToDate, formatDateInSpanish, getFormattedHour } from '@/services/date'

import { USER_TAILWIND_COLORS } from '@/utils/constants'

const loading = ref(true)
const isErrorVisible = ref(false)

const authStore = useAuthStore()
const serviceStore = useServiceStore()
const serviceAvailabilityStore = useServiceAvailabilityStore()
const { availabilityData } = storeToRefs(serviceAvailabilityStore)
const { userHoursAssignments, weekContainsData, selectedWeek, selectedWeekData, dayOfServiceWeek } = storeToRefs(serviceStore)

watch([userHoursAssignments, selectedWeek], () => {
  loading.value = true
  isErrorVisible.value = false

  if (!weekContainsData.value) {
    serviceStore.generateEmptyServiceWeek()
    serviceAvailabilityStore.generateAvailability()
    loading.value = false
    return
  }

  serviceStore
    .fetchServiceWeek('edit')
    .then(() => { serviceAvailabilityStore.generateAvailability() })
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
      <div class="flex flex-row w-full" data-testid="grid-header">
        <div class="w-[30%] mt-[40px]"></div>
        <div class="text-center mt-[40px]" :class="[`${USER_TAILWIND_COLORS[user.color]}`]"
          :style="[`width: calc(${70 / userHoursAssignments.length}%)`]" v-for="user in userHoursAssignments"
          data-testid="grid-header-user">
          <span class="text-sm font-bold">{{ user.name }}</span>
        </div>
      </div>
      <div v-for="({ hour }, hourIndex) in hours" :key="hour" class="flex flex-row w-full" :data-testdayindex="dayIndex"
        :data-testhourindex="hourIndex" data-testid="grid-hour">
        <div class="w-[30%] flex justify-center">
          <span class="text-sm text-light" data-testid="grid-hour-time">{{ getFormattedHour(hour) }}-{{
            getFormattedHour(hour + 1) }}</span>
        </div>
        <div v-for="(user, userIndex) in userHoursAssignments" :key="user.id" class="text-center"
          :class="[`${USER_TAILWIND_COLORS[user.color]}`]"
          :style="[`width: calc(${70 / userHoursAssignments.length}%)`]" data-testid="grid-hour-user"
          :data-testhourindex="hourIndex" :data-testuserid="user.id">
          <input class="rounded size-5" type="checkbox"
            v-model="availabilityData!.serviceDays[dayIndex].serviceHours[hourIndex].available[user.id]"
            @change="serviceAvailabilityStore.changedAvailability = true" :disabled="+user.id !== authStore.user.id"
            data-testid="grid-hour-user-checkbox" />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
