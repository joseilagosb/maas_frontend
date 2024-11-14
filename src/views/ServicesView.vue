<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

import MainLayout from '@/components/layouts/Main.vue'
import PageLayout from '@/components/layouts/Page.vue'

import ServicesIndex from '@/components/services/ServicesIndex.vue'
import ServicesActionButtons from '@/components/services/ServicesActionButtons.vue'

const authStore = useAuthStore()
</script>

<template>
  <router-view>
    <MainLayout>
      <PageLayout>
        <template #content>
          <ServicesIndex />
        </template>
        <template #action-buttons>
          <ServicesActionButtons />
        </template>
      </PageLayout>
    </MainLayout>
  </router-view>
</template>

<style></style>
