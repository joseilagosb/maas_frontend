<script setup lang="ts">
import { useServiceStore } from '@/stores/service'

import { getFormattedHour } from '@/utils/common'
import { USER_TAILWIND_COLORS } from '@/utils/constants'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useServiceAvailabilityStore } from '@/stores/service_availability'
import { addToDate, formatDateInSpanish } from '@/utils/dayjs'

const loading = ref(true)
const isErrorVisible = ref(false)

const route = useRoute()

const authStore = useAuthStore()
const serviceStore = useServiceStore()
const serviceAvailabilityStore = useServiceAvailabilityStore()
const { currentAvailability } = storeToRefs(serviceAvailabilityStore)
const { users, weekContainsData, selectedWeek, selectedWeekData, from } = storeToRefs(serviceStore)

const refreshGrid = () => {
  if (!weekContainsData.value) {
    serviceStore.generateEmptyServiceWeek()
    loading.value = false
    return
  }

  loading.value = true
  isErrorVisible.value = false

  serviceStore
    .fetchServiceWeek(+route.params.id, selectedWeek.value)
    .catch(() => {
      isErrorVisible.value = true
    })
    .finally(() => {
      serviceAvailabilityStore.generateCurrentAvailability()
      loading.value = false
    })
}

onMounted(() => {
  refreshGrid()
})

watch([selectedWeek], () => {
  refreshGrid()
})
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-4 items-start justify-start">
    <h1 class="text-2xl font-bold">Cargando...</h1>
  </div>
  <div v-else-if="isErrorVisible" class="flex flex-col gap-4 items-start justify-start">
    <h1 class="text-2xl font-bold">Error al cargar el calendario</h1>
    <button class="px-2 py-1 bg-orange-500 rounded-lg text-white" @click="refreshGrid">
      Volver a intentar
    </button>
  </div>
  <div
    v-else
    v-for="({ day, serviceHours: hours }, dayIndex) in selectedWeekData!.serviceDays"
    :key="day"
    class="rounded-lg self-start bg-orange-300 relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-full h-[40px] bg-orange-500 flex flex-col items-center justify-center"
    >
      <h2 class="text-xl font-bold text-white">
        {{ formatDateInSpanish(addToDate('day', from, day)) }}
      </h2>
    </div>
    <div class="flex flex-row w-full">
      <div class="w-[30%] mt-[40px]"></div>
      <div
        class="text-center mt-[40px]"
        :class="[`${USER_TAILWIND_COLORS[user.color]}`]"
        :style="[`width: calc(${70 / users.length}%)`]"
        v-for="user in users"
      >
        <span class="text-sm font-bold">{{ user.name }}</span>
      </div>
    </div>
    <div
      v-for="({ hour, users: availableUsers }, hourIndex) in hours"
      :key="hour"
      class="flex flex-row w-full"
    >
      <div class="w-[30%] flex justify-center">
        <span class="text-sm text-light"
          >{{ getFormattedHour(hour) }}-{{ getFormattedHour(hour + 1) }}</span
        >
      </div>
      <div
        v-for="(user, userIndex) in users"
        :key="user.id"
        class="text-center"
        :class="[`${USER_TAILWIND_COLORS[user.color]}`]"
        :style="[`width: calc(${70 / users.length}%)`]"
      >
        <input
          class="rounded size-5"
          type="checkbox"
          v-model="currentAvailability!.days[dayIndex].hours[hourIndex].available[userIndex]"
          :disabled="+user.id !== authStore.user.id"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
