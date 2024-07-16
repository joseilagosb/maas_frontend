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
  <RouterLink
    :to="{
      name: 'edit-service-week',
      params: { id: route.params.id, week: serviceStore.selectedWeek }
    }"
    v-if="authStore.isUser"
    class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
    data-testid="edit-service-week-button"
  >
    <FontAwesomeIcon :icon="faCalendarCheck" class="text-md" />
    <span class="text-md font-medium">Editar mi disponibilidad</span>
  </RouterLink>
</template>

<style></style>
