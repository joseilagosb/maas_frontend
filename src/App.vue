<script setup lang="ts">
import { RouterView } from 'vue-router'

import dayjs from 'dayjs'
import { applyPlugins } from './utils/dayjs'
applyPlugins(dayjs)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
