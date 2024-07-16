<script setup lang="ts">
import MainLayout from '@/components/layouts/Main.vue'
import ServiceOverview from '@/components/ServiceOverview.vue'

import ShowServiceWeekGrid from '@/components/show_service/ShowServiceWeekGrid.vue'
import ShowServiceActionButtons from '@/components/show_service/ShowServiceActionButtons.vue'
</script>

<template>
  <MainLayout>
    <ServiceOverview>
      <template #action-buttons>
        <ShowServiceActionButtons />
      </template>
      <template #grid>
        <ShowServiceWeekGrid />
      </template>
    </ServiceOverview>
  </MainLayout>
</template>
