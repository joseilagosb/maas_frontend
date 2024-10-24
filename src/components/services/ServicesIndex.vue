<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { useHomeStore } from '@/stores/home';

import { generateRandomNumbers } from '@/utils/common';

const homeStore = useHomeStore()
const loading = ref(true)
const isErrorVisible = ref(false)

const randomImageIds = ref<number[]>([])

const getImageUrl = (index: number) => new URL(`../../assets/images/service_images/${index}.jpg`, import.meta.url).href

onMounted(() => {
  homeStore
    .fetchServices()
    .catch(() => {
      isErrorVisible.value = true
    })
    .finally(() => {
      console.log(homeStore.services.length)
      randomImageIds.value.push(...generateRandomNumbers(homeStore.services.length, 1, 10))
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
  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="services">
    <div v-for="service in homeStore.services" :key="service.id"
      class="group/card flex flex-col rounded-lg bg-orange-300 shadow-xl md:flex-row" data-testid="service">
      <div class="h-48 md:h-auto min-w-full md:min-w-48 md:w-48 overflow-hidden">
        <img
          class="rounded-t-lg size-full object-cover md:!rounded-none md:!rounded-s-lg group-hover/card:scale-105 transition-transform duration-300"
          :src="getImageUrl(service.id)" alt="service preview" />
      </div>
      <div class="flex flex-col p-6 justify-between">
        <div>
          <h5 class="mb-2 text-4xl font-condensed-bold">{{ service.name }}</h5>
          <p class="mb-4 text-lg font-regular"> {{ service.description }} </p>
        </div>
        <RouterLink :to="`/services/${service.id}`"
          class="group/button self-end flex items-center justify-end p-4 gap-2 transition-colors duration-300 bg-orange-400 text-black hover:bg-orange-500">
          <span class="text-lg text-white group-hover/button:text-black font-condensed-medium uppercase">Ver
            turnos</span>
          <FontAwesomeIcon :icon="faChevronRight" class="text-2xl text-white group-hover/button:text-black" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>