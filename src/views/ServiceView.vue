<script setup lang="ts">
import { useRoute } from 'vue-router'

import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useServiceStore } from '@/stores/service'

import MainLayout from '@/components/layouts/Main.vue'
import ServiceOverview from '@/components/ServiceOverview.vue'
import ShowAvailabilityGrid from '@/components/ShowAvailabilityGrid.vue'

import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const serviceStore = useServiceStore()
</script>

<template>
  <MainLayout>
    <ServiceOverview>
      <template #action-buttons>
        <RouterLink
          :to="`/services/${route.params.id}/edit/${serviceStore.selectedWeek}`"
          v-if="authStore.isUser"
          class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
          data-testid="edit-availability-button"
        >
          <FontAwesomeIcon :icon="faCalendarCheck" class="text-md" />
          <span class="text-md font-medium">Editar mi disponibilidad</span>
        </RouterLink>
      </template>
      <template #grid>
        <ShowAvailabilityGrid />
      </template>
    </ServiceOverview>
  </MainLayout>
</template>
