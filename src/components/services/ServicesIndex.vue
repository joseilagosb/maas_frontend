<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHomeStore } from '@/stores/home';
import { generateRandomNumbers } from '@/utils/common';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
      class="flex flex-col rounded-lg bg-orange-300 shadow-xl md:flex-row" data-testid="service">
      <img class="h-48 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:!rounded-none md:!rounded-s-lg"
        :src="getImageUrl(service.id)" alt="service preview" />
      <div class="flex flex-col justify-start p-6">
        <h5 class="mb-2 text-xl font-medium">{{ service.name }}</h5>
        <p class="mb-4 text-base"> {{ service.description }} </p>
        <RouterLink :to="`/services/${service.id}`"
          class="group self-end flex items-center justify-end p-4 gap-2 bg-orange-400 text-black hover:bg-orange-500">
          <span class="text-sm text-white group-hover:text-black font-medium">Ver turnos</span>
          <FontAwesomeIcon :icon="faChevronRight" class="text-2xl text-white group-hover:text-black" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>