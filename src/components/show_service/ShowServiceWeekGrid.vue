<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { USER_TAILWIND_COLORS } from '@/utils/constants'
import { getFormattedHour } from '@/utils/common'

import { addToDate, formatDateInSpanish } from '@/services/date'

import { useServiceStore } from '@/stores/service'

const loading = ref(true)
const isErrorVisible = ref(false)

const route = useRoute()

const serviceStore = useServiceStore()

const { from, selectedWeekData, weekContainsData, selectedWeek } = storeToRefs(serviceStore)

const refreshGrid = () => {
  if (!weekContainsData.value) {
    serviceStore.generateEmptyServiceWeek()
    loading.value = false
    return
  }

  loading.value = true
  isErrorVisible.value = false

  serviceStore
    .fetchServiceWeek(+route.params.id)
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
    <div
      class="w-full flex flex-row mb-[2px]"
      :class="[
        { 'bg-gray-400': !designatedUser },
        designatedUser && `${USER_TAILWIND_COLORS[designatedUser.color]}`,
        { 'm-[20px]': index === 0 }
      ]"
      v-for="({ hour, designatedUser }, index) in hours"
      :key="hour"
    >
      <div class="w-[40%] flex items-center justify-center">
        <span class="text-sm text-light"
          >{{ getFormattedHour(hour) }}-{{ getFormattedHour(hour + 1) }}</span
        >
      </div>
      <div class="w-[60%] flex items-center justify-center">
        <span class="text-sm font-bold">{{
          designatedUser ? designatedUser.name : 'Sin asignar'
        }}</span>
      </div>
    </div>
  </div>
</template>

<style></style>
