<script setup lang="ts">
import { onBeforeMount } from 'vue';

import MainLayout from '@/components/layouts/Main.vue'
import ServiceOverview from '@/components/ServiceOverview.vue'
import EditServiceWeekGrid from '@/components/edit_service/EditServiceWeekGrid.vue'
import EditServiceActionButtons from '@/components/edit_service/EditServiceActionButtons.vue'

import { useServiceAvailabilityStore } from '@/stores/service_availability';

onBeforeMount(() => {
  useServiceAvailabilityStore().$reset()
})

</script>

<template>
  <MainLayout>
    <ServiceOverview>
      <template #action-buttons>
        <EditServiceActionButtons />
      </template>
      <template #grid>
        <EditServiceWeekGrid />
      </template>
    </ServiceOverview>
  </MainLayout>
</template>
