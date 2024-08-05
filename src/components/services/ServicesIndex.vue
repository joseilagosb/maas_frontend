<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useHomeStore } from '@/stores/home';

const homeStore = useHomeStore()
const loading = ref(true)
const isErrorVisible = ref(false)

onMounted(() => {
  homeStore
    .fetchServices()
    .catch(() => {
      isErrorVisible.value = true
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
<template>
  <div v-if="loading" class="size-full flex items-center justify-center" data-testid="loading">
    <div class="flex flex-col gap-2 bg-yellow-200 p-8 rounded-lg shadow-md">
      <h4 class="text-2xl text-yellow-800">Cargando...</h4>
    </div>
  </div>
  <div v-else-if="isErrorVisible" data-testid="error-message" class="size-full flex items-center justify-center">
    <div class="flex flex-col gap-2 bg-red-300 p-8 rounded-lg shadow-md">
      <h4 class="text-2xl font-bold text-red-800 text-center">Ha ocurrido un error al cargar los servicios.</h4>
      <p class="text-xl text-red-800 text-center">
        Comprueba que tu conexión a internet esté activa y vuelve a intentarlo.
      </p>
    </div>
  </div>
  <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" data-testid="services">
    <RouterLink :to="`/services/${service.id}`" v-for="service in homeStore.services" :key="service.id"
      class="bg-orange-200 rounded-lg transform duration-300 hover:scale-[101%]" data-testid="service">
      <div class="w-full h-[100px] bg-orange-700 rounded-t-lg"></div>
      <h2 class="text-xl font-bold p-2">{{ service.name }}</h2>
    </RouterLink>
  </div>
</template>