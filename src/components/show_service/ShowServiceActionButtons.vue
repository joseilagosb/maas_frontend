<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useServiceStore } from '@/stores/service'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons'

const authStore = useAuthStore()
const serviceStore = useServiceStore()

const route = useRoute()
</script>

<template>
  <RouterLink :to="{
    name: 'edit-service-week',
    params: { id: route.params.id, week: serviceStore.selectedWeek }
  }" v-if="authStore.isUser"
    class="group flex items-center gap-3 cursor-pointer px-4 py-3 bg-orange-400 hover:bg-orange-500 transition-colors duration-300"
    data-testid="edit-service-week-button">
    <FontAwesomeIcon :icon="faCalendarCheck"
      class="text-xl text-white group-hover:text-black transition-colors duration-300" />
    <span
      class="text-xl font-condensed-regular text-white group-hover:text-black transition-colors duration-300 uppercase">Editar
      mi
      disponibilidad</span>
  </RouterLink>
</template>

<style></style>
