<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { addToDate, applySpanishLocale, formatDateInSpanish } from '@/utils/dayjs'
import dayjs from 'dayjs'
applySpanishLocale(dayjs)

import { useServiceStore } from '@/stores/service'
import { getFormattedHour } from '@/utils/common'
import { USER_TAILWIND_COLORS } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'

const loading = ref(true)
const isErrorVisible = ref(false)

const route = useRoute()

const authStore = useAuthStore()
const serviceStore = useServiceStore()

const { from, selectedWeekData, selectedWeek, weekContainsData } = storeToRefs(serviceStore)

const refreshGrid = () => {
  if (!weekContainsData.value) {
    serviceStore.generateEmptyServiceWeek()
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
    v-for="{ day, serviceHours: hours } in selectedWeekData!.serviceDays"
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
    <div class="mt-[44px] mb-[4px]">
      <div
        class="w-full flex flex-row mb-[2px]"
        :class="[{ 'bg-gray-400': !user }, user && `${USER_TAILWIND_COLORS[user.color]}`]"
        v-for="{ hour, user } in hours"
        :key="hour"
      >
        <div class="w-[40%] flex items-center justify-center">
          <span class="text-sm text-light"
            >{{ getFormattedHour(hour) }}-{{ getFormattedHour(hour + 1) }}</span
          >
        </div>
        <div class="w-[60%] flex items-center justify-center">
          <span class="text-sm font-bold">{{ user ? user.name : 'Sin asignar' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
