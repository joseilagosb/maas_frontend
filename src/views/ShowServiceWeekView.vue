<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useServiceStore } from '@/stores/service';

import MainLayout from '@/components/layouts/Main.vue'
import ServiceOverview from '@/components/ServiceOverview.vue'

import ShowServiceWeekGrid from '@/components/show_service/ShowServiceWeekGrid.vue'
import ShowServiceActionButtons from '@/components/show_service/ShowServiceActionButtons.vue'

onBeforeMount(() => {
  // Si se navega a esta vista, debemos reiniciar el estado de la store para mostrar la semana actual inicialmente
  useServiceStore().$reset()
})
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
