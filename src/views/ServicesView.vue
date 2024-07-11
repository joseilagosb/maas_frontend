<script setup lang="ts">

import { useAuthStore } from '@/stores/auth';

import MainLayout from '@/components/layouts/Main.vue'
import PageLayout from '@/components/layouts/Page.vue'
import ServicesIndex from '@/components/ServicesIndex.vue';
import ServiceActionButtons from '@/components/ServiceActionButtons.vue';

const authStore = useAuthStore()
</script>

<template>
  <MainLayout>
    <PageLayout>
      <template #content>
        <ServicesIndex />
      </template>
      <template #action-buttons>
        <ServiceActionButtons />
      </template>
      <template v-if="authStore.isUser" #sidebar>
        <div class="flex flex-col gap-4 p-4" data-testid="my-available-hours">
          <h2 class="text-2xl font-bold">Mis horas disponibles</h2>
        </div>
      </template>
    </PageLayout>
  </MainLayout>
</template>

<style></style>