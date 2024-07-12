<script setup lang="ts">
import { useRoute } from 'vue-router'

import MainLayout from '@/components/layouts/Main.vue'
import ServiceOverview from '@/components/ServiceOverview.vue'
import ShiftsGrid from '@/components/ShiftsGrid.vue'

import { useAuthStore } from '@/stores/auth'
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const route = useRoute()
const authStore = useAuthStore()
</script>

<template>
  <MainLayout>
    <ServiceOverview>
      <template #action-buttons>
        <RouterLink
          :to="`/services/${route.params.id}/edit`"
          v-if="authStore.isUser"
          class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
          data-testid="edit-availability-button"
        >
          <FontAwesomeIcon :icon="faCalendarCheck" class="text-md" />
          <span class="text-md font-medium">Editar mi disponibilidad</span>
        </RouterLink>
      </template>
      <template #grid>
        <ShiftsGrid />
      </template>
    </ServiceOverview>
  </MainLayout>
</template>
